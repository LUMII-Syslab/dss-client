

const { expect, test } = require('@jest/globals');

const { ManualTripletStore } = require('./index.js');
/** @import { DSSParams, TripletStore } from './index.js'  */

if (process.env.JEST_DEBUG) {
    // eslint-disable-next-line no-undef
    jest.setTimeout(999999);
}

test('ManualTripletStore', async () => {
    const store = new ManualTripletStore();
    store.triplets = [
        { subject: 'Alice', predicate: 'knows', object: 'Bob' },
        { subject: 'Bob', predicate: 'knows', object: 'Charlie' },
        { subject: 'Alice', predicate: 'likes', object: 'Ice Cream' },
        { subject: '?x', predicate: 'knows', object: '?y' },
        { subject: '?y', predicate: '?x', object: 'Charlie' },
    ];

    /** @type {TripletStore} */
    const tripletStore = store;
    {
        // Test if it fetches the correct property
        const results = await tripletStore.getIncomingProperties('Bob');
        expect(results).toEqual([
            'knows',
        ]);
    }

    {
        // Test if it ignores the variable triplet
        const results = await tripletStore.getIncomingProperties('Charlie');
        expect(results).toEqual([
            'knows',
        ]);
    }
});