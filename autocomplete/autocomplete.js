const Ontologies = require('./class/Ontologies.js');
const Autocomplete = require('./class/Autocomplete.js');

const setup = function (jsonArray) {
    window.ontologies = new Ontologies(jsonArray);
    const textarea = document.getElementById('wiki__text');
    const autocomplete = new Autocomplete(textarea, ontologies);
    autocomplete.register(autocomplete.strategy.CLASS, autocomplete.strategy.CATEGORY);
};

jQuery(document).ready(function () {
    jQuery.getJSON("data/pages/special/ontology/onto.json", setup);
});



