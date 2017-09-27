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

    isRelation(relationId) {
        return this._dispatch(Ontology.prototype.isRelation, relationId);
    }

    getRelationObject(relationId) {
        return this._dispatch(Ontology.prototype.getRelationObject, relationId);
    }

    getSubclasses(classId) {
        return this._dispatch(Ontology.prototype.getSubclasses, classId);
    }

    _dispatch(operation, qualifiedId) {
        const [ontId, id] = Ontology.splitQualifiedId(qualifiedId);
        const ontology = this._getOntologyById(ontId);
        return operation.call(ontology, id);
    }

    _getOntologyById(ontId) {
        return this.all.find(ont => ont.id === ontId);
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
