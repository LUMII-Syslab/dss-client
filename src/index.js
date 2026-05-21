//@ts-check

/**
 * @typedef {Object} DSSParams
 * @property {Object} main
 * @property {'All'|'ObjectExt' | 'Data'} [main.propertyKind]
 * @property {number} [main.limit]
 * @property {boolean} [main.use_pp_rels]
 * @property {string} [main.direct_class_role]
 * @property {string} [main.indirect_class_role]
 * @property {boolean} [main.has_classification_property]
 * @property {boolean} [main.has_classification_adornment]
 * @property {boolean} [main.show_prefixes]
 * @property {string} [main.endpointUrl]
 * @property {string} [main.schemaName]
 * @property {string} [main.schemaType]
 * @property {boolean} [main.linksWithTargets]
 * @property {boolean} [main.has_followers_ok]
 * @property {boolean} [main.has_outgoing_props_ok]
 * @property {boolean} [main.has_incoming_props_ok]
 * @property {boolean} [main.simple_prompt]
 * @property {number} [main.c_1_id]
 * @property {number} [main.c_2_id]
 * @property {Object} element
 * @property {string} [element.className]
 * @property {Object} [element.pList]
 * @property {Array<{name: string, type?: 'in', id?: number }>} [element.pList.in]
 * @property {Array<{name: string, type?: 'out', id?: number, className?: string}>} [element.pList.out]
 * @property {string} [element.uriIndividual]
 */


// @ts-check

/**
 * @typedef {Object} NamespaceData
 * @property {number} id
 * @property {string} name
 * @property {string} value
 * @property {number} priority
 * @property {boolean} is_local
 * @property {number} basic_order_level
 * @property {string | number} cl_count
 * @property {string | number} prop_count
 */

/**
 * @param {unknown} data
 * @return {data is NamespaceData}
 */
function isNamespaceData(data) {
    if (typeof data !== 'object' || data === null) {
        return false;
    }
    if (
        !("id" in data) || !("name" in data) ||
        !("value" in data) || !("priority" in data) ||
        !("is_local" in data) || !("basic_order_level" in data) ||
        !("cl_count" in data) || !("prop_count" in data)) {
        return false;
    }
    if (typeof data.id !== 'number') {
        return false;
    }
    if (typeof data.name !== 'string') {
        return false;
    }
    if (typeof data.value !== 'string') {
        return false;
    }
    if (typeof data.priority !== 'number') {
        return false;
    }
    if (typeof data.is_local !== 'boolean') {
        return false;
    }
    if (typeof data.basic_order_level !== 'number') {
        return false;
    }
    if (typeof data.cl_count !== 'string' && typeof data.cl_count !== 'number') {
        return false;
    }
    if (typeof data.prop_count !== 'string' && typeof data.prop_count !== 'number') {
        return false;
    }
    return true;
}

/**
 * @param {unknown} response
 * @returns {response is NamespaceData[]}
 */
function isNamespaceDataArray(response) {
    if (!Array.isArray(response)) {
        return false;
    }
    for (const item of response) {
        if (!isNamespaceData(item)) {
            return false;
        }
    }
    return true;
}


/**
 * @typedef {Object} PropertyResponse
 * @property {Object[]} data
 * @property {string} data[].iri
 * @property {'in'|'out'} data[].mark
 * @property {string | number} data[].cnt
 * @property {string | number} data[].o
 * @property {string} data[].display_name
 * @property {string} data[].local_name
 * @property {string} data[].prefix
 * @property {number} data[].ns_id
 * @property {boolean} complete
 */

/**
 * @typedef {Object} DSSPropertyData
 * @property {string} name
 * @property {'in'|'out'} type
 * @property {number} count
 * @property {string} displayName
 * @property {string} localName
 * @property {string} prefix
 * @property {number} nsId
 */

/**
 * @typedef {Object} PropertyData
 * @property {string} value
 * @property {number} count
 * @property {string} displayName
 * @property {string} localName
 * @property {string} prefix
 * @property {number} nsId
 * 
 */

/**
 * @typedef {Object} ClassData
 * @property {string} value
 * @property {number} count
 */


/**
 * @param {unknown} response 
 * @returns {response is PropertyResponse}
 */
