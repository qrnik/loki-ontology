const Textcomplete = require('textcomplete/lib/textcomplete');
const Textarea = require('textcomplete/lib/textarea');

module.exports = class Autocomplete {
    constructor(textarea, ontologies) {
        this._editor = new Textarea.default(textarea);
        this._textcomplete = new Textcomplete.default(this._editor);
        this._ontologies = ontologies;
        this._textcomplete.register([this._classStrategy(), this._propertyStrategy()]);
    }

    _classStrategy() {
        return {
            id: 'class',
            match: /(\[\[category:)([a-z0-9_\-.:]*)$/,
            search: (term, callback) => callback(this._ontologies.searchClasses(term)),
            replace: clazz => `$1${clazz}]]`
        };
    }

    _propertyStrategy() {
        return {
            id: 'relation',
            match: /(\[\[)([a-z0-9_\-.:]*)$/,
            search: this._searchProperty.bind(this),
            replace: this._replaceProperty.bind(this)
        };
    }

    _searchProperty(term, callback) {
        const relationMatches = this._ontologies.searchRelations(this._categories, term);
        const categoryMatch = ['category'].filter(c => c.startsWith(term));
        const matches = relationMatches.concat(categoryMatch);
        callback(matches);
    }

    _replaceProperty(property) {
        if (property === 'category') {
            this._triggerAfterDelay(200);
            return '[[category:';
        } else {
            return `[[${property}::`;
        }
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
