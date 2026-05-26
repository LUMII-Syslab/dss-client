
const { expect, it, describe, beforeAll, jest, afterAll } = require('@jest/globals');
const { TripletStore, DSSClient, QueryBuilder } = require('@src/index.js');
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


describe('intersectSuggestions', () => {
    it('Returns suggestions that are in both lists', async () => {
        const { intersectSuggestions } = require('@src/index.js');
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
        const { intersectSuggestions } = require('@src/index.js');
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
        const { intersectSuggestions } = require('@src/index.js');
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
