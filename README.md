# loki-ontology

[DokuWiki](https://www.dokuwiki.org/dokuwiki#) plugin enhancing usage of the [Loki](http://loki.ia.agh.edu.pl/wiki/docs:loki-about).  

## Features
- editor that lets you create ontologies used in wiki,
- autocompletion of categories, attributes, relations and relation objects (all described in ontologies),
- detection of semantic errors in pages, such as wrong relation used in page source.

## Installation
Go to [Releases](https://github.com/pwamej/loki-ontology/releases) page for plugin's newest release. Plugin was tested on Chrome 62 and Firefox 57, Loki release 2017-09-19, DokuWiki release 2017-02-19e "Frusterick Manners".

## Build from source
I use [Browserify](http://browserify.org/) along with [Babelify](https://github.com/babel/babelify) transform to manage modularity and guarantee compability with older browsers. If you want to bundle code by yourself, this short guide should help.

### Dependencies
I use modified version of [highlight-within-textarea](https://github.com/lonekorean/highlight-within-textarea) plugin to suit my needs. After pulling dependencies with npm, you should pull [my fork](https://github.com/pwamej/highlight-within-textarea) into `node_modules/higlight-within-textarea`.