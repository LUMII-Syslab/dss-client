
const dotenv = require('dotenv');
const { jest } = require('@jest/globals');

dotenv.config({ quiet: true });
if (process.env.JEST_DEBUG) {
    // eslint-disable-next-line no-undef
    jest.setTimeout(999999);
}

