"use strict";
const Textcomplete = require('textcomplete/lib/textcomplete');
const Textarea = require('textcomplete/lib/textarea');

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

const setup = function (data) {
    window.ontology = data;
    ontology.forEach(
        ont => {
            const subclassRelations = ont.classRelations.filter(r => r.type === 'rdfs:subclassOf');
            ont.classes.forEach(c => {
                c.superclasses = [c.id];
                let directSuperclasses = subclassRelations.filter(r => r.subject === c.id).map(r => r.object);
                c.superclasses.push(...directSuperclasses);
                for (let i = 1; i < c.superclasses.length; i++) {
                    let superclass = c.superclasses[i];
                    let superSuperclasses = subclassRelations
                        .filter(r => r.subject === superclass)
                        .map(r => r.object)
                        .filter(o => c.superclasses.indexOf(o) === -1);
                    c.superclasses.push(...superSuperclasses);
                }
            })
        }
    );
    window.defaultOntology = ontology.find(ont => ont.id === 'default');
    window.qualifiedOntology = ontology.filter(ont => ont.id !== 'default');
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



