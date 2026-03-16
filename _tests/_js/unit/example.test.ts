/**
 * @jest-environment jsdom
 */

import hlp from 'hlp';

describe('Test group 1', () => {
    test(
        '{} should be an object',
        () => {
            expect(hlp.isObject({})).toBe(true);
        },
        3000
    );

    /* this only runs this specific test
    /*
    test.only(
        expect(true).toBe(false);
    );
    */
});
