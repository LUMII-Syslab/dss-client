
const { expect, it, describe, beforeAll, jest, afterAll } = require('@jest/globals');

const { TripletStore, DSSClient, QueryBuilder } = require('./index.js');
const { afterEach, beforeEach } = require('node:test');
const { count } = require('node:console');
/** @import { TripletStore, DSSClient } from './index.js'  */


afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
});

describe('ManualTripletStore', () => {
    describe('With a simple set of triplets', () => {
        /** @type {TripletStore} */
        let store;
        beforeAll(() => {
            store = new TripletStore();
            store.triplets = [
                { subject: 'Alice', predicate: 'knows', object: 'Bob' },
                { subject: 'Bob', predicate: 'knows', object: 'Charlie' },
                { subject: 'Alice', predicate: 'likes', object: 'Ice Cream' },
                { subject: '?x', predicate: 'knows', object: '?y' },
                { subject: '?y', predicate: '?x', object: 'Charlie' },
                { subject: 'Alice', predicate: '?p', object: '?o' },
                { subject: 'Classful', predicate: 'a', object: 'Class' },
                { subject: 'Classless', predicate: 'something', object: 'Class' },
            ];
        });
        it('should be able to get incoming properties of an entity that exists', async () => {
            const results = await store.getIncomingProperties('Bob');
            expect(results).toEqual([
                'knows',
            ]);
        });
        it('would not include variables in incoming properties', async () => {
            const results = await store.getIncomingProperties('Charlie');
            expect(results).toEqual([
                'knows',
            ]);
        });

        it('should return empty array for incoming properties of an entity that does not exist', async () => {
            const results = await store.getIncomingProperties('NonExistent');
            expect(results).toEqual([]);
        });

        it('should be able to get outgoing properties of an entity that exists', async () => {
            const results = await store.getOutgoingProperties('Alice');
            expect(results).toContain('knows');
            expect(results).toContain('likes');
        });

        it('would not include variables in outgoing properties', async () => {
            const results = await store.getOutgoingProperties('Alice');
            expect(results).not.toContain('?p');
            expect(results).not.toContain('?o');
        });

        it('fetches classes of an instance correctly', async () => {
            const results = await store.getClassesOfElement('Classful');
            expect(results).toEqual(['Class']);
        });

        it('returns empty array for classes of an instance that does not have classes', async () => {
            const results = await store.getClassesOfElement('Classless');
            expect(results).toEqual([]);
        });
    });
});


