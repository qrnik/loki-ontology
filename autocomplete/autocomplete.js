"use strict";
const Textcomplete = require('textcomplete/lib/textcomplete');
const Textarea = require('textcomplete/lib/textarea');

const classSearch = function (term, callback) {
    const defaultOntology = window.ontology.find(ont => ont.id === 'default');
    const defaultClasses = defaultOntology ? defaultOntology.classes.map(c => c.id) : [];
    let qualifiedClasses = [];
    window.ontology.filter(ont => ont.id !== 'default').forEach(
        ont => ont.classes.forEach(c => qualifiedClasses.push(ont.id + ":" + c.id))
    );
    let matchedClasses = defaultClasses.filter(name => name.startsWith(term));
    matchedClasses = matchedClasses.concat(qualifiedClasses.filter(name => name.split(":").some(w => w.startsWith(term))));
    callback(matchedClasses);
};

const setup = function (ontology) {
    window.ontology = ontology;
    const classStrategy = {
        id: 'class',
        match: /(\[\[category:)([a-z0-9_\-.:]*)$/,
        search: classSearch,
        template: function (name) {
            return name;
        },
        replace: function (name) {
            return '$1:' + name + ']]';
        }
    };


    const editor = new Textarea.default(document.getElementById('wiki__text'));
    const textcomplete = new Textcomplete.default(editor);
    textcomplete.register([classStrategy]);
};

jQuery(document).ready(function () {
    jQuery.getJSON("data/pages/special/ontology/onto.json", setup);
});



