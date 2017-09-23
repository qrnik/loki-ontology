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
            .reduce(Ontologies._flatten, [])
            .map(clazz => clazz.qualifiedId);
    }

    searchClasses(term) {
        return this.classes.filter(qid => Ontologies._matchQualifiedId(qid, term));
    }

    searchRelations(categories, term) {
        const relations = this._getRelationsByClass(categories);
        return relations.filter(qid => Ontologies._matchQualifiedId(qid, term))
    }

    _getRelationsByClass(categories) {
        return categories
            .map(Ontology.splitQualifiedId)
            .map(array => {
                let [ontId, clazz] = array;
                return this.all.find(ont => ont.id === ontId).getRelationsByClass(clazz);
            })
            .reduce(Ontologies._flatten, []);
    }

    static _flatten(accumulator, current) {
        return accumulator.concat(current);
    }

    static _matchQualifiedId(qid, term) {
        return qid.split(":")
            .concat([qid])
            .some(word => word.startsWith(term));
    }

};
