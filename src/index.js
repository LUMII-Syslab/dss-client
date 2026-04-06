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
 * @property {Array<{name: string, type?: 'in', id?: number}>} [element.pList.in]
 * @property {Array<{name: string, type?: 'out', id?: number}>} [element.pList.out]
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
 * @typedef {{name: string, type: 'in'|'out', count: number, display_name: string, local_name: string, prefix: string, ns_id: number}} DSSPropertyData
 */

/**
 * @typedef {Object} PropertyData
 * @property {string} value
 * @property {number} count
 * @property {string} display_name
 * @property {string} local_name
 * @property {string} prefix
 * @property {number} ns_id
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
    trace_log = false;

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
     * @param {DSSParams} params
     * @param {AbortSignal | null} abortSignal
     * @returns {Promise<DSSPropertyData[]>}
     */
    async getProperties(params, abortSignal = null) {
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

        const ontRequests = [];

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

        const resp = await fetch(`${this.baseUrl}/ontologies/${ontology}/getProperties`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
            signal: abortSignal,
        });
        const byte_data = await resp.text();
        const data = JSON.parse(byte_data.toString());
        if (!data.complete) {
            if (this.trace_log) {
                console.warn(`Warning: fetched properties for ontology ${ontology} not complete (limit ${limit} reached) Ignoring results.`);
            }
        }
        if (!isPropertyResponse(data)) {
            throw new Error(`Received bad response from DSS endpoint. Response: ${JSON.stringify(data)}`);
        }

        ontRequests.push(data);

        return data.data.map(
            (p) => ({ name: p.iri, type: p.mark, count: Number(p.o), display_name: p.display_name, local_name: p.local_name, prefix: p.prefix, ns_id: p.ns_id })
        );
    }

    /**
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

        const resp = await fetch(`${this.baseUrl}/ontologies/${ontology}/getClasses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
            signal: abortSignal,
        });
        const byte_data = await resp.text();

        const classes = JSON.parse(byte_data.toString());
        if (!classes.complete) {
            if (this.trace_log) {
                console.warn(`Warning: fetched classes for ontology ${ontology} not complete (limit ${limit} reached) Ignoring results.`);
            }
        }
        if (!isClassResponse(classes)) {
            throw new Error(`Received bad response from DSS endpoint. Response: ${JSON.stringify(classes)}`);
        }
        return classes.data.map(c => ({ value: c.iri, count: Number(c.cnt) }));
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
     * @returns {Promise<Array<{name: string, db_schema_name: string}>>}
     */
    async getOntologyList() {
        const endpointInfo = await this.endpointInfo;
        return endpointInfo.map(e => ({ name: e.display_name, db_schema_name: e.db_schema_name }));
    }
}

class TripletStore {

    /** @type {Array<{subject: string, predicate: string, object: string}>} */
    triplets = [];

    /**
     *  @param {string} tripletValue 
     * @returns {Promise<string[]>}
     * */
    async getIncomingProperties(tripletValue) {
        return this.triplets
            .filter(t => t.object === tripletValue)
            .map(t => t.predicate)
            .filter(v => v != "" && !v.startsWith("?"));
    }

    /**
     *  @param {string} tripletValue
     * @returns {Promise<string[]>}
     * */
    async getOutgoingProperties(tripletValue) {
        return this.triplets
            .filter(t => t.subject === tripletValue)
            .map(t => t.predicate)
            .filter(v => v != "" && !v.startsWith("?"));
    }

    /**
     * @param {string} tripletValue
     * @return {Promise<string[]>}
     * */
    async getClassesOfElement(tripletValue) {
        const valid_classifiers = new Set(["rdf:type", "a", "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]);
        return this.triplets
            .filter(t => valid_classifiers.has(t.predicate) && t.subject === tripletValue)
            .map(t => t.object)
            .filter(v => !v.startsWith("?"))
            .filter(v => v != "");
    }
}



/**
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
    for (const a_el of a) {
        const b_el = b.find(be => comparator(a_el, be));
        if (b_el) {
            a_el.count = Math.min(a_el.count, b_el.count);
            out.push(a_el);
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
    perRequestLimit = 200;

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
    async suggestIncomingProperties(tripletValue, abortSignal = null) {
        const known_value_classes = await this.tripletStore.getClassesOfElement(tripletValue);
        const known_value_incoming = await this.tripletStore.getIncomingProperties(tripletValue);
        const known_value_outgoing = await this.tripletStore.getOutgoingProperties(tripletValue);

        // strip variables from known items
        const known_classes = known_value_classes.filter(c => !c.startsWith("?"));
        const known_incoming = known_value_incoming.filter(p => !p.startsWith("?"));
        const known_outgoing = known_value_outgoing.filter(p => !p.startsWith("?"));


        const property_builder = new QueryBuilder();
        property_builder.incomingProperties = known_incoming;
        property_builder.outgoingProperties = known_outgoing;
        property_builder.usePPRels = true;
        property_builder.propertyKind = 'All';
        property_builder.limit = this.perRequestLimit;

        /**
         * @type {Array<DSSPropertyData> | null}
         */
        let valid_suggestions = null;

        for (const cls of known_classes) {
            const builder = property_builder.clone();
            builder.className = cls;
            const params = builder.buildDSSParams();
            const props = await this.dssClient.getProperties(params, abortSignal);
            if (valid_suggestions === null) {
                valid_suggestions = props;
            } else {
                valid_suggestions = intersectSuggestions(valid_suggestions, props, (a, b) => a.name === b.name && a.type === b.type);
            }
        }

        if (known_classes.length === 0) {
            const params = property_builder.buildDSSParams();
            const props = await this.dssClient.getProperties(params, abortSignal);
            valid_suggestions = props;
        }

        if (valid_suggestions === null) {
            valid_suggestions = [];
        }

        const incoming_properties = [...(new Array(...valid_suggestions))]
            .filter(p => p.type === "in")
            .map(p => ({ value: p.name, count: p.count, display_name: p.display_name, local_name: p.local_name, prefix: p.prefix, ns_id: p.ns_id }));

        return incoming_properties;
    }

