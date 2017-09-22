const Ontology = require('./Ontology.js');

module.exports = class Ontologies {
    constructor(jsonArray) {
        if (!jsonArray) {
            throw new ReferenceError('null argument supplied to Ontologies constructor');
        }
        this.all = jsonArray.map(json => new Ontology(json));
        this.defaultOntology = this.all.find(ont => ont.id === Ontology.DEFAULT_ID);
        this.qualified = this.all.filter(ont => ont.id !== Ontology.DEFAULT_ID);
        this.classes = this.all
            .map(ont => ont.classes)
            .reduce((acc, cur) => acc.concat(cur), [])
            .map(clazz => clazz.qualifiedId);
    }

    searchClasses(term) {
        return this.classes.filter(
            id => id.split(":").some(word => word.startsWith(term))
        );
    }
};
