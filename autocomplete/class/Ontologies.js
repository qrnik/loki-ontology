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

    searchProperties(categories, term) {
        const relations = this._getPropertiesByClass(categories);
        return relations.filter(qid => Ontologies._matchQualifiedId(qid, term))
    }

    isRelation(qualifiedId) {
        const [ontId, relId] = Ontology.splitQualifiedId(qualifiedId);
        return this.all
            .find(ont => ont.id === ontId)
            .objectProperties
            .find(rel => rel.id === relId);
    }

    _getPropertiesByClass(categories) {
        return categories
            .map(Ontology.splitQualifiedId)
            .map(array => {
                let [ontId, clazz] = array;
                return this.all.find(ont => ont.id === ontId).getPropertiesByClass(clazz);
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
