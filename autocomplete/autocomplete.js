const Textcomplete = require('textcomplete/lib/textcomplete');
const Textarea = require('textcomplete/lib/textarea');
const Ontologies = require('./class/Ontologies.js');

function triggerAfterReplace(textcomplete, editor) {
    //workaround - no idea how to execute it after replace
    setTimeout(function () {
        textcomplete.trigger(editor.getBeforeCursor());
    }, 200);
}

const setup = function (jsonArray) {
    window.ontologies = new Ontologies(jsonArray);
    window.categories = [];
    const textarea = document.getElementById('wiki__text');
    const editor = new Textarea.default(textarea);
    const textcomplete = new Textcomplete.default(editor);
    const classStrategy = {
        id: 'class',
        match: /(\[\[category:)([a-z0-9_\-.:]*)$/,
        search: (term, callback) => callback(ontologies.searchClasses(term)),
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
            triggerAfterReplace(textcomplete, editor);
            return '$1' + name + ':';
        }
    };
    textcomplete.register([classStrategy, categoryStrategy]);
};

jQuery(document).ready(function () {
    jQuery.getJSON("data/pages/special/ontology/onto.json", setup);
});



