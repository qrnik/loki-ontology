# LokiOntology

[DokuWiki](https://www.dokuwiki.org/dokuwiki#) plugin that adds ontology support to [Loki](http://loki.ia.agh.edu.pl/wiki/docs:loki-about). This makes process of creating knowledge base easier by validating semantic information on pages.

## Features
- editor that lets you create ontologies used in wiki,
- autocompletion of categories, attributes, relations and relation objects (all described in ontologies),
- detection of semantic errors in pages, such as wrong relation used in page source.

## Installation
Download plugin's newest release from [Releases](https://github.com/pwamej/loki-ontology/releases) page. 
LokiOntology requires DokuWiki with Loki plugin installed. In order to install plugin, go to DokuWiki Administration panel -> Extension Manager -> Manual Install then select downloaded  archive. Alternatively, you can extract archive to `lib/plugins` directory inside your DokuWiki installation.

Plugin was tested on Chrome 62 and Firefox 57, Loki release 2017-09-19, DokuWiki release 2017-02-19e "Frusterick Manners".

## Usage
LokiOntology uses ontologies (defined by you) to provide semantic validation on DokuWiki pages. In order to make use of it, you should define at least one ontology. 
Ontology is simply a page created in `special:ontology` namespace. When you create such page, semi-graphical editor is enabled allowing you to define categories, attributes and object relations.

Now, while editing a regular (non-ontology page), after typing `[[category:` you receive suggestions of defined categories. After selecting at least one, you receive suggestions of relations and attributes.

Another feature is suggesting relation objects (pages) using SPARQL endpoint (enabled by default in Loki). For example, with defined relation `author isAuthorOf book`, if you are editing author's page, after typing `[[isAuthorOf::` you receive list of pages categorized as `book`.
In order to validate existing pages' semantic information correctness, you have to open such page for editing. Then, any semantic errors are highlighted; also on save attempt there is a popup informing about such errors.

### Namespaces
In order to avoid ID collision between ontologies, namespaces are used. You can define one default ontology on `special:ontology:default` page - this ontology is available without namespace, e.g. `[[category:author]]`, `[[isAuthorOf::iliad]]`. 

If you define another ontology, for example `special:ontology:movies`, all of it's categories, attributes and relations receive `movies` namespace, e.g. `[[category:movies:actor]]`, `[[movies:playsIn::tomb_raider]]`.


## Build from source
I use [Browserify](http://browserify.org/) along with [Babelify](https://github.com/babel/babelify) transform to manage modularity and guarantee compability with older browsers. Here are the steps you should follow if you want to reproduce my build:

1. To begin with, you require [npm](https://www.npmjs.com/) to be installed.
2. Navigate to `lokiontology/autocomplete` and execute `npm install`.
3. Currently I use modified version of [highlight-within-textarea](https://github.com/lonekorean/highlight-within-textarea) plugin to suit my needs. After pulling dependencies with `npm`, you should pull [my fork](https://github.com/pwamej/highlight-within-textarea) into `node_modules/higlight-within-textarea`.
4. Execute `browserify autocomplete.js class/* -t babelify -o dist/bundle.js` to bundle code.