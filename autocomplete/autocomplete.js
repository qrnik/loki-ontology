const Ontologies = require('./class/Ontologies.js');
const Autocomplete = require('./class/Autocomplete.js');
const Scanner = require('./class/Scanner.js');

const setup = function (jsonArray) {
    const ontologies = new Ontologies(jsonArray);
    const textarea = document.getElementById('wiki__text');
    const autocomplete = new Autocomplete(textarea, ontologies);
    autocomplete.register(autocomplete.strategy.CLASS, autocomplete.strategy.CATEGORY);
    const scanner = new Scanner(textarea);
    autocomplete.setScanner(scanner);
};

jQuery(document).ready(function () {
    jQuery.getJSON("data/pages/special/ontology/onto.json", setup);
});



