const Ontologies = require('../class/Ontologies.js');
const Ontology = require('../class/Ontology.js');
function getOntoJson() {
    window.ontologies = new Ontologies(readJSON('test/onto.json'));
}

describe("Ontologies", function() {
    beforeEach(getOntoJson);

    it("have a default ontology", function() {
        expect(ontologies.defaultOntology.id).toBe(Ontology.DEFAULT_ID);
    });

    it("have qualifiedId on classes", function() {
        const qualifiedOntology = ontologies.qualified[0];
        const qualifiedClazz = qualifiedOntology.classes[0];
        const qualifiedId = qualifiedOntology.id + ":" + qualifiedClazz.id;
        expect(qualifiedClazz.qualifiedId).toBe(qualifiedId);

        const defaultClazz = ontologies.defaultOntology.classes[0];
        expect(defaultClazz.qualifiedId).toBe(defaultClazz.id);
    });

    it("have classes that can be searched", function() {
        expect(ontologies.searchClasses("me")).toEqual(ontologies.qualified[0].classes.map(c => c.qualifiedId));
        expect(ontologies.searchClasses("ac")).toEqual(['media:actor']);
    });
});