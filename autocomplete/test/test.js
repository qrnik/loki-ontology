const Ontologies = require('../class/Ontologies.js');
const Ontology = require('../class/Ontology.js');
const Scanner = require('../class/Scanner.js');

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
        expect(ontologies.searchClasses("media:ac")).toEqual(['media:actor']);
    });
});

describe("Scanner", function() {
    beforeAll(function() {
        window.textarea = document.createElement('textarea');
        window.scanner = new Scanner(textarea);
    });

    it("detects categories on input", function() {
        const CATEGORY = 'media:text';
        textarea.innerText =`ddd[[category:${CATEGORY}]]`;
        textarea.dispatchEvent(new Event('input'));
        expect(scanner.categories).toContain(CATEGORY);
        textarea.innerText = '';
        textarea.dispatchEvent(new Event('input'));
        expect(scanner.categories).not.toContain(CATEGORY);

        const ASK_OPEN = '{{#ask:';
        const ASK_CLOSE = '}}';
        textarea.innerText = `${ASK_OPEN} [[category:${CATEGORY} ${ASK_CLOSE}`;
        textarea.dispatchEvent(new Event('input'));
        expect(scanner.categories).not.toContain(CATEGORY);
   });

    it("emits 'scan' event on input", function() {
        let flag = false;
        scanner.emitter.on('scan', () => flag = true);
        expect(flag).toBe(false);
        textarea.dispatchEvent(new Event('input'));
        expect(flag).toBe(true);
    });
});
