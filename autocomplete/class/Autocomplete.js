const Textcomplete = require('textcomplete/lib/textcomplete');
const Textarea = require('textcomplete/lib/textarea');
const Query = require('./Query.js');

module.exports = class Autocomplete {
    constructor(textarea, ontologies) {
        this._symbols = {
            ID : '[\\w\\-.]*|[\\w\\-.]*:[\\w\\-.]*'
        };
        this._editor = new Textarea.default(textarea);
        this._textcomplete = new Textcomplete.default(this._editor);
        this._ontologies = ontologies;
        this._textcomplete.register([
            this._classStrategy(),
            this._relationObjectStrategy(),
            this._propertyStrategy()
        ]);

    }

    _classStrategy() {
        return {
            id: 'class',
            match: new RegExp(`(\\[\\[category:)(${this._symbols.ID})$`),
            search: (term, callback) => callback(this._ontologies.searchClasses(term)),
            replace: clazz => `$1${clazz}]]`
        };
    }

    _propertyStrategy() {
        return {
            id: 'relation',
            match: new RegExp(`(\\[\\[)(${this._symbols.ID})$`),
            search: this._searchProperty.bind(this),
            replace: this._replaceProperty.bind(this)
        };
    }

    _searchProperty(term, callback) {
        const propertyMatches = this._ontologies.searchProperties(this._categories, term);
        const categoryMatch = ['category'].filter(c => c.startsWith(term));
        const matches = propertyMatches.concat(categoryMatch);
        callback(matches);
    }

    _replaceProperty(property) {
        if (property === 'category') {
            this._triggerAfterDelay(200);
            return '[[category:';
        } else if (this._ontologies.isRelation(property)) {
            this._triggerAfterDelay(200);
            return `[[${property}::`;
        } else { //is attribute
            return `[[${property}:=`;
        }
    }

    _relationObjectStrategy() {
        return {
            id: 'relation-object',
            match: new RegExp(`(\\[\\[)((${this._symbols.ID})::(${this._symbols.ID}))$`),
            search: this._searchObject.bind(this),
            replace: this._replaceObject.bind(this)
        };
    }

    _searchObject(compoundTerm, callback) {
        const [relationId, term] = compoundTerm.split("::");
        const objectId = this._ontologies.getRelationObject(relationId);
        const objectSubclasses = this._ontologies.getSubclasses(objectId);
        const query = Query.selectPages.categoryIn(objectSubclasses);
        this._relationId = relationId;
        query.execute(foundPages =>
            callback(foundPages.filter(p => p.startsWith(term))));
    }

    _replaceObject(objectId) {
        return `[[${this._relationId}::${objectId}]]`;
    }

    setScanner(scanner) {
        this._scanner = scanner;
        scanner.emitter.on('scan', this._updateCategories.bind(this));
        this._updateCategories();
    }

    _updateCategories() {
        this._categories = this._scanner.categories;
    }

    _triggerAfterDelay(delay) {
        //workaround - no idea how to execute it after replace
        let self = this;
        setTimeout(function () {
            self._textcomplete.trigger(self._editor.getBeforeCursor());
        }, delay);
    }
};
