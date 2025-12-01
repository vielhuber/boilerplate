export default {
    automock: false,
    preset: 'jest-puppeteer',
    testMatch: ['**/_tests/_js/**/*.js?(x)'],
    testTimeout: 60 * 1000,
    testEnvironmentOptions: {
        url: 'https://tld.com/?foo=bar&bar=baz'
    }
};