function isPropertyResponse(response) {
    if (typeof response !== 'object' || response === null) {
        return false;
    }

    if (!("data" in response) || !("complete" in response)) {
        return false;
    }
    if (!Array.isArray(response["data"])) {
        return false;
    }
    for (const data of response["data"]) {
        if (typeof data !== 'object' || data === null) {
            return false;
        }
        if (typeof data.iri !== 'string') {
            return false;
        }
        if (data.mark !== 'in' && data.mark !== 'out') {
            return false;
        }
        if (typeof data.cnt !== 'string' && typeof data.cnt !== 'number') {
            return false;
        }
        if (typeof data.o !== 'string' && typeof data.o !== 'number') {
            return false;
        }
        if (typeof data.display_name !== 'string') {
            return false;
        }
        if (typeof data.prefix !== 'string') {
            return false;
        }
        if (typeof data.ns_id !== 'number') {
            return false;
        }
        if (typeof data.local_name !== 'string') {
            return false;
        }
    }
    if (typeof response["complete"] !== 'boolean') {
        return false;
    }
    return true;
}

/**
 * @typedef {Object} ClassResponse
 * @property {Object[]} data
 * @property {string} data[].iri
 * @property {string | number} data[].cnt
 * @property {boolean} complete
 */

/**
 * @param {unknown} response
 * @return {response is ClassResponse}
 */
function isClassResponse(response) {
    if (typeof response !== 'object' || response === null) {
        return false;
    }
    if (!("data" in response) || !("complete" in response)) {
        return false;
    }
    if (!Array.isArray(response.data)) {
        return false;
    }
    for (const data of response.data) {
        if (typeof data !== 'object' || data === null) {
            return false;
        }
        if (typeof data.iri !== 'string') {
            return false;
        }
        if (typeof data.cnt !== 'string' && typeof data.cnt !== 'number') {
            return false;
        }
    }
    if (typeof response.complete !== 'boolean') {
        return false;
    }
    return true;
}

/**
 * An opinionated client for fetching properties and classes
 * from a DSS endpoint.
 */
class DSSClient {

    /**
     * @type {Promise<string | null>}
     */
    #ontology = Promise.resolve(null);

    /** @returns {Promise<string | null>} */
    get ontology() {
        return this.endpointInfo.then(async endpoints => {
            const ont = await this.#ontology;
            if (ont === null) {
                return null;
            }
            const endpoint = endpoints.find(e => e.db_schema_name === ont);
            if (!endpoint) {
                throw new Error(`Endpoint not found for ontology ${ont}`);
            }
            return endpoint.db_schema_name;
        });
    }

    /**
     * @param {string | null | Promise<string | null>} value
     */
    set ontology(value) {
        if (value instanceof Promise) {
            this.#ontology = value;
        } else {
            this.#ontology = Promise.resolve(value);
        }
    }

    /**@type {string} */
    baseUrl;

    /**@type {boolean} */
    traceLog = false;

    /** 
     * @type {Promise<{id: number, display_name: string, db_schema_name: string, schema_name: string, sparql_url: string}[]>}
     * */
    endpointInfo;

