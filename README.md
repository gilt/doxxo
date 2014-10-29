doxxo
=========

A fork of [dox-docco](https://github.com/aearly/dox-docco), which is a [docco](http://jashkenas.github.com/docco/)-like formatter for the [dox](https://github.com/visionmedia/dox) comment parser using [Handlebars.js](http://handlebarsjs.com/).

How does this differ from dox-docco?
--------------------------------

The dependence upon pygments and python has been removed, doxxo fixes a few issues with dox-docco related to parameters and adds some extra readability improvements. doxxo also uses Handlebars instead of Dust.js templates, because we dig Handlebars.

How does this differ from [groc](https://github.com/nevir/groc)?
--------------------------------

Firstly, groc is CoffeeScript, doxxo is straight up Javascript. doxxo makes use of a large chunk of the groc [default style](https://github.com/nevir/groc/tree/master/lib/styles/default) but with a ton of modifications. doxxo also only offers [highlight.js](https://highlightjs.org) syntax highlighting, which makes changing styles/themes really easy.

How does this differ from Docco?
--------------------------------

Dox parses block style JS comments, while Docco parses single-line comments. In effect, this is Docco for block-style comments. We also wanted to create an example Dox template using Handlebars templates.This basically glues these 3 technologies together.

Install
-------
```npm install -g doxxo```

Usage
-----
```
Usage: doxxo [options]

Options:

  -h, --help      Output usage information
  -V, --version   Output the version number
  --out           The file to output to.  Default is stdout')
  --in            The file to read in.  Deafult is stdin')
  --behavior      The behavior js file to use.  Default is github hosted.')
  --style         The style css file to use.  Default is github hosted.')
  --syntax        The syntax highlighting (highlight.js) css file to use.  Default is github hosted.')
  --template      The handlebars template to use.  Default is static/template.handlebars.')
  --title         The title of the output document.  Deafult is the input file name, or '' for stdin
```
