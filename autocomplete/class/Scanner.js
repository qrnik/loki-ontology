const EventEmitter = require('event-emitter');
require('highlight-within-textarea');

module.exports = class Scanner {
    constructor(textarea, ontologies) {
        this._categoryRegexp = Scanner._createCategoryRegexp(Scanner.symbols.ID);
        this._queryRegexp = /{{#ask:[^}]*}}/g;
        this._textarea = textarea;
        this._ontologies = ontologies;
        this.emitter = new EventEmitter();
        this._textarea.addEventListener('input', this._scan.bind(this));
        this._scan();
        jQuery('#' + this._textarea.getAttribute('id')).highlightWithinTextarea({
            highlight: this._highlight.bind(this)
        });
    }

    _scan() {
        const text = this._textarea.value;
        const textWithoutQueries = text.replace(this._queryRegexp, "");
        this.categories = this._findCategories(textWithoutQueries);
        this.emitter.emit('scan');
    }

    _findCategories(text) {
        let result = [];
        let match = this._categoryRegexp.exec(text);
        while(match) {
            result.push(match[1]);
            match = this._categoryRegexp.exec(text);
        }
        return result;
    }

    _highlight(text) {
        const categories = this._findCategories(text);
        const setDifference = jQuery(categories).not(this._ontologies.classes);
        const categoriesToHighlight = jQuery.makeArray(setDifference);
        return categoriesToHighlight.map(Scanner._createCategoryRegexp);
    }

    static _createCategoryRegexp(category) {
        return new RegExp(`\\[\\[category:(${category})]]`, 'g');
    }
};
module.exports.symbols = {
    ID : '[\\w\\-.]*|[\\w\\-.]*:[\\w\\-.]*'
};
