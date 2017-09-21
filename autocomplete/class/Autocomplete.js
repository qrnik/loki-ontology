const Textcomplete = require('textcomplete/lib/textcomplete');
const Textarea = require('textcomplete/lib/textarea');

module.exports = class Autocomplete {
    constructor(textarea, ontologies) {
        this.editor = new Textarea.default(textarea);
        this.textcomplete = new Textcomplete.default(this.editor);
        this.ontologies = ontologies;
        this.strategy = {
            CLASS: this._classStrategy(),
            CATEGORY: this._categoryStrategy()
        };
    }

    register(...strategies) {
        this.textcomplete.register(strategies);
    }

    _classStrategy() {
        return {
            id: 'class',
            match: /(\[\[category:)([a-z0-9_\-.:]*)$/,
            search: (term, callback) =>
                        callback(this.ontologies.searchClasses(term)),
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
            self.textcomplete.trigger(self.editor.getBeforeCursor());
        }, delay);
    }
};