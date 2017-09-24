module.exports = class Query {
    constructor(...selection) {
        this.selection = selection.join(" ");
        this.whereClause = '';
    }

    static get symbols() {
        return {
            PAGE: '?page',
            CATEGORY: '?cat',
            CATEGORY_RELATION: 'a',
            CONJUNCTION: ' . '
        };
    }

    static get selectPages() {
        return new Query(this.symbols.PAGE);
    }

    categoryIn(categories) {
        this.whereClause += [Query.symbols.PAGE,
            Query.symbols.CATEGORY_RELATION,
            Query.symbols.CATEGORY].join(" ");
        this.whereClause += Query.symbols.CONJUNCTION;
        this.whereClause += 'FILTER (';
        this.whereClause += categories
            .map(cat => Query.symbols.CATEGORY + `="${cat}"`)
            .join("||");
        this.whereClause += ')';
        return this;
    }

    build() {
        return `SELECT ${this.selection} WHERE {${this.whereClause}}`;
    }
};
