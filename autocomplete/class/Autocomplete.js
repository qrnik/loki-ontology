const Textcomplete = require('textcomplete/lib/textcomplete');
const Textarea = require('textcomplete/lib/textarea');

module.exports = class Autocomplete {
    constructor(textarea, ontologies) {
        this._editor = new Textarea.default(textarea);
        this._textcomplete = new Textcomplete.default(this._editor);
        this._ontologies = ontologies;
        this.strategy = {
            CLASS: this._classStrategy(),
            CATEGORY: this._categoryStrategy()
        };
    }

    register(...strategies) {
        this._textcomplete.register(strategies);
    }

    setScanner(scanner) {
        this._scanner = scanner;
        scanner.emitter.on('scan', this._updateCategories.bind(this));
        this._updateCategories();
    }

    _updateCategories() {
        this._categories = this._scanner.categories;
    }

    _classStrategy() {
        return {
            id: 'class',
            match: /(\[\[category:)([a-z0-9_\-.:]*)$/,
            search: (term, callback) =>
                        callback(this._ontologies.searchClasses(term)),
            replace: clazz => `$1${clazz}]]`
        };
    }

    _categoryStrategy() {
        return {
            id: 'category',
            match: /(\[\[)([a-z0-9_\-.:]*)$/,
            search: (term, callback) =>
                        callback(['category'].filter(w => w.startsWith(term))),
            replace: name => {
                this._triggerAfterDelay(200);
                return `$1${name}:`;
            }
        };
    }

    _triggerAfterDelay(delay) {
        //workaround - no idea how to execute it after replace
        let self = this;
        setTimeout(function () {
            self._textcomplete.trigger(self._editor.getBeforeCursor());
        }, delay);
    }
};
