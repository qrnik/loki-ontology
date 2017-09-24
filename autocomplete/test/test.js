const Ontologies = require('../class/Ontologies.js');
const Ontology = require('../class/Ontology.js');
const Scanner = require('../class/Scanner.js');
const Autocomplete = require('../class/Autocomplete.js');
const Query = require('../class/Query.js');

function getOntoJson() {
    window.ontologies = new Ontologies(readJSON('test/onto.json'));
}

describe("Ontologies", function () {
    beforeEach(getOntoJson);

    it("have a default ontology", function () {
        expect(ontologies.defaultOntology.id).toBe(Ontology.DEFAULT_ID);
    });

    it("have qualifiedId on classes", function () {
        const qualifiedOntology = ontologies.qualified[0];
        const qualifiedClazz = qualifiedOntology.classes[0];
        const qualifiedId = qualifiedOntology.id + ":" + qualifiedClazz.id;
        expect(qualifiedClazz.qualifiedId).toBe(qualifiedId);

        const defaultClazz = ontologies.defaultOntology.classes[0];
        expect(defaultClazz.qualifiedId).toBe(defaultClazz.id);
    });

    it("have classes that can be searched", function () {
        expect(ontologies.searchClasses("me")).toEqual(ontologies.qualified[0].classes.map(c => c.qualifiedId));
        expect(ontologies.searchClasses("ac")).toEqual(['media:actor']);
        expect(ontologies.searchClasses("media:ac")).toEqual(['media:actor']);
    });

    it("have properties that can be searched", function() {
        const expectedActorProperties = new Set(['media:playsIn', 'media:isConnectedWith']);
        expect(new Set(ontologies.searchProperties(['media:actor'], ''))).toEqual(expectedActorProperties);
        const expectedMediathingProperties = new Set(['media:name', 'media:year']);
        expect(new Set(ontologies.searchProperties(['media:mediathing'], ''))).toEqual(expectedMediathingProperties);
    });

    it("allows to check whether something is relation", function() {
       expect(ontologies.isRelation('media:playsIn')).toBeTruthy();
       expect(ontologies.isRelation('media:name')).toBeFalsy();
    });
});

describe("Ontology", function () {
    beforeEach(function () {
        getOntoJson();
        window.mediaOntology = ontologies.qualified[0];
    });

    it("has superclass field on each class", function () {
        const classicCdClass = mediaOntology.classes.find(c => c.id === 'classiccd');
        const correctSuperclasses = new Set(['classiccd', 'musiccd', 'mediathing']);
        expect(new Set(classicCdClass.superclasses)).toEqual(correctSuperclasses);
    });

    it("can turn qualifiedId to array", function() {
        expect(Ontology.splitQualifiedId('media:actor')).toEqual(['media','actor']);
        expect(Ontology.splitQualifiedId('class')).toEqual([Ontology.DEFAULT_ID, 'class']);
    });

    it("can find relations by subject's class", function() {
        const correctRelations = new Set(['media:isConnectedWith', 'media:playsIn']);
        expect(new Set(mediaOntology._getRelationsByClass('actor'))).toEqual(correctRelations);
    });

    it("can find attributes by subject's class", function() {
       const correctAttributes = new Set(['media:name', 'media:year']);
        expect(new Set(mediaOntology._getAttributesByClass('musiccd'))).toEqual(correctAttributes);
    });
});

function write(textarea, text) {
    textarea.value = text;
    textarea.dispatchEvent(new Event('input'));
}

describe("Scanner", function () {
    beforeAll(function () {
        window.textarea = document.createElement('textarea');
        window.scanner = new Scanner(textarea);
    });

    it("detects categories on input", function () {
        const CATEGORY = 'media:text';
        write(textarea, `ddd[[category:${CATEGORY}]]`);
        expect(scanner.categories).toContain(CATEGORY);
        write(textarea, '');
        expect(scanner.categories).not.toContain(CATEGORY);

        const ASK_OPEN = '{{#ask:';
        const ASK_CLOSE = '}}';
        write(textarea, `${ASK_OPEN} [[category:${CATEGORY} ${ASK_CLOSE}`);
        expect(scanner.categories).not.toContain(CATEGORY);
   });

    it("emits 'scan' event on input", function () {
        let flag = false;
        scanner.emitter.on('scan', () => flag = true);
        expect(flag).toBe(false);
        write(textarea, '');
        expect(flag).toBe(true);
    });
});

describe("Autocomplete", function () {
    function autocompletion(text) {
        write(textarea, text);
        autocomplete._textcomplete.trigger(textarea.value);
        const itemArray = Array.from(document.getElementsByClassName('textcomplete-item'));
        return itemArray.map(i => i.firstChild.innerText);
    }

    beforeEach(function () {
        getOntoJson();
        window.textarea = document.createElement('textarea');
        window.autocomplete = new Autocomplete(textarea, ontologies);
        window.scanner = new Scanner(textarea);
        autocomplete.setScanner(scanner);
        Array.from(document.getElementsByClassName('textcomplete-item')).map(i => i.remove());
    });

    it("tracks categories defined in textarea", function () {
        const CATEGORY = 'test';
        write(textarea, `[[category:${CATEGORY}]]`);
        expect(autocomplete._categories).toEqual(['test']);
    });

    it("allows to complete '[[category:'", function () {
        const completion = autocompletion('[[');
        expect(completion).toContain('category');
        //TODO: select item
    });

    it("allows to complete classes", function () {
        const completionClasses = autocompletion('[[category:');
        expect(new Set(completionClasses)).toEqual(new Set(ontologies.classes));
    });

    it("allows to complete relations", function () {
        write(textarea, '[[category:media:actor]]');
        const completion = autocompletion(textarea.value + '[[');
        expect(completion).toContain('media:isConnectedWith');
        expect(completion).toContain('media:playsIn');
    });

    it("allows to complete attributes", function () {
        write(textarea, '[[category:media:mediathing]]');
        const completion = autocompletion(textarea.value + '[[');
        expect(completion).toContain('media:name');
        expect(completion).toContain('media:year');
    });
});

describe("Query", function() {
   it("constructs valid SPARQL query", function () {
       const expected = 'SELECT ?page WHERE {?page a ?cat . FILTER (?cat="test"||?cat="movie")}';
       expect(Query.selectPages.categoryIn(['test', 'movie']).build()).toBe(expected);
   });
});