    /**
     * 
     * @param {string} baseUrl 
     */
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.endpointInfo = getEndpoints(baseUrl);
    }

    /**
     * Fetches properties from DSS using provided parameters
     * @param {DSSParams} params
     * @param {AbortSignal | null} abortSignal
     * @param {boolean} uncompressed When true, splits provided parameters 
     * into multiple requests
     * that will provide more accurate results, while usually taking longer.
     * @returns {Promise<DSSPropertyData[]>}
     */
    async getProperties(params, abortSignal = null, uncompressed = true) {
        const endpointInfo = await this.endpointInfo;
        if (params.main === undefined) {
            params.main = {};
        }
        if (!(params.main?.limit)) {
            params.main.limit = 500;
        }
        if (!(params.main?.propertyKind)) {
            params.main.propertyKind = 'All';
        }
        const limit = params.main.limit;

        const ontology = await this.ontology;
        if (ontology === null) {
            throw new Error("No ontology specified for DSSClient");
        }

        const endpoint = endpointInfo.find(e => e.db_schema_name === ontology);
        if (!endpoint) {
            throw new Error(`Endpoint not found for ontology ${ontology}`);
        }
        params.main.schemaName = endpoint.display_name;
        params.main.endpointUrl = endpoint.sparql_url;

        if (!uncompressed) {

            const resp = await fetch(`${this.baseUrl}/ontologies/${ontology}/getProperties`, {
                method: 'POST',
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
                signal: abortSignal,
            });
            const byteData = await resp.text();
            const data = JSON.parse(byteData.toString());
            if (!data.complete) {
                if (this.traceLog) {
                    console.warn(`Warning: fetched properties for ontology ${ontology} not complete (limit ${limit} reached) Ignoring results.`);
                }
            }
            if (!isPropertyResponse(data)) {
                throw new Error(`Received bad response from DSS endpoint. Response: ${JSON.stringify(data)}`);
            }

            return data.data.map(
                (p) => ({
                    name: p.iri,
                    type: p.mark,
                    count: Number(p.o),
                    displayName: p.display_name,
                    localName: p.local_name,
                    prefix: p.prefix,
                    nsId: p.ns_id
                })
            );
        } else {
            const builder = QueryBuilder.prototype.fromDssParams(params);
            const decompressed = builder.decompressParams();
            const allQueries = [...decompressed.classQueriesForPropertyRequests, ...decompressed.incomingPropertyQueries, ...decompressed.outgoingPropertyQueries];
            /** @type {DSSPropertyData[] | null} */
            let results = null;
            for (const query of allQueries) {
                const queryParams = query.buildDSSParams();
                const queryResult = await this.getProperties(queryParams, abortSignal, false);
                if (results === null) {
                    results = queryResult;
                } else {
                    results = intersectSuggestions(results, queryResult, (a, b) => a.name === b.name && a.type === b.type);
                }
            }

            return results ?? [];
        }




    }

    /**
     * Fetches classes from DSS, decompressing the parameters into multiple requests
     * if necessary to get more accurate results.
     * For example, multiple property constraints will be split
     * into one request per property and intersected.
     * @param {DSSParams} params 
     * @param {AbortSignal | null} abortSignal
     * @returns {Promise<ClassData[]>}
     */
    async getClasses(params, abortSignal = null) {
        const endpointInfo = await this.endpointInfo;

        if (!(params.main?.limit)) {
            if (params.main === undefined) {
                params.main = {};
            }
            params.main.limit = 500;
        }
        const limit = params.main.limit;

        const ontology = await this.ontology;
        const endpoint = endpointInfo.find(e => e.db_schema_name === ontology);
        if (!endpoint) {
            throw new Error(`Endpoint not found for ontology ${ontology}`);
        }
        params.main.schemaName = endpoint.display_name;
        params.main.endpointUrl = endpoint.sparql_url;

        const builder = QueryBuilder.prototype.fromDssParams(params);
        const decompressed = builder.decompressParams();
        const queries = [...decompressed.classQueriesForClassRequests, ...decompressed.incomingPropertyQueries, ...decompressed.outgoingPropertyQueries];
        /** @type {ClassData[] | null} */
        let allResults = null;
        for (const query of queries) {
            const queryParams = query.buildDSSParams();
            const resp = await fetch(`${this.baseUrl}/ontologies/${ontology}/getClasses`, {
                method: 'POST',
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(queryParams),
                signal: abortSignal,
            });
            const byteData = await resp.text();

            const classes = JSON.parse(byteData.toString());
            if (!classes.complete) {
                if (this.traceLog) {
                    console.warn(`Warning: fetched classes for ontology ${ontology} not complete (limit ${limit} reached) Ignoring results.`);
                }
            }
            if (!isClassResponse(classes)) {
                throw new Error(`Received bad response from DSS endpoint. Response: ${JSON.stringify(classes)}`);
            }
            const classData = classes.data.map(c => ({ value: c.iri, count: Number(c.cnt) }));
            if (allResults === null) {
                allResults = classData;
            } else {
                allResults = intersectSuggestions(allResults, classData, (a, b) => a.value === b.value);
            }
        }

        return allResults ?? [];
    }

    /**
     * Fetches a list of namespaces for the current ontology.
     * @returns {Promise<NamespaceData[]>}
     */
    async getNamespaces() {
        const ontology = await this.ontology;
        const response = await fetch(`${this.baseUrl}/ontologies/${ontology}/ns`, {
        });
        const data = await response.json();
        if (!isNamespaceDataArray(data)) {
            throw new Error(`Received bad response from DSS endpoint for namespaces. Response: ${JSON.stringify(data)}`);
        }
        return data;
    }

    /**
     * Fetches a list of available ontologies.
     * @returns {Promise<Array<{name: string, dbSchemaName: string}>>}
     */
    async getOntologyList() {
        const endpointInfo = await this.endpointInfo;
        return endpointInfo.map(e => ({ name: e.display_name, dbSchemaName: e.db_schema_name }));
    }
}

