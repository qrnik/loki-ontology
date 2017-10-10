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

    it("have classes that can be searched", function () {
        expect(ontologies.searchClasses("me")).toEqual(ontologies._getOntologyById('media').classes.map(c => c.id));
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

    it("allows to find relation object", function () {
       expect(ontologies.getRelationObject('media:playsIn')).toBe('media:movie');
    });
});

describe("Ontology", function () {
    beforeEach(function () {
        getOntoJson();
        window.mediaOntology = ontologies._getOntologyById('media');
    });

    it("has superclass field on each class", function () {
        const classicCdClass = mediaOntology.classes.find(c => c.id === 'media:classiccd');
        const correctSuperclasses = new Set(['media:classiccd', 'media:musiccd', 'media:mediathing']);
        expect(new Set(classicCdClass.superclasses)).toEqual(correctSuperclasses);
    });

    it("can extract ontology name from id", function() {
        expect(Ontology.extractOntologyId('media:actor')).toEqual('media');
        expect(Ontology.extractOntologyId('class')).toEqual(Ontology.DEFAULT_ID);
    });

    it("can find relations by subject's class", function() {
        const correctRelations = new Set(['media:isConnectedWith', 'media:playsIn']);
        expect(new Set(mediaOntology._getRelationsByClass('media:actor'))).toEqual(correctRelations);
    });

    it("can find attributes by subject's class", function() {
       const correctAttributes = new Set(['media:name', 'media:year']);
       expect(new Set(mediaOntology._getAttributesByClass('media:musiccd'))).toEqual(correctAttributes);
    });

    it("can find class' subclasses", function() {
        const correctSubclasses = new Set(['media:book', 'media:classiccd', 'media:musiccd',
        'media:computergame', 'media:movie', 'media:mediathing']);
        expect(new Set(mediaOntology.getSubclasses('media:mediathing'))).toEqual(correctSubclasses);
    });
});

function write(textarea, text) {
    textarea.value = text;
    textarea.dispatchEvent(new Event('input'));
}

describe("Scanner", function () {
    beforeEach(function () {
        window.textarea = document.createElement('textarea');
        textarea.setAttribute('id', 'my-textarea');
        const autocomplete = new Autocomplete(textarea, ontologies);
        window.scanner = autocomplete._scanner;
    });

    it("detects categories on input", function () {
        const CATEGORY = 'media:actor';
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

    it("highlights categories which are not defined in any ontology", function () {
        document.body.appendChild(textarea);
        new Autocomplete(textarea, ontologies);
        write(textarea, '[[category:media:mediathing]] [[category:wrong]]');
        jQuery('#my-textarea').highlightWithinTextarea('update');
        const regex = /<mark>(.*)<\/mark>/;
        expect(regex.exec(jQuery('.hwt-highlights').html())[1]).toBe('wrong');
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
        Array.from(document.getElementsByClassName('textcomplete-item')).map(i => i.remove());
    });

    it("tracks categories defined in textarea", function () {
        const CATEGORY = 'media:actor';
        write(textarea, `[[category:${CATEGORY}]]`);
        expect(autocomplete._categories).toEqual([CATEGORY]);
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

    // it("allows to complete relation objects", function () { //requires Access-Control-Allow-Origin
    //     const absoluteSparqlEndpoint = '//localhost/dokuwiki/sparql';
    //     const spy = spyOnProperty(Query, 'SPARQL_ENDPOINT', 'get').and
    //         .returnValue(absoluteSparqlEndpoint);
    //     write(textarea, '[[category:media:actor]]');
    //     const completion = autocompletion(textarea.value + '[[media:playsIn::');
    //     expect(completion).toEqual(['tomb_raider']);
    // });
});

describe("Query", function() {
    beforeEach(function () {
        window.testQuery = Query.selectPages.categoryIn(['test', 'movie']);
    });

    it("constructs valid SPARQL query", function () {
        const expected = 'SELECT ?page WHERE {?page a ?cat . FILTER (?cat="test"||?cat="movie")}';
        expect(testQuery.toString()).toBe(expected);
    });

    // it("allows to execute query", function (done) { //requires Access-Control-Allow-Origin
    //     function callback(result) {
    //         const expected = new Set(['movies:last_crusade', 'movies:raiders_of_the_lost_ark',
    //         'movies:temple_of_doom', 'test2']);
    //         expect(new Set(result)).toEqual(expected);
    //         done();
    //     }
    //     const absoluteSparqlEndpoint = '//localhost/dokuwiki/sparql';
    //     const spy = spyOnProperty(Query, 'SPARQL_ENDPOINT', 'get').and
    //         .returnValue(absoluteSparqlEndpoint);
    //     testQuery.execute(callback);
    // });
});
