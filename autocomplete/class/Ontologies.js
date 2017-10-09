const Ontology = require('./Ontology.js');

module.exports = class Ontologies {
    constructor(jsonArray) {
        if (!jsonArray) {
            throw new ReferenceError('null argument supplied to Ontologies constructor');
        }
        this.all = jsonArray.map(json => new Ontology(json));
        this.classes = this.all
            .map(ont => ont.classes)
            .reduce(Ontologies._flatten, [])
            .map(clazz => clazz.id);
    }

    searchClasses(term) {
        return this.classes.filter(id => Ontologies._matchId(id, term));
    }

    searchProperties(categories, term) {
        const properties = this._getPropertiesByClass(categories);
        return properties.filter(id => Ontologies._matchId(id, term))
    }

    isRelation(relationId) {
        return this._delegate(Ontology.prototype.getRelation, relationId);
    }

    getRelationObject(relationId) {
        return this._delegate(Ontology.prototype.getRelationObject, relationId);
    }

    getSubclasses(classId) {
        return this._delegate(Ontology.prototype.getSubclasses, classId);
    }

    _getPropertiesByClass(categories) {
        return categories
            .map(classId => this._delegate(Ontology.prototype.getPropertiesByClass, classId))
            .reduce(Ontologies._flatten, []);
    }

    _delegate(operation, id) {
        const ontId = Ontology.extractOntologyId(id);
        const ontology = this._getOntologyById(ontId);
        return operation.call(ontology, id);
    }

    _getOntologyById(ontId) {
        return this.all.find(ont => ont.id === ontId);
    }

    static _flatten(accumulator, current) {
        return accumulator.concat(current);
    }

    static _matchId(id, term) {
        return id.split(":")
            .concat([id])
            .some(word => word.startsWith(term));
    }
};