    /**
     * 
     * @param {string} tripletValue 
     * @param {AbortSignal | null} abortSignal
     * @return {Promise<PropertyData[]>}
     */
    async suggestOutgoingProperties(tripletValue, abortSignal = null) {
        const known_value_classes = await this.tripletStore.getClassesOfElement(tripletValue);
        const known_value_incoming = await this.tripletStore.getIncomingProperties(tripletValue);
        const known_value_outgoing = await this.tripletStore.getOutgoingProperties(tripletValue);

        // strip variables from known items
        const known_classes = known_value_classes.filter(c => !c.startsWith("?"));
        const known_incoming = known_value_incoming.filter(p => !p.startsWith("?"));
        const known_outgoing = known_value_outgoing.filter(p => !p.startsWith("?"));

        const property_builder = new QueryBuilder();
        property_builder.incomingProperties = known_incoming;
        property_builder.outgoingProperties = known_outgoing;
        property_builder.usePPRels = true;
        property_builder.propertyKind = 'All';
        property_builder.limit = this.perRequestLimit;

        /**
         * @type {Array<DSSPropertyData> | null}
         */
        let valid_suggestions = null;

        for (const cls of known_classes) {
            const builder = property_builder.clone();
            builder.className = cls;
            builder.usePPRels = true;
            const params = builder.buildDSSParams();
            const props = await this.dssClient.getProperties(params, abortSignal);
            if (valid_suggestions === null) {
                valid_suggestions = props;
            } else {
                valid_suggestions = intersectSuggestions(valid_suggestions, props, (a, b) => a.name === b.name && a.type === b.type);
            }
        }

        if (known_classes.length === 0) {
            const params = property_builder.buildDSSParams();
            const props = await this.dssClient.getProperties(params, abortSignal);
            valid_suggestions = props;
        }

        if (valid_suggestions === null) {
            valid_suggestions = [];
        }

        const outgoing_properties = [...valid_suggestions].filter(p => p.type === "out").map(p => ({ value: p.name, count: p.count, display_name: p.display_name, local_name: p.local_name, prefix: p.prefix, ns_id: p.ns_id }));

        return outgoing_properties;
    }

    /**
     * 
     * @param {string} tripletValue 
     * @param {AbortSignal | null} abortSignal
     * @returns {Promise<ClassData[]>}
     */
    async suggestClasses(tripletValue, abortSignal = null) {
        const known_value_classes = await this.tripletStore.getClassesOfElement(tripletValue);
        const known_value_incoming = await this.tripletStore.getIncomingProperties(tripletValue);
        const known_value_outgoing = await this.tripletStore.getOutgoingProperties(tripletValue);

        const known_classes = known_value_classes.filter(c => !c.startsWith("?"));
        const known_incoming = known_value_incoming.filter(p => !p.startsWith("?"));
        const known_outgoing = known_value_outgoing.filter(p => !p.startsWith("?"));

        const property_builder = new QueryBuilder();
        property_builder.incomingProperties = known_incoming;
        property_builder.outgoingProperties = known_outgoing;
        property_builder.propertyKind = 'All';
        property_builder.limit = this.perRequestLimit;

        /**
         * @type {Array<ClassData> | null}
         */
        let valid_suggestions = null;

        for (const cls of known_classes) {
            const builder = property_builder.clone();
            builder.className = cls;
            const params = builder.buildDSSParams();
            const classes = await this.dssClient.getClasses(params, abortSignal);
            if (valid_suggestions === null) {
                valid_suggestions = classes;
            } else {
                valid_suggestions = intersectSuggestions(valid_suggestions, classes);
            }
        }

        if (known_classes.length === 0) {
            const params = property_builder.buildDSSParams();
            const classes = await this.dssClient.getClasses(params, abortSignal);
            valid_suggestions = classes;
        }

        return [...(valid_suggestions ?? [])];

    }
}

class QueryBuilder {

    /** @type {string[] | null} */
    incomingProperties = null;
    /** @type {string[] | null} */
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
            params.element.pList.in = this.incomingProperties.map(v => ({ name: v, type: 'in' }));
        }
        if (this.outgoingProperties !== null) {
            params.element.pList = params.element.pList ?? {};
            params.element.pList.out = this.outgoingProperties.map(v => ({ name: v, type: 'out' }));
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
    const byte_data = await resp.text();
    const data = JSON.parse(byte_data.toString());
    return data;
}

module.exports = {
    DSSClient,
    QueryBuilder,
    TripletStore,
    DSSAutocompletionClient,
    getEndpoints,
    intersectSuggestions
};
