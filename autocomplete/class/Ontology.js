module.exports = class Ontology {
    constructor(json) {
        for (let key in json) {
            if (json.hasOwnProperty(key)) {
                this[key] = json[key];
            }
        }
        this._subclassRelations = this.classRelations.filter(r => r.type === 'rdfs:subclassOf');
        this.classes.forEach(c => c.superclasses = this._getSuperclasses(c.id));
    }

    _getSuperclasses(classId) {
        let superclasses = [classId];
        let directSuperclasses = this._subclassRelations.filter(r => r.subject === classId).map(r => r.object);
        superclasses.push(...directSuperclasses);
        for (let i = 1; i < superclasses.length; i++) {
            let superclassId = superclasses[i];
            let superSuperclasses = this._subclassRelations
                .filter(r => r.subject === superclassId)
                .map(r => r.object)
                .filter(o => superclasses.indexOf(o) === -1); //add super-superclass only if not present
            superclasses.push(...superSuperclasses);
        }
        return superclasses;
    }
}