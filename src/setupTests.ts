// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

jest.mock('axios', () => {
    const mockAxiosInstance = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        defaults: {
            headers: { common: {} },
        },
        interceptors: {
            request: {
                use: jest.fn(),
                eject: jest.fn(),
            },
            response: {
                use: jest.fn(),
                eject: jest.fn(),
            },
        },
    };

    return {
        __esModule: true,
        default: {
            create: jest.fn(() => mockAxiosInstance),
            ...mockAxiosInstance,
        },
    };
});

if (typeof global.TextEncoder === 'undefined') {
    const { TextEncoder, TextDecoder } = require('util');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
}
