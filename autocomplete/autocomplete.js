const Ontologies = require('./class/Ontologies.js');
const Autocomplete = require('./class/Autocomplete.js');

const setup = function (jsonArray) {
    const ontologies = new Ontologies(jsonArray);
    const textarea = document.getElementById('wiki__text');
    const autocomplete = new Autocomplete(textarea, ontologies);
    document.getElementById('dw__editform').onsubmit = autocomplete._scanner.validate.bind(autocomplete._scanner);
};

jQuery(document).ready(function () {
    setup(JSON.parse(JSINFO['onto']));
});



