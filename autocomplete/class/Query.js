module.exports = class Query {
    constructor(...selection) {
        this.selection = selection.join(" ");
        this.whereClause = '';
    }

    static get symbols() {
        return {
            PAGE:              'page',
            PAGE_VAR:          '?page',
            CATEGORY_VAR:      '?cat',
            CATEGORY_RELATION: 'a',
            CONJUNCTION:       ' . '
        };
    }

    static get SPARQL_ENDPOINT() {
        return 'sparql';
    }

    static get selectPages() {
        return new Query(this.symbols.PAGE_VAR);
    }

    categoryIn(categories) {
        this.whereClause += [Query.symbols.PAGE_VAR,
            Query.symbols.CATEGORY_RELATION,
            Query.symbols.CATEGORY_VAR].join(" ");
        this.whereClause += Query.symbols.CONJUNCTION;
        this.whereClause += 'FILTER (';
        this.whereClause += categories
            .map(cat => Query.symbols.CATEGORY_VAR + `="${cat}"`)
            .join("||");
        this.whereClause += ')';
        return this;
    }

    toString() {
        return `SELECT ${this.selection} WHERE {${this.whereClause}}`;
    }

    execute(callback) {
        const params = jQuery.param({
            query: this.toString(),
            format: "json"
        });
        const uri = Query.SPARQL_ENDPOINT + '/?' + params;
        jQuery.getJSON(uri, (function () {
            return function(data) {
                Query._formatAndCall(data, callback)
            };
        })());
    }

    static _formatAndCall(data, callback) {
        const formattedResult = data.map(result => result[Query.symbols.PAGE]);
        callback(formattedResult);
    }
};