/**
 * A primitive in-memory store of triplets,
 * primarily used to provide query context for the autocompletion client.
 * Contains methods to fetch incoming, outgoing properties and classes of a given triplet value.
 * Said value can be resource, literal or variable.
 * The returned values are obtained with no additional context or recursive reasoning.
 * Mostly useable as a thin wrapper around an array of triplets.
 */
class TripletStore {

    /** @type {Array<{subject: string, predicate: string, object: string}>} */
    triplets = [];

    /**
     *  @param {string} tripletValue 
     * @returns {string[]}
     * */
    getIncomingProperties(tripletValue) {
        return this.triplets
            .filter(t => t.object === tripletValue)
            .map(t => t.predicate)
            .filter(v => v != "" && !v.startsWith("?"));
    }

    /**
     *  @param {string} tripletValue
     * @returns {string[]}
     * */
    getOutgoingProperties(tripletValue) {
        return this.triplets
            .filter(t => t.subject === tripletValue)
            .map(t => t.predicate)
            .filter(v => v != "" && !v.startsWith("?"));
    }

    /**
     * @param {string} tripletValue
     * @return {string[]}
     * */
    getClassesOfElement(tripletValue) {
        const validClassifiers = new Set(["rdf:type", "a", "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]);
        return this.triplets
            .filter(t => validClassifiers.has(t.predicate) && t.subject === tripletValue)
            .map(t => t.object)
            .filter(v => !v.startsWith("?"))
            .filter(v => v != "");
    }
}



/**
 * Intersects two sets of suggestions, returning only those that are present in both sets.
 * Suggestions must have a count property, which will be set to the minimum of the counts in both sets.
 * While not strictly correct, a minimum function is a reasonable heuristic
 * for reasoning about item counts without performing expensive validation.
 * @template T
 * @param {Set<T & {count: number}> | (T & {count: number})[]} setA 
 * @param {Set<T & {count: number}> | (T & {count: number})[]} setB
 * @param {(a: T, b: T) => boolean} [comparator]
 * @returns {Array<T & {count: number}>}
 */
function intersectSuggestions(setA, setB, comparator = (a, b) => a === b) {
    const a = new Array(...setA.values());
    const b = new Array(...setB.values());
    const out = [];
    for (const aElement of a) {
        const bElement = b.find(be => comparator(aElement, be));
        if (bElement) {
            aElement.count = Math.min(aElement.count, bElement.count);
            out.push(aElement);
        }
    }
    return [...out];
}

class DSSAutocompletionClient {

    /** @type {TripletStore} */
    tripletStore;

    /** @type {DSSClient} */
    dssClient;

    /** @type {number} */
    perRequestLimit = 2000;

    /**
     * 
     * @param {TripletStore} tripletStore 
     * @param {DSSClient} dssClient 
     */
    constructor(tripletStore, dssClient) {
        this.tripletStore = tripletStore;
        this.dssClient = dssClient;
    }

    /**
     * Fetches suggestions for incoming properties.
     * @param {string} tripletValue
     * @param {AbortSignal | null} abortSignal
     * @return {Promise<PropertyData[]>}
     */
    async suggestIncomingProperties(tripletValue, abortSignal = null, queryBuilder = new QueryBuilder(), uncompressed = false) {
        const knownValueClasses = await this.tripletStore.getClassesOfElement(tripletValue);
        const knownValueIncoming = await this.tripletStore.getIncomingProperties(tripletValue);
        const knownValueOutgoing = await this.tripletStore.getOutgoingProperties(tripletValue);

        // strip variables from known items
        const knownClasses = knownValueClasses.filter(c => !c.startsWith("?"));
        const knownIncoming = knownValueIncoming.filter(p => !p.startsWith("?"));
        const knownOutgoing = knownValueOutgoing.filter(p => !p.startsWith("?"));


        queryBuilder.incomingProperties = knownIncoming;
        queryBuilder.outgoingProperties = knownOutgoing;
        if (queryBuilder.usePPRels == null) {
            queryBuilder.usePPRels = false;
        }
        if (queryBuilder.propertyKind == null) {
            queryBuilder.propertyKind = 'ObjectExt';
        }
        queryBuilder.limit = this.perRequestLimit;

        /**
         * @type {Array<DSSPropertyData> | null}
         */
        let validSuggestions = null;

        for (const cls of knownClasses) {
            const builder = queryBuilder.clone();
            builder.className = cls;
            const params = builder.buildDSSParams();
            const props = await this.dssClient.getProperties(params, abortSignal, uncompressed);
            if (validSuggestions === null) {
                validSuggestions = props;
            } else {
                validSuggestions = intersectSuggestions(validSuggestions, props, (a, b) => a.name === b.name && a.type === b.type);
            }
        }

        if (knownClasses.length === 0) {
            const params = queryBuilder.buildDSSParams();
            const props = await this.dssClient.getProperties(params, abortSignal, uncompressed);
            validSuggestions = props;
        }

        if (validSuggestions === null) {
            validSuggestions = [];
        }

        const incomingProperties = [...(new Array(...validSuggestions))]
            .filter(p => p.type === "in")
            .map(p => ({ value: p.name, count: p.count, displayName: p.displayName, localName: p.localName, prefix: p.prefix, nsId: p.nsId }));

        return incomingProperties;
    }

    /**
     * 
     * @param {string} tripletValue 
     * @param {AbortSignal | null} abortSignal
     * @return {Promise<PropertyData[]>}
     */
    async suggestOutgoingProperties(tripletValue, abortSignal = null, uncompressed = false) {
        const knownValueClasses = await this.tripletStore.getClassesOfElement(tripletValue);
        const knownValueIncoming = await this.tripletStore.getIncomingProperties(tripletValue);
        const knownValueOutgoing = await this.tripletStore.getOutgoingProperties(tripletValue);

        // strip variables from known items
        const knownClasses = knownValueClasses.filter(c => !c.startsWith("?"));
        const knownIncoming = knownValueIncoming.filter(p => !p.startsWith("?"));
        const knownOutgoing = knownValueOutgoing.filter(p => !p.startsWith("?"));

        const propertyBuilder = new QueryBuilder();
        propertyBuilder.incomingProperties = knownIncoming;
        propertyBuilder.outgoingProperties = knownOutgoing;
        propertyBuilder.usePPRels = true;
        propertyBuilder.propertyKind = 'All';
        propertyBuilder.limit = this.perRequestLimit;

        /**
         * @type {Array<DSSPropertyData> | null}
         */
        let validSuggestions = null;

        for (const cls of knownClasses) {
            const builder = propertyBuilder.clone();
            builder.className = cls;
            builder.usePPRels = true;
            const params = builder.buildDSSParams();
            const props = await this.dssClient.getProperties(params, abortSignal, uncompressed);
            if (validSuggestions === null) {
                validSuggestions = props;
            } else {
                validSuggestions = intersectSuggestions(validSuggestions, props, (a, b) => a.name === b.name && a.type === b.type);
            }
        }

        if (knownClasses.length === 0) {
            const params = propertyBuilder.buildDSSParams();
            const props = await this.dssClient.getProperties(params, abortSignal, uncompressed);
            validSuggestions = props;
        }

        if (validSuggestions === null) {
            validSuggestions = [];
        }

        const outgoingProperties = [...validSuggestions].filter(p => p.type === "out").map(p => ({ value: p.name, count: p.count, displayName: p.displayName, localName: p.localName, prefix: p.prefix, nsId: p.nsId }));

        return outgoingProperties;
    }

    /**
     * 
     * @param {string} tripletValue 
     * @param {AbortSignal | null} abortSignal
     * @returns {Promise<ClassData[]>}
     */
    async suggestClasses(tripletValue, abortSignal = null) {
        const knownValueClasses = await this.tripletStore.getClassesOfElement(tripletValue);
        const knownValueIncoming = await this.tripletStore.getIncomingProperties(tripletValue);
        const knownValueOutgoing = await this.tripletStore.getOutgoingProperties(tripletValue);

        const knownClasses = knownValueClasses.filter(c => !c.startsWith("?"));
        const knownIncoming = knownValueIncoming.filter(p => !p.startsWith("?"));
        /**@type (string | {name: string, className: string})[] */
        const knownOutgoing = knownValueOutgoing.filter(
            p => !p.startsWith("?"));
        for (const cls of knownClasses) {
            knownOutgoing.unshift({
                name: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                className: cls
            });
        }
        const propertyBuilder = new QueryBuilder();
        propertyBuilder.incomingProperties = knownIncoming;
        propertyBuilder.outgoingProperties = knownOutgoing;
        propertyBuilder.propertyKind = 'All';
        propertyBuilder.limit = this.perRequestLimit;
        propertyBuilder.className = knownClasses.length > 0 ? knownClasses[0] : null;

        /**
         * @type {Array<ClassData>}
         */
        let validSuggestions;

        {
            const params = propertyBuilder.buildDSSParams();
            validSuggestions = await this.dssClient.getClasses(params, abortSignal);
        }
        return [...(validSuggestions ?? [])];

    }
}

class QueryBuilder {

    /** @type {({ name: string, className: string } | string)[] | null} */
    incomingProperties = null;
    /** @type {({ name: string, className: string } | string)[] | null} */
    outgoingProperties = null;
    /** @type {string | null} */
    className = null;
    /** @type {string | null} */
    instanceIRI = null;
    /** @type {string | null} */
    ontology = null;
    /** @type {number} */
    limit = 200;
    /** @type {boolean | null} */
    usePPRels = null;
    /** @type {'All' | 'ObjectExt' | "Data" | null} */
    propertyKind = null;
    /** @type {boolean | null} */
    linksWithTargets = null;
    /** @type {boolean | null} */
    showPrefixes = null;

    /** @method
     * @returns {DSSParams}
     */
    buildDSSParams() {
        /** @type {DSSParams} */
        let params = {
            main: {},
            element: {}
        };
        if (this.instanceIRI !== null) {
            params.element.uriIndividual = this.instanceIRI;
        }
        if (this.incomingProperties !== null) {
            params.element.pList = params.element.pList ?? {};
            params.element.pList.in = this.incomingProperties.map((v) => {
                if (typeof v == "string") {
                    return { name: v, type: 'in' };
                } else {
                    return {
                        name: v.name,
                        type: 'in',
                        className: v.className
                    };
                }
            });
        }
        if (this.outgoingProperties !== null) {
            params.element.pList = params.element.pList ?? {};
            params.element.pList.out = this.outgoingProperties.map((v) => {
                if (typeof v == "string") {
                    return { name: v, type: 'out' };
                } else {
                    return {
                        name: v.name,
                        type: 'out',
                        className: v.className
                    };
                }
            });
        }
        if (this.className !== null) {
            params.element.className = this.className;
        }
        params.main.limit = this.limit;
        if (this.ontology !== null) {
            params.main.schemaName = this.ontology;
        }
        if (this.usePPRels !== null) {
            params.main.use_pp_rels = this.usePPRels;
        }
        if (this.propertyKind !== null) {
            params.main.propertyKind = this.propertyKind;
        }
        if (this.linksWithTargets !== null) {
            params.main.linksWithTargets = this.linksWithTargets;
        }
        if (this.showPrefixes !== null) {
            params.main.show_prefixes = this.showPrefixes;
        }
        return params;
    }

    clone() {
        const clone = new QueryBuilder();
        clone.incomingProperties = this.incomingProperties ? [...this.incomingProperties] : null;
        clone.outgoingProperties = this.outgoingProperties ? [...this.outgoingProperties] : null;
        clone.className = this.className;
        clone.instanceIRI = this.instanceIRI;
        clone.ontology = this.ontology;
        clone.limit = this.limit;
        clone.usePPRels = this.usePPRels;
        clone.propertyKind = this.propertyKind;
        clone.linksWithTargets = this.linksWithTargets;
        return clone;
    }

    /**
     * Constructs a Query builder from DSSParams.
     * @param {DSSParams} params 
     */
    fromDssParams(params) {
        const builder = new QueryBuilder();
        builder.className = params.element.className ?? null;
        builder.instanceIRI = params.element.uriIndividual ?? null;
        if (params.element.pList) {
            if (params.element.pList.in) {
                builder.incomingProperties = params.element.pList.in.map(p =>
                    p.name
                );
            }
            if (params.element.pList.out) {
                builder.outgoingProperties = params.element.pList.out.map(p =>
                    typeof p === "string" ? p : p.name
                );
            }
        }
        builder.limit = params.main.limit ?? 200;
        builder.ontology = params.main.schemaName ?? null;
        builder.usePPRels = params.main.use_pp_rels ?? null;
        builder.propertyKind = params.main.propertyKind ?? null;
        builder.linksWithTargets = params.main.linksWithTargets ?? null;
        builder.showPrefixes = params.main.show_prefixes ?? null;
        return builder;

    }


    /**
     * Splits the provided parameters into multiple QueryBuilders
     * to fetch more accurate results from DSS.
     * For example, if multiple classes are provided, 
     * it will create multiple QueryBuilders with one class each
     * Same for properties.
     * @returns {{classQueriesForPropertyRequests: QueryBuilder[], classQueriesForClassRequests: QueryBuilder[], incomingPropertyQueries: QueryBuilder[], outgoingPropertyQueries: QueryBuilder[]}}
     */
    decompressParams() {
        const classBuilders = [];
        const incomingPropertyBuilders = [];
        const outgoingPropertyBuilders = [];
        const classForClassBuilders = [];
        const classes = this.className !== null ? [this.className] : [];
        for (const property of this.incomingProperties ?? []) {
            if (typeof property === "object") {
                classes.push(property.className);
            }
        }
        for (const property of this.outgoingProperties ?? []) {
            if (typeof property === "object") {
                classes.push(property.className);
            }
        }
        for (const cls of classes) {
            const builder = this.clone();
            builder.incomingProperties = [];
            builder.outgoingProperties = [];
            builder.className = cls;
            classBuilders.push(builder);
            const classViaPropertyBuilder = this.clone();
            classViaPropertyBuilder.className = null;
            classViaPropertyBuilder.incomingProperties = [];
            classViaPropertyBuilder.outgoingProperties = [
                {
                    className: cls,
                    name: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                }
            ];
            classForClassBuilders.push(classViaPropertyBuilder);
        }

        for (const property of this.incomingProperties ?? []) {
            const builder = this.clone();
            builder.incomingProperties = [property];
            builder.outgoingProperties = [];
            builder.className = null;
            incomingPropertyBuilders.push(builder);
        }

        for (const property of this.outgoingProperties ?? []) {
            const builder = this.clone();
            builder.incomingProperties = [];
            builder.outgoingProperties = [property];
            builder.className = null;
            outgoingPropertyBuilders.push(builder);
        }
        return {
            classQueriesForPropertyRequests: classBuilders,
            incomingPropertyQueries: incomingPropertyBuilders,
            outgoingPropertyQueries: outgoingPropertyBuilders,
            classQueriesForClassRequests: classForClassBuilders
        };

    }
}

/**
 * 
 * @param {string} baseUrl 
 * @param {AbortSignal | null} abortSignal 
 * @returns {Promise<{id: number, display_name: string, db_schema_name: string, schema_name: string, sparql_url: string}[]>}
 */
async function getEndpoints(baseUrl, abortSignal = null) {
    const resp = await fetch(`${baseUrl}/info`, {
        signal: abortSignal
    });
    const byteData = await resp.text();
    const data = JSON.parse(byteData.toString());
    return data;
}

/* eslint-disable @typescript-eslint/naming-convention */
module.exports = {
    DSSClient,
    QueryBuilder,
    TripletStore,
    DSSAutocompletionClient,
    getEndpoints,
    intersectSuggestions
};
/* eslint-enable @typescript-eslint/naming-convention */