describe('DSSClient', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('Correctly loads endpoint information', async () => {
        /** @type {{id: number, display_name: string, db_schema_name: string, schema_name: string, sparql_url: string}[]} */
        const mockedEndpointInfo = [
            {
                id: 1,
                display_name: 'Test Endpoint',
                db_schema_name: 'test_endpoint',
                schema_name: 'test_schema',
                sparql_url: 'http://example.com/sparql'
            },
            {
                id: 2,
                display_name: 'Another Endpoint',
                db_schema_name: 'another_endpoint',
                schema_name: 'another_schema',
                sparql_url: 'http://example.com/another-sparql'
            }
        ];
        jest.spyOn(global, 'fetch').mockResolvedValueOnce(
            new Response(JSON.stringify(mockedEndpointInfo))
        );

        const client = new DSSClient("http://example.com/dss");

        expect(global.fetch).toHaveBeenCalledWith("http://example.com/dss/info", { signal: null });
        expect(await client.endpointInfo).toEqual(mockedEndpointInfo);
    });

    describe('getProperties', () => {
        const makeClient = async () => {
            const baseUrl = "http://example.com/dss";
            const ontology = "test_endpoint";
            const expectedUrl = `${baseUrl}/ontologies/${ontology}/getProperties`;
            const fetchSpy = jest.spyOn(global, 'fetch');
            fetchSpy.mockClear();
            fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify([
                {
                    id: 1,
                    display_name: 'Test Endpoint',
                    db_schema_name: 'test_endpoint',
                    schema_name: 'test_schema',
                    sparql_url: 'http://example.com/sparql'
                }
            ])));
            const client = new DSSClient(baseUrl);
            client.ontology = ontology;
            await client.endpointInfo;
            fetchSpy.mockClear();
            let queryBuilder = new QueryBuilder();
            queryBuilder.limit = 500;
            queryBuilder.propertyKind = 'All';
            return { client, fetchSpy, expectedUrl, ontology, queryBuilder };
        };

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('Calls fetch with correct parameters', async () => {
            const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
            fetchSpy.mockResolvedValueOnce(
                new Response(JSON.stringify({
                    data: [

                    ], complete: true
                }))
            );
            const result = await client.getProperties({
                main: {
                    limit: 250,
                    propertyKind: 'All',
                }
            });
            expect(result).toEqual([

            ]);

            const receivedUrl = fetchSpy.mock.calls[0][0];
            const receivedInit = fetchSpy.mock.calls[0][1];
            expect(receivedUrl).toBe(expectedUrl);
            expect(receivedInit.method).toBe('POST');
            expect(receivedInit.headers['Content-Type']).toBe('application/json');
            const body = JSON.parse(receivedInit.body);
            expect(body).toHaveProperty('main');
            expect(body.main).toHaveProperty('limit');
            expect(body.main.limit).toBe(250);
            expect(body.main).toHaveProperty('propertyKind');
            expect(body.main.propertyKind).toBe('All');

        });
        it('Functions on a base case', async () => {
            const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
            queryBuilder.limit = 100;
            const dssParams = queryBuilder.buildDSSParams();
            fetchSpy.mockResolvedValueOnce(
                new Response(JSON.stringify({
                    data: [
                        { iri: 'http://example.com/prop1', mark: 'in', o: 10, cnt: 2000 },
                        { iri: 'http://example.com/prop2', mark: 'out', o: 5, cnt: 1000 },
                    ], complete: true
                }))
            );
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
            const result = await client.getProperties(dssParams);
            expect(result).toEqual([
                { name: 'http://example.com/prop1', type: 'in', count: 10 },
                { name: 'http://example.com/prop2', type: 'out', count: 5 },
            ]);
            expect(consoleWarnSpy).not.toHaveBeenCalled();
            consoleWarnSpy.mockRestore();
        });
        it('Sets limit to 500 when not provided', async () => {
            const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
            queryBuilder.limit = undefined;
            const dssParams = queryBuilder.buildDSSParams();
            fetchSpy.mockResolvedValueOnce(
                new Response(JSON.stringify({
                    data: [
                        { iri: 'http://example.com/prop1', mark: 'in', o: 10, cnt: 2000 },
                        { iri: 'http://example.com/prop2', mark: 'out', o: 5, cnt: 1000 },
                    ], complete: true
                }))
            );

            const result = await client.getProperties(dssParams);
            expect(result).toEqual([
                { name: 'http://example.com/prop1', type: 'in', count: 10 },
                { name: 'http://example.com/prop2', type: 'out', count: 5 },
            ]);
            const receivedInit = fetchSpy.mock.calls[0][1];
            const body = JSON.parse(receivedInit.body);
            expect(body.main.limit).toBe(500);
        });
        it('Throws when there are no ontologies set up', async () => {
            const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
            client.ontology = null;
            await expect(client.getProperties({
                main: {
                    limit: 250,
                    propertyKind: 'All',
                }
            })).rejects.toThrow();
        });
        it('Throws when ontology does not match an existing one', async () => {
            const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
            client.ontology = 'nonexistent_ontology';
            await expect(client.getProperties(queryBuilder.buildDSSParams())).rejects.toThrow();
        });
        describe('Bad responses', () => {
            it('Handles non-JSON response', async () => {
                const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
                fetchSpy.mockResolvedValueOnce(
                    new Response("Not a JSON")
                );
                await expect(client.getProperties(queryBuilder.buildDSSParams())).rejects.toThrow();
            });
            it('Handles a non-object response', async () => {
                const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
                fetchSpy.mockResolvedValueOnce(
                    new Response(JSON.stringify("Not an object"))
                );
                await expect(client.getProperties(queryBuilder.buildDSSParams())).rejects.toThrow();
            });
            it('Handles missing data and complete fields', async () => {
                const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
                fetchSpy.mockResolvedValueOnce(
                    new Response(JSON.stringify({
                        data: [],
                    }))
                );
                await expect(client.getProperties(queryBuilder.buildDSSParams())).rejects.toThrow();
                fetchSpy.mockResolvedValueOnce(
                    new Response(JSON.stringify({
                        complete: true,
                    })));
                await expect(client.getProperties(queryBuilder.buildDSSParams())).rejects.toThrow();
            });
            it('Handles data field not being an array', async () => {
                const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
                fetchSpy.mockResolvedValueOnce(
                    new Response(JSON.stringify({
                        data: "Not an array",
                        complete: true,
                    })));
                await expect(client.getProperties(queryBuilder.buildDSSParams())).rejects.toThrow();
            });
            it('Handles items in data array not being objects', async () => {
                const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
                fetchSpy.mockResolvedValueOnce(
                    new Response(JSON.stringify({
                        data: ["Not an object"],
                        complete: true,
                    })));
                await expect(client.getProperties(queryBuilder.buildDSSParams())).rejects.toThrow();
            });
            it('Handles items in data array missing iri or mark', async () => {
                const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
                fetchSpy.mockResolvedValueOnce(
                    new Response(JSON.stringify({
                        data: [{ value: 'prop1', count: 10 }],
                        complete: true,
                    })));
                await expect(client.getProperties(queryBuilder.buildDSSParams())).rejects.toThrow();
            });
            it('Handles items in data array having invalid mark', async () => {
                const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
                fetchSpy.mockResolvedValueOnce(
                    new Response(JSON.stringify({
                        data: [{ value: 'prop1', count: 10, mark: 'invalid' }],
                        complete: true,
                    })));
                await expect(client.getProperties(queryBuilder.buildDSSParams())).rejects.toThrow();
            });
            it('Handles items in data array having invalid count or o fields', async () => {
                const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
                fetchSpy.mockResolvedValueOnce(
                    new Response(JSON.stringify({
                        data: [{ value: 'prop1', count: 'invalid', mark: 'valid' }],
                        complete: true,
                    })));
                await expect(client.getProperties(queryBuilder.buildDSSParams())).rejects.toThrow();
            });
            it('Handles complete field not being a boolean', async () => {
                const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
                fetchSpy.mockResolvedValueOnce(
                    new Response(JSON.stringify({
                        data: [],
                        complete: 'not a boolean',
                    })));
                await expect(client.getProperties(queryBuilder.buildDSSParams())).rejects.toThrow();
            });
        });

    });

    describe('getClasses', () => {
        const makeClient = async () => {
            const baseUrl = "http://example.com/dss";
            const ontology = "test_endpoint";
            const expectedUrl = `${baseUrl}/ontologies/${ontology}/getProperties`;
            const fetchSpy = jest.spyOn(global, 'fetch');
            fetchSpy.mockClear();
            fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify([
                {
                    id: 1,
                    display_name: 'Test Endpoint',
                    db_schema_name: 'test_endpoint',
                    schema_name: 'test_schema',
                    sparql_url: 'http://example.com/sparql'
                }
            ])));
            const client = new DSSClient(baseUrl);
            await client.endpointInfo;
            fetchSpy.mockClear();
            client.ontology = ontology;
            let queryBuilder = new QueryBuilder();
            queryBuilder.limit = 500;
            queryBuilder.propertyKind = 'All';
            return { client, fetchSpy, expectedUrl, ontology, queryBuilder };
        };
        it('Returns classes correctly on a base case', async () => {
            const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
            fetchSpy.mockResolvedValueOnce(
                new Response(JSON.stringify({
                    data: [
                        { iri: 'http://example.com/Class1', cnt: 100 },
                        { iri: 'http://example.com/Class2', cnt: 50 },
                    ], complete: true
                }))
            );
            const result = await client.getClasses(queryBuilder.buildDSSParams());
            expect(result).toEqual([
                { value: 'http://example.com/Class1', count: 100 },
                { value: 'http://example.com/Class2', count: 50 },
            ]);
        });
        it('Sets limit to 500 when not provided', async () => {
            const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
            queryBuilder.limit = undefined;
            const dssParams = queryBuilder.buildDSSParams();
            fetchSpy.mockResolvedValueOnce(
                new Response(JSON.stringify({
                    data: [
                        { iri: 'http://example.com/Class1', cnt: 100 },
                        { iri: 'http://example.com/Class2', cnt: 50 },
                    ], complete: true
                }))
            );
            const result = await client.getClasses(dssParams);
            expect(result).toEqual([
                { value: 'http://example.com/Class1', count: 100 },
                { value: 'http://example.com/Class2', count: 50 },
            ]);
            const receivedInit = fetchSpy.mock.calls[0][1];
            const body = JSON.parse(receivedInit.body);
            expect(body.main.limit).toBe(500);
        });
        it('Throws when ontology does not match an existing one', async () => {
            const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
            queryBuilder.ontology = 'non_existent_ontology';
            const dssParams = queryBuilder.buildDSSParams();
            await expect(client.getClasses(dssParams)).rejects.toThrow();
        });
        describe('Bad responses', () => {
            it('Handles non-JSON response', async () => {
                const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
                fetchSpy.mockResolvedValueOnce(
                    new Response("Not a JSON")
                );
                await expect(client.getClasses(queryBuilder.buildDSSParams())).rejects.toThrow();
            });
            it('Handles a non-object response', async () => {
                const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
                fetchSpy.mockResolvedValueOnce(
                    new Response(JSON.stringify("Not an object"))
                );
                await expect(client.getClasses(queryBuilder.buildDSSParams())).rejects.toThrow();
            });
            it('Handles missing data and complete fields', async () => {
                const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
                fetchSpy.mockResolvedValueOnce(
                    new Response(JSON.stringify({
                        data: [],
                    }))
                );
                await expect(client.getClasses(queryBuilder.buildDSSParams())).rejects.toThrow();
                fetchSpy.mockResolvedValueOnce(
                    new Response(JSON.stringify({
                        complete: true,
                    })));
                await expect(client.getClasses(queryBuilder.buildDSSParams())).rejects.toThrow();

            });
            it('Handles data field not being an array', async () => {
                const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
                fetchSpy.mockResolvedValueOnce(
                    new Response(JSON.stringify({
                        data: "Not an array",
                        complete: true,
                    })));
                await expect(client.getClasses(queryBuilder.buildDSSParams())).rejects.toThrow();
            });
            it('Handles items in data array not being objects', async () => {
                const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
                fetchSpy.mockResolvedValueOnce(
                    new Response(JSON.stringify({
                        data: ["Not an object"],
                        complete: true,
                    })));
                await expect(client.getClasses(queryBuilder.buildDSSParams())).rejects.toThrow();
            });
            it('Handles items in data array missing iri', async () => {
                const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
                fetchSpy.mockResolvedValueOnce(
                    new Response(JSON.stringify({
                        data: [{ cnt: 10 }],
                        complete: true,
                    })));
                await expect(client.getClasses(queryBuilder.buildDSSParams())).rejects.toThrow();
            });
            it('Handles items in data array having invalid cnt field', async () => {
                const { client, fetchSpy, expectedUrl, ontology, queryBuilder } = await makeClient();
                fetchSpy.mockResolvedValueOnce(
                    new Response(JSON.stringify({
                        data: [{ value: 'prop1', cnt: "not a number" }],
                        complete: true,
                    })));
                await expect(client.getClasses(queryBuilder.buildDSSParams())).rejects.toThrow();
            });
        });
    });

});


