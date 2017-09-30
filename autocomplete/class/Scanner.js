const EventEmitter = require('event-emitter');

module.exports = class Scanner {
    constructor(textarea) {
        this._categoryRegexp = Scanner._createCategoryRegexp(Scanner.symbols.ID);
        this._queryRegexp = /{{#ask:[^}]*}}/g;
        this.textarea = textarea;
        this.emitter = new EventEmitter();
        this.textarea.addEventListener('input', this._scan.bind(this));
        this._scan();
    }

    _scan() {
        const text = this.textarea.value;
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

    static _createCategoryRegexp(category) {
        return new RegExp(`\\[\\[category:(${category})]]`, 'g');
    }
};
module.exports.symbols = {
    ID : '[\\w\\-.]*|[\\w\\-.]*:[\\w\\-.]*'
};
