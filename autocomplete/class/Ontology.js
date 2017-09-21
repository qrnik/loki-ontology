module.exports = class Ontology {
    constructor(json) {
        for (let key in json) {
            if (json.hasOwnProperty(key)) {
                this[key] = json[key];
            }
        }
        this._subclassRelations = this.classRelations.filter(relation => relation.type === 'rdfs:subclassOf');
        this.classes.forEach(clazz => {
            clazz.superclasses = this._getSuperclasses(clazz.id);
            this._addQualifiedId(clazz);
        });
        this.objectProperties.forEach(objectProp => this._addQualifiedId(objectProp));
        this.dataProperties.forEach(dataProp => this._addQualifiedId(dataProp));
    }

    _getSuperclasses(classId) {
        let superclasses = [classId];
        let directSuperclasses = this._subclassRelations
            .filter(relation => relation.subject === classId)
            .map(relation => relation.object);
        superclasses.push(...directSuperclasses);
        for (let i = 1; i < superclasses.length; i++) {
            let superclassId = superclasses[i];
            let superSuperclasses = this._subclassRelations
                .filter(relation => relation.subject === superclassId)
                .map(relation => relation.object)
                .filter(object => superclasses.indexOf(object) === -1); //add super-superclass only if not present
            superclasses.push(...superSuperclasses);
        }
        return superclasses;
    }

    _addQualifiedId(element) {
        element.qualifiedId = this._toQualifiedId(element.id);
    }

    _toQualifiedId(elementId) {
        return (this.id === Ontology.DEFAULT_ID) ? elementId : this.id + ":" + elementId;
    }
};
module.exports.DEFAULT_ID = 'default';