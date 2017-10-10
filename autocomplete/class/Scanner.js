const EventEmitter = require('event-emitter');
require('highlight-within-textarea');

module.exports = class Scanner {
    constructor(textarea, ontologies) {
        this._categoryRegexp = Scanner._createCategoryRegexp(Scanner.symbols.ID);
        this._relationRegexp = Scanner._createRelationRegexp(Scanner.symbols.ID);
        this._attributeRegexp = Scanner._createAttributeRegexp(Scanner.symbols.ID);
        this._queryRegexp = /{{#ask:[^}]*}}/g;
        this._textarea = textarea;
        this._ontologies = ontologies;
        this.emitter = new EventEmitter();
        this._textarea.addEventListener('input', this._scan.bind(this));
        this._hasSemanticError = false;
        this._scan();
        jQuery('#' + this._textarea.getAttribute('id')).highlightWithinTextarea({
            highlight: this._highlight.bind(this)
        });
    }

    validate() {
        return this._hasSemanticError ? confirm("Page contains semantic errors. Continue?") : true;
    }

    _scan() {
        const text = this._textarea.value;
        const textWithoutQueries = text.replace(this._queryRegexp, "");
        const categories = Scanner._findAllMatches(textWithoutQueries, this._categoryRegexp)
            .map(match => match[1]);
        const validCategories = jQuery(categories).filter(this._ontologies.classes);
        this.categories = jQuery.makeArray(validCategories);
        this.emitter.emit('scan');
    }

    static _findAllMatches(text, regex) {
        let result = [];
        let match = regex.exec(text);
        while(match) {
            result.push(match);
            match = regex.exec(text);
        }
        return result;
    }

    _highlight(text) {
        const categories = Scanner._findAllMatches(text, this._categoryRegexp)
            .map(match => match[1]);
        const relations = Scanner._findAllMatches(text, this._relationRegexp)
            .map(match => match[1]);
        const attributes = Scanner._findAllMatches(text, this._attributeRegexp)
            .map(match => match[1]);
        const categoriesToHighlight = jQuery.makeArray(jQuery(categories).not(this._ontologies.classes));
        const attributesToHighlight = attributes.filter(attr => this._isNotValidAttribute(attr));
        const relationsToHighlight = relations.filter(rel => !this._ontologies.isRelation(rel));
        const highlights = categoriesToHighlight.map(Scanner._createCategoryRegexp).concat(
            attributesToHighlight.map(Scanner._createAttributeRegexp),
            relationsToHighlight.map(Scanner._createRelationRegexp)
        );
        this._hasSemanticError = highlights.length !== 0;
        return highlights;
    }

    _isNotValidAttribute(attribute) {
        return !this._ontologies.isRelation(attribute) &&
            !(this._ontologies.searchProperties(this.categories, attribute).indexOf(attribute) !== -1);
    }

    static _createCategoryRegexp(category) {
        return new RegExp(`\\[\\[category:(${category})]]`, 'g');
    }

    static _createRelationRegexp(relation) {
        return new RegExp(`\\[\\[(${relation})::(${Scanner.symbols.ID})]]`, 'g');
    }

    static _createAttributeRegexp(attribute) {
        return new RegExp(`\\[\\[(${attribute}):=[^\\]]+]]`, 'g');
    }

};
module.exports.symbols = {
    ID : '[\\w\\-.]*|[\\w\\-.]*:[\\w\\-.]*'
};
