module.exports = class Ontology {
    constructor(json) {
        Ontology.DEFAULT_ID = 'default';
        for (let key in json) {
            if (json.hasOwnProperty(key)) {
                this[key] = json[key];
            }
        }
        this._subclassRelations = this.classRelations.filter(r => r.type === 'rdfs:subclassOf');
        this.classes.forEach(clazz => {
            clazz.superclasses = this._getSuperclasses(clazz.id);
            clazz.qualifiedId = this.toQualifiedId(clazz.id);
        });
        this.relations.forEach(relation => relation.qualifiedId = this._toQualifiedId(relation.id));
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

    _toQualifiedId(elementId) {
        return (this.id === Ontology.DEFAULT_ID) ? elementId : this.id + ":" + elementId;
    }
}