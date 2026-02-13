import { formatMembersCount } from '../formatMembersCount';

describe('formatMembersCount method', () => {
    test('formats numbers less than 1000', () => {
        expect(formatMembersCount(999)).toBe('999 members');
    });

    test('formats number 1000', () => {
        expect(formatMembersCount(1000)).toBe('1k members');
    });

    test('formats numbers more than 1000 and less than 1_000_000', () => {
        expect(formatMembersCount(1345)).toBe('1.3k members');
    });

    test('formats number 1_000_000', () => {
        expect(formatMembersCount(1_000_000)).toBe('1m members');
    });

    test('formats numbers more than 1_000_000', () => {
        expect(formatMembersCount(1_324_648)).toBe('1.3m members');
    });
});