describe('intersectSuggestions', () => {
    it('Returns suggestions that are in both lists', async () => {
        const { intersectSuggestions } = require('./index.js');
        const list1 = [
            { value: 'prop1', count: 10 },
            { value: 'prop2', count: 5 },
            { value: 'prop3', count: 8 }
        ];
        const list2 = [
            { value: 'prop2', count: 7 },
            { value: 'prop3', count: 3 },
            { value: 'prop4', count: 12 }
        ];
        const result = intersectSuggestions(list1, list2,
            (v1, v2) => v1.value === v2.value,
        );
        expect(result.find(r => r.value === 'prop2')).toBeTruthy();
        expect(result.find(r => r.value === 'prop3')).toBeTruthy();
        expect(result.find(r => r.value === 'prop1')).toBeFalsy();
        expect(result.find(r => r.value === 'prop4')).toBeFalsy();
    });

    it('Takes min count of suggestions that are in both lists', () => {
        const { intersectSuggestions } = require('./index.js');
        const list1 = [
            { value: 'prop1', count: 10 },
            { value: 'prop2', count: 5 },
            { value: 'prop3', count: 8 }
        ];
        const list2 = [
            { value: 'prop2', count: 7 },
            { value: 'prop3', count: 3 },
            { value: 'prop4', count: 12 }
        ];
        const result = intersectSuggestions(list1, list2,
            (v1, v2) => v1.value === v2.value,
        );
        const prop2 = result.find(r => r.value === 'prop2');
        const prop3 = result.find(r => r.value === 'prop3');
        expect(prop2).toBeTruthy();
        expect(prop3).toBeTruthy();
        expect(prop2.count).toBe(5);
        expect(prop3.count).toBe(3);
    });
    it('Handles empty lists', () => {
        const { intersectSuggestions } = require('./index.js');
        const list1 = [];
        const list2 = [
            { value: 'prop2', count: 7 },
            { value: 'prop3', count: 3 },
        ];
        const result = intersectSuggestions(list1, list2,
            (v1, v2) => v1.value === v2.value,
        );
        expect(result).toEqual([]);

        const result2 = intersectSuggestions(list2, list1,
            (v1, v2) => v1.value === v2.value,
        );
        expect(result2).toEqual([]);

        const result3 = intersectSuggestions([], [],
            (v1, v2) => v1.value === v2.value,
        );
        expect(result3).toEqual([]);
    });
});

