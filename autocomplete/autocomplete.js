const Ontologies = require('./class/Ontologies.js');
const Autocomplete = require('./class/Autocomplete.js');

const setup = function (jsonArray) {
    const ontologies = new Ontologies(jsonArray);
    const textarea = document.getElementById('wiki__text');
    new Autocomplete(textarea, ontologies);
};

jQuery(document).ready(function () {
    jQuery.getJSON("data/pages/special/ontology/onto.json", setup);
});



