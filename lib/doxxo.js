'use strict';

var _ = require('underscore'),
  dox = require('dox'),
  handlebars = require('handlebars'),
  highlight = require('highlight.js'),
  fs = require('fs'),
  path = require('path'),
  markdown = require( "markdown" ).markdown;

module.exports = function doxxo (options) {

  var template,
    rendered,
    params,
    notes,
    examples;

  function hilite (what) {

    var result = '',
      blocks = [],
      extension;

    if (options.infile) {
      extension = path.extname(options.infile).substring(1);
      result = highlight.highlight(extension, what)
    }
    else {
      result = highlight.highlightAuto(what);
    }

    return result.value;
  }

  function loadTemplate () {
    var filename = options.template || path.join(__dirname, '..', 'static', 'template.handlebars'),
      content = fs.readFileSync(filename) || '';

    return handlebars.compile(content.toString());
  }

  function render () {
    var context = {
      file: {
        name: options.in || '',
        path: options.in || '',
        url: ''
      },
      blocks: options.json,
      css: options.css,
      behavior: options.behavior
    }

    return template(context);
  }

  options = _.extend({
      raw: true,
      skipPrefixes: ['jshint', 'global'],
      behavior: options.behavior || 'http://rawgit.com/gilt/doxxo/master/static/behavior.js',
      css: {
        style: options.style || 'http://rawgit.com/gilt/doxxo/master/static/doxxo.css',
        syntax: options.syntax || 'http://rawgit.com/isagalaev/highlight.js/master/src/styles/monokai_sublime.css'
      }
    },
    options);

  if (options.buffer === undefined) {
    throw new Error('No buffer specified. Aborting.');
  }

  options.json = dox.parseComments(options.buffer, options);

  _.each(options.json, function (block) {

    if (block.code) {
      block.code = hilite(block.code);
    }

    if (block.tags) {

      params = [];
      notes = [];
      examples = [];

      _.each(block.tags, function (tag) {
        var param;

        if (tag.type === 'param'){
          param = _.extend({}, tag);

          if (tag.types && tag.types.length) {
            param.type = tag.types.join(' | ');
          }
          else {
            param.type = null;
          }

          delete param.types;

          params.push(param);
        }

        if (tag.type === 'module') {
          block.module = tag.string;
        }

        if (tag.type === 'example') {
          examples.push(markdown.toHTML(tag.string));
        }

        if (tag.type === 'howto') {
          block.howto = markdown.toHTML(tag.string);
        }

        if (tag.type === 'note') {
          notes.push(markdown.toHTML(tag.string));
        }
      });

      if (params.length) {
        block.parameters = params;
      }

      if (notes.length) {
        block.notes = notes;
      }

      if (examples.length) {
        block.examples = examples;
      }

      block.scope = _.find(block.tags, function (tag) {
        return tag.type && tag.visibility;
      });

      block.returns = _.find(block.tags, function (tag) {
        return tag.type === 'return';
      });

      block.scope = block.scope ? block.scope.type : null;
      block.docSection = !!block.notes || !!block.params || !!block.howto || !!block.examples

      if (block.returns) {
        block.returns = {
          type: block.returns.types.join(' | '),
          description: block.returns.description
        }
      }

      var entityType = _.find(block.tags, function (tag) {
        return _.contains(['method', 'func', 'function', 'property', 'prop'], tag.type);
      });

      if (entityType) {
        block.type = entityType.type;
        // if the entity type is a property, dox assumes it's a regular property and munges
        // the object's properties.
        block.name = entityType.string || entityType.name || entityType.types[0];
      }
    }
  });

  template = loadTemplate();
  rendered = render();

  if (options.out) {
    fs.writeFileSync(options.out, rendered);
  }
  else {
    console.log(rendered);
  }

};
