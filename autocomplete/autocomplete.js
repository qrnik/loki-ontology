"use strict";
const Textcomplete = require('textcomplete/lib/textcomplete');
const Textarea = require('textcomplete/lib/textarea');
const Ontology = require('./class/Ontology.js');

const classSearch = function (term, callback) {
    const defaultClasses = defaultOntology ? defaultOntology.classes.map(c => c.id) : [];
    let qualifiedClasses = [];
    qualifiedOntology.forEach(
        ont => ont.classes.forEach(c => qualifiedClasses.push(ont.id + ":" + c.id))
    );
    const matchedDefaultClasses = defaultClasses.filter(name => name.startsWith(term));
    const matchedQualifiedClasses = qualifiedClasses.filter(name => name.split(":").some(w => w.startsWith(term)));
    const matchedClasses = matchedDefaultClasses.concat(matchedQualifiedClasses);
    callback(matchedClasses);
};

function triggerTextcompleteAfterReplace() {
    //workaround - no idea how to execute it after replace
    setTimeout(function () {
        textcomplete.trigger(editor.getBeforeCursor());
    }, 200);
}

const setup = function (jsonArray) {
    window.ontologies = jsonArray.map(json => new Ontology(json));
    window.defaultOntology = ontologies.find(ont => ont.id === 'default');
    window.qualifiedOntology = ontologies.filter(ont => ont.id !== 'default');
    window.categories = [];
    const textarea = document.getElementById('wiki__text');
    const editor = new Textarea.default(textarea);
    const textcomplete = new Textcomplete.default(editor);
    const classStrategy = {
        id: 'class',
        match: /(\[\[category:)([a-z0-9_\-.:]*)$/,
        search: classSearch,
        replace: function (name) {
            return '$1' + name + ']]';
        }
    };
    const categoryStrategy = {
        id: 'category',
        match: /(\[\[)([a-z0-9_\-.:]*)$/,
        search: function(term, callback) {
            callback(['category'].filter(w => w.startsWith(term)));
        },
        replace: function (name) {
            triggerTextcompleteAfterReplace();
            return '$1' + name + ':';
        }
    };
    textcomplete.register([classStrategy, categoryStrategy]);
};

jQuery(document).ready(function () {
    jQuery.getJSON("data/pages/special/ontology/onto.json", setup);
});