function generateTestSetup() {

    const tripletStore = new TripletStore();
    tripletStore.triplets = [
        { subject: 'Alice', predicate: 'knows', object: 'Bob' },
        { subject: 'Bob', predicate: 'knows', object: 'Charlie' },
        { subject: 'Alice', predicate: 'likes', object: 'Ice Cream' },
        { subject: 'Alice', predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', object: 'Person' },
        { subject: 'Bob', predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', object: 'Person' },
        { subject: 'Charlie', predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', object: 'Person' },
        { subject: 'Ice Cream', predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', object: 'Food' },
        { subject: '?x', predicate: 'likes', object: '?y' },
    ];

    const fetchMock = jest.spyOn(global, 'fetch');

    return { tripletStore, fetchMock };
}

describe('getEndpoints', () => {
    it('Fetches and returns endpoint information correctly', async () => {
        const { fetchMock } = generateTestSetup();
        fetchMock.mockImplementation(async (url, init) => {
            if (url.endsWith('/info')) {
                return new Response(JSON.stringify([
                    {
                        id: 1,
                        display_name: 'Test Endpoint',
                        db_schema_name: 'test_endpoint',
                        schema_name: 'test_schema',
                        sparql_url: 'http://example.com/sparql'
                    }
                ]));
            }
            return new Response("Error", { status: 500 });
        });
        const { getEndpoints } = require('./index.js');
        const endpoints = await getEndpoints("http://example.com/dss");
        expect(endpoints).toEqual([
            {
                id: 1,
                display_name: 'Test Endpoint',
                db_schema_name: 'test_endpoint',
                schema_name: 'test_schema',
                sparql_url: 'http://example.com/sparql'
            }
        ]);
        fetchMock.mockRestore();
    });
});


describe('DSSAutocompletionClient', () => {
    describe('suggestOutgoingProperties', () => {
        it('Returns "likes" when given "Alice"', async () => {
            const { tripletStore, fetchMock } = generateTestSetup();
            fetchMock.mockImplementation(async (url, init) => {
                if (url.endsWith('/info')) {
                    return new Response(JSON.stringify([
                        {
                            id: 1,
                            display_name: 'Test Endpoint',
                            db_schema_name: 'test_endpoint',
                            schema_name: 'test_schema',
                            sparql_url: 'http://example.com/sparql'
                        }
                    ]));
                }
                return new Response("Error", { status: 500 });
            });
            const { DSSAutocompletionClient } = require('./index.js');
            const dss_client = new DSSClient("http://example.com/dss");
            dss_client.endpointInfo = Promise.resolve([
                {
                    id: 1,
                    display_name: 'Test Endpoint',
                    db_schema_name: 'test_endpoint',
                    schema_name: 'test_schema',
                    sparql_url: 'http://example.com/sparql'
                }
            ]);
            const propertiesMock = jest.spyOn(dss_client, 'getProperties').mockImplementation(async (params) => {
                const className = params.element.className;
                if (className === 'Person') {
                    return [
                        { name: 'knows', type: 'out', count: 10 },
                        { name: 'likes', type: 'out', count: 5 },
                        { name: 'a', type: 'out', count: 3 },
                    ];
                } else if (className === 'Food') {
                    return [
                        { name: 'a', type: 'out', count: 20 },
                    ];
                }
                return [];
            });
            const autocompletionClient = new DSSAutocompletionClient(tripletStore, dss_client);
            const suggestions = await autocompletionClient.suggestOutgoingProperties('Alice');
            expect(suggestions).toContainEqual({
                value: 'likes',
                count: 5,
            });

            expect(fetchMock.mock.calls.length).toBe(1);
            expect(propertiesMock).toHaveBeenCalledWith(expect.objectContaining({
                element: expect.objectContaining({
                    className: 'Person',
                }),
            }), null);


            fetchMock.mockRestore();
            propertiesMock.mockRestore();
        });
    });

    describe('suggestClasses', () => {
        it('Returns "Food" when given "?y"', async () => {
            const { tripletStore, fetchMock } = generateTestSetup();
            fetchMock.mockImplementation(async (url, init) => {
                if (url.endsWith('/info')) {
                    return new Response(JSON.stringify([
                        {
                            id: 1,
                            display_name: 'Test Endpoint',
                            db_schema_name: 'test_endpoint',
                            schema_name: 'test_schema',
                            sparql_url: 'http://example.com/sparql'
                        }
                    ]));
                }
                return new Response("Error", { status: 500 });
            });
            const { DSSAutocompletionClient } = require('./index.js');
            const dss_client = new DSSClient("http://example.com/dss");
            dss_client.endpointInfo = Promise.resolve([
                {
                    id: 1,
                    display_name: 'Test Endpoint',
                    db_schema_name: 'test_endpoint',
                    schema_name: 'test_schema',
                    sparql_url: 'http://example.com/sparql'
                }
            ]);
            dss_client.ontology = 'test_endpoint';
            const classesMock = jest.spyOn(dss_client, 'getClasses').mockImplementation(async (params) => {
                const inProperties = params.element.pList.in.map(p => p.name);
                if (inProperties.includes('likes')) {
                    return [
                        { value: 'Food', count: 10 },
                    ];
                }
            });
            const autocompletionClient = new DSSAutocompletionClient(tripletStore, dss_client);
            const suggestions = await autocompletionClient.suggestClasses('?y');
            expect(suggestions).toContainEqual({
                value: 'Food',
                count: expect.any(Number),
            });

            expect(fetchMock.mock.calls.length).toBe(1);
            fetchMock.mockRestore();
            classesMock.mockRestore();
        });
    });

    describe('suggestIncomingProperties', () => {
        it('Returns "knows" when given "?x"', async () => {
            const { tripletStore, fetchMock } = generateTestSetup();
            fetchMock.mockImplementation(async (url, init) => {
                if (url.endsWith('/info')) {
                    return new Response(JSON.stringify([
                        {
                            id: 1,
                            display_name: 'Test Endpoint',
                            db_schema_name: 'test_endpoint',
                            schema_name: 'test_schema',
                            sparql_url: 'http://example.com/sparql'
                        }
                    ]));
                }
                return new Response("Error", { status: 500 });
            });
            const { DSSAutocompletionClient } = require('./index.js');
            const dss_client = new DSSClient("http://example.com/dss");
            dss_client.endpointInfo = Promise.resolve([
                {
                    id: 1,
                    display_name: 'Test Endpoint',
                    db_schema_name: 'test_endpoint',
                    schema_name: 'test_schema',
                    sparql_url: 'http://example.com/sparql'
                }
            ]);
            dss_client.ontology = 'test_endpoint';
            const propertiesMock = jest.spyOn(dss_client, 'getProperties').mockImplementation(async (params) => {

                const className = params.element.className;
                if (className === 'Person') {
                    return [
                        { name: 'knows', type: 'in', count: 10 },
                        { name: 'likes', type: 'out', count: 5 },
                        { name: 'a', type: 'out', count: 3 },
                    ];
                }
                if (params.element.pList.out.some(p => p.name === 'likes')) {
                    return [
                        { name: 'knows', type: 'in', count: 10 },
                        { name: 'knows', type: 'in', count: 10 },
                    ];
                }
                if (params.element.pList.in.some(p => p.name === 'knows')) {
                    return [
                        { name: 'knows', type: 'in', count: 10 },
                    ];
                }
                return [];
            });
            const autocompletionClient = new DSSAutocompletionClient(tripletStore, dss_client);
            const suggestions = await autocompletionClient.suggestIncomingProperties('?x');
            expect(suggestions).toContainEqual({
                value: 'knows',
                count: 10,
            });
            expect(fetchMock.mock.calls.length).toBe(1);
            fetchMock.mockRestore();
            propertiesMock.mockRestore();
        });
    });
});
