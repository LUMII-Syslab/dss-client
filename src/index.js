//@ts-check

/**
 * @typedef {Object} DSSParams
 * @property {Object} main
 * @property {'All'|'ObjectExt' | 'Data'} [main.propertyKind]
 * @property {number} [main.limit]
 * @property {Object} [main.pList]
 * @property {Array<{name: string, type: 'in'}>} [main.pList.in]
 * @property {Array<{name: string, type: 'out'}>} [main.pList.out]
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
 * @typedef {Object} PropertyResponse
 * @property {Object[]} data
 * @property {string} data[].iri
 * @property {'in'|'out'} data[].mark
 * @property {number} data[].cnt
 * @property {boolean} complete
 */

/**
 * @typedef {Object} DSSClient
 * @property {(params: DSSParams) => Promise<{name: string, type: 'in'|'out', count: number}[]>} getProperties
 * @property {(params: DSSParams) => Promise<{value: string, count: number}[]>} getClasses
 */

/**
 * 
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
    }
    if (typeof response["complete"] !== 'boolean') {
        return false;
    }
    return true;
}

/**
 * @implements {DSSClient}
 */
class BasicDSSClient {

    /**
     * @type {string[]}
     */
    ontologies = [];

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
        this.endpointInfo = (async () => {
            const resp = await fetch(`${baseUrl}/info`);
            const byte_data = await resp.text();
            const data = JSON.parse(byte_data.toString());
            return data;
        })();
    }

    /**
     * @param {DSSParams} params
     * @returns {Promise<{name: string, type: 'in'|'out', count: number}[]>}
     */
    async getProperties(params) {
        const endpointInfo = await this.endpointInfo;
        if (!(params.main.limit)) {
            params.main.limit = 500;
        }
        const limit = params.main.limit;

        const ontRequests = [];

        for (const ont of this.ontologies) {
            const endpoint = endpointInfo.find(e => e.db_schema_name === ont);
            if (!endpoint) {
                console.warn(`Warning: Endpoint not found for ontology ${ont}. Skipping.`);
                continue;
            }
            params.main.schemaName = endpoint.display_name;
            params.main.endpointUrl = endpoint.sparql_url;

            const resp = await fetch(`${this.baseUrl}/ontologies/${ont}/getProperties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            const byte_data = await resp.text();
            const data = JSON.parse(byte_data.toString());
            if (!data.complete) {
                if (this.trace_log) {
                    console.warn(`Warning: fetched properties for ontology ${ont} not complete (limit ${limit} reached) Ignoring results.`);
                }
            }
            ontRequests.push(Promise.resolve(data));
        }
        const requestResponses = (await Promise.all(ontRequests)).filter(x => x !== null);
        const results = requestResponses.filter(isPropertyResponse);
        return results.flatMap(r => r.data.map(
            (p) => ({ name: p.iri, type: p.mark, count: Number(p.cnt) })
        ));
    }

    /**
     * @param {DSSParams} params 
     * @returns {Promise<{value: string, count: number}[]>}
     */
    async getClasses(params) {
        const endpointInfo = await this.endpointInfo;

        if (!(params.main.limit)) {
            params.main.limit = 500;
        }
        const limit = params.main.limit;

        const results = [];
        for (const ont of this.ontologies) {
            results.push((async () => {
                const endpoint = endpointInfo.find(e => e.db_schema_name === ont);
                if (!endpoint) {
                    throw new Error(`Endpoint not found for ontology ${ont}`);
                }
                params.main.schemaName = endpoint.display_name;
                params.main.endpointUrl = endpoint.sparql_url;

                const resp = await fetch(`${this.baseUrl}/ontologies/${ont}/getClasses`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params),
                });
                const byte_data = await resp.text();
                const classes = JSON.parse(byte_data.toString());
                if (!classes.complete) {
                    if (this.trace_log) {
                        console.warn(`Warning: fetched classes for ontology ${ont} not complete (limit ${limit} reached) Ignoring results.`);
                    }
                }
                return classes;

            })());
        }
        const results_resolved = (await Promise.all(results)).filter(x => x !== null);
        return results_resolved.flatMap(
            (/** @type {{ data: { iri: string; cnt: number }[]; }} */ r) => r.data.map(c => ({ value: c.iri, count: Number(c.cnt) })));
    }
}

/**
 * @typedef {Object} TripletStore
 * @property {(tripletValue: string) => Promise<string[]>} getIncomingProperties
 * @property {(tripletValue: string) => Promise<string[]>} getOutgoingProperties
 * @property {(property: string) => Promise<string[]>} getClassesFromIncomingProperty
 * @property {(property: string) => Promise<string[]>} getClassesFromOutgoingProperty
 * @property {(tripletValue: string) => Promise<string[]>} getClassesOfElement
 */

/**
 * @implements {TripletStore}
 */
class ManualTripletStore {

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
     * @param {string} property
     * @return {Promise<string[]>}
     * */
    async getClassesFromIncomingProperty(property) {
        return this.triplets.filter(
            t => t.predicate === property)
            .map(t => t.object)
            .filter(v => !v.startsWith("?"))
            .filter(v => v != "");

    }

    /**
     * @param {string} property
     * @return {Promise<string[]>}
     * */
    async getClassesFromOutgoingProperty(property) {
        return this.triplets
            .filter(t => t.predicate === property)
            .map(t => t.subject)
            .filter(v => !v.startsWith("?"))
            .filter(v => v != "");
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
     * @return {Promise<{value: string, count: number}[]>}
     */
    async suggestIncomingProperties(tripletValue) {
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
        property_builder.propertyKind = 'ObjectExt';
        property_builder.limit = this.perRequestLimit;

        /**
         * @type {Array<{name: string, type: "in" | "out", count: number}> | null}
         */
        let valid_suggestions = null;

        for (const cls of known_classes) {
            const builder = property_builder.clone();
            builder.className = cls;
            const params = builder.buildDSSParams();
            const props = await this.dssClient.getProperties(params);
            if (valid_suggestions === null) {
                valid_suggestions = props;
            } else {
                valid_suggestions = intersectSuggestions(valid_suggestions, props, (a, b) => a.name === b.name && a.type === b.type);
            }
        }

        if (known_classes.length === 0) {
            const params = property_builder.buildDSSParams();
            const props = await this.dssClient.getProperties(params);
            valid_suggestions = props;
        }

        if (valid_suggestions === null) {
            valid_suggestions = [];
        }

        const incoming_properties = [...(new Array(...valid_suggestions))]
            .filter(p => p.type === "in")
            .map(p => ({ value: p.name, count: p.count }));

        return incoming_properties;
    }

    /**
     * 
     * @param {string} tripletValue 
     * @return {Promise<{value: string, count: number}[]>}
     */
    async suggestOutgoingProperties(tripletValue) {
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
        property_builder.propertyKind = 'ObjectExt';
        property_builder.limit = this.perRequestLimit;

        /**
         * @type {Array<{name: string, type: "in" | "out", count: number}> | null}
         */
        let valid_suggestions = null;

        for (const cls of known_classes) {
            const builder = property_builder.clone();
            builder.className = cls;
            builder.usePPRels = true;
            const params = builder.buildDSSParams();
            const props = await this.dssClient.getProperties(params);
            if (valid_suggestions === null) {
                valid_suggestions = props;
            } else {
                valid_suggestions = intersectSuggestions(valid_suggestions, props, (a, b) => a.name === b.name && a.type === b.type);
            }
        }

        if (known_classes.length === 0) {
            const params = property_builder.buildDSSParams();
            const props = await this.dssClient.getProperties(params);
            valid_suggestions = props;
        }

        if (valid_suggestions === null) {
            valid_suggestions = [];
        }

        const outgoing_properties = [...valid_suggestions].filter(p => p.type === "out").map(p => ({ value: p.name, count: p.count }));

        return outgoing_properties;
    }

    /**
     * 
     * @param {string} tripletValue 
     * @returns {Promise<{value: string, count: number}[]>}
     */
    async suggestClasses(tripletValue) {
        const known_value_classes = await this.tripletStore.getClassesOfElement(tripletValue);
        const known_value_incoming = await this.tripletStore.getIncomingProperties(tripletValue);
        const known_value_outgoing = await this.tripletStore.getOutgoingProperties(tripletValue);

        const known_classes = known_value_classes.filter(c => !c.startsWith("?"));
        const known_incoming = known_value_incoming.filter(p => !p.startsWith("?"));
        const known_outgoing = known_value_outgoing.filter(p => !p.startsWith("?"));

        const property_builder = new QueryBuilder();
        property_builder.incomingProperties = known_incoming;
        property_builder.outgoingProperties = known_outgoing;
        property_builder.propertyKind = 'ObjectExt';
        property_builder.limit = this.perRequestLimit;

        /**
         * @type {Array<{value: string, count: number}> | null}
         */
        let valid_suggestions = null;

        for (const cls of known_classes) {
            const builder = property_builder.clone();
            builder.className = cls;
            const params = builder.buildDSSParams();
            const classes = await this.dssClient.getClasses(params);
            if (valid_suggestions === null) {
                valid_suggestions = classes;
            } else {
                valid_suggestions = intersectSuggestions(valid_suggestions, classes);
            }
        }

        if (known_classes.length === 0) {
            const params = property_builder.buildDSSParams();
            const classes = await this.dssClient.getClasses(params);
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
    BasicDSSClient,
    QueryBuilder,
    ManualTripletStore,
    DSSAutocompletionClient,
    getEndpoints,
    intersectSuggestions
};