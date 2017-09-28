module.exports = class Ontology {
    constructor(json) {
        if (!json) {
            throw new ReferenceError('null argument supplied to Ontology constructor');
        }
        for (let key in json) {
            if (json.hasOwnProperty(key)) {
                this[key] = json[key];
            }
        }
        this.objectProperties.forEach(objectProp => {
            objectProp.id = this._toQualifiedId(objectProp.id);
            objectProp.subject = this._toQualifiedId(objectProp.subject);
            objectProp.object = this._toQualifiedId(objectProp.object);
        });
        this.dataProperties.forEach(dataProp => {
            dataProp.id = this._toQualifiedId(dataProp.id);
            dataProp.domain = this._toQualifiedId(dataProp.domain);
        });
        this.classRelations.forEach(classRelation => {
           classRelation.subject = this._toQualifiedId(classRelation.subject);
           classRelation.object = this._toQualifiedId(classRelation.object);
        });
        this.classes.forEach(clazz => {
            clazz.id = this._toQualifiedId(clazz.id);
            clazz.superclasses = this._getSuperclasses(clazz.id);
        });
    }

    getPropertiesByClass(classId) {
        return this._getRelationsByClass(classId)
            .concat(this._getAttributesByClass(classId));
    }

    getRelation(relationId) {
        return this.objectProperties.find(rel => rel.id === relationId);
    }

    getRelationObject(relationId) {
        return this.getRelation(relationId).object;
    }

    getSubclasses(classId) {
        return this.classes
            .filter(clazz => clazz.superclasses.indexOf(classId) !== -1)
            .map(clazz => clazz.id);
    }

    _getRelationsByClass(classId) {
        const clazz = this.classes.find(clazz => clazz.id === classId);
        return this.objectProperties
            .filter(prop => clazz.superclasses.indexOf(prop.subject) !== -1)
            .map(prop => prop.id);
    }

    _getAttributesByClass(classId) {
        const clazz = this.classes.find(clazz => clazz.id === classId);
        return this.dataProperties
            .filter(prop => clazz.superclasses.indexOf(prop.domain) !== -1)
            .map(prop => prop.id)
    }

    _getSuperclasses(classId) {
        let superclasses = [classId];
        const subclassRelations = this.classRelations
            .filter(relation => relation.type === 'rdfs:subclassOf');
        let directSuperclasses = subclassRelations
            .filter(relation => relation.subject === classId)
            .map(relation => relation.object);
        superclasses.push(...directSuperclasses);
        for (let i = 1; i < superclasses.length; i++) {
            let superclassId = superclasses[i];
            let superSuperclasses = subclassRelations
                .filter(relation => relation.subject === superclassId)
                .map(relation => relation.object)
                .filter(object => superclasses.indexOf(object) === -1); //add super-superclass only if not present
            superclasses.push(...superSuperclasses);
        }
        return superclasses;
    }

    _toQualifiedId(id) {
        const ontologyId = this.id;
        return (ontologyId === Ontology.DEFAULT_ID) ? id : ontologyId + ":" + id;
    }

    static extractOntologyId(qualifiedId) {
        let array = qualifiedId.split(":");
        if (array.length === 1) {
            return Ontology.DEFAULT_ID;
        } else {
            return array[0];
        }
    }
};
module.exports.DEFAULT_ID = 'default';
