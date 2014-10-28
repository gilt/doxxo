'use strict';

var _ = require('underscore'),
  dox = require('dox'),
  handlebars = require('handlebars'),
  highlight = require('highlight.js'),
  fs = require('fs'),
  path = require('path');

module.exports = function doxxo (options) {

  var template,
    rendered;

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
      filename: options.infile || '',
      title: options.title || (options.infile && _.last(options.infile.split(path.sep))) || '',
      entries: options.json,
      css: options.css || 'http://cdn.rawgit.com/gilt/doxxo/master/static/docco.css'
    }

    return template(context);
  }

  options = options || {};

  if (options.buffer === undefined) {
    throw new Error('No buffer specified. Aborting.');
  }

  options.json = dox.parseComments(options.buffer, options);

  _.each(options.json, function (block) {
    if (block.code) {
      block.code = hilite(block.code);
    }
  });

  template = loadTemplate();
  rendered = render();

  console.log(rendered);

};
