import { formatCreationDate } from '../formatCreationDate';

describe('formatCreationDate function', () => {
    const originalDateNow = Date.now;

    beforeEach(() => {
        const mockNow = new Date('2026-01-12T12:00:00Z').getTime();
        Date.now = jest.fn(() => mockNow);
    });

    afterEach(() => {
        Date.now = originalDateNow;
    });

    test('returns "Just now" for current time', () => {
        const now = new Date('2026-01-12T12:00:00Z').toISOString();
        expect(formatCreationDate(now)).toBe('Just now');
    });

    test('returns "Just now" for invalid date', () => {
        expect(formatCreationDate('abc')).toBe('Just now');
    });

    test('returns seconds format for less than a minute', () => {
        const thirtySecondsAgo = new Date('2026-01-12T11:59:30Z').toISOString();
        expect(formatCreationDate(thirtySecondsAgo)).toBe('30 seconds ago');

        const oneSecondAgo = new Date('2026-01-12T11:59:59Z').toISOString();
        expect(formatCreationDate(oneSecondAgo)).toBe('1 second ago');
    });

    test('returns minutes format for less than an hour', () => {
        const thirtyMinutesAgo = new Date('2026-01-12T11:30:00Z').toISOString();
        expect(formatCreationDate(thirtyMinutesAgo)).toBe('30 minutes ago');

        const oneMinuteAgo = new Date('2026-01-12T11:59:00Z').toISOString();
        expect(formatCreationDate(oneMinuteAgo)).toBe('1 minute ago');

        const fiftyNineMinutesAgo = new Date(
            '2026-01-12T11:01:00Z'
        ).toISOString();
        expect(formatCreationDate(fiftyNineMinutesAgo)).toBe('59 minutes ago');
    });

    test('returns hours format for less than a day', () => {
        const fiveHoursAgo = new Date('2026-01-12T07:00:00Z').toISOString();
        expect(formatCreationDate(fiveHoursAgo)).toBe('5 hours ago');

        const oneHourAgo = new Date('2026-01-12T11:00:00Z').toISOString();
        expect(formatCreationDate(oneHourAgo)).toBe('1 hour ago');

        const twentyThreeHoursAgo = new Date(
            '2026-01-11T13:00:00Z'
        ).toISOString();
        expect(formatCreationDate(twentyThreeHoursAgo)).toBe('23 hours ago');
    });

    test('returns days format for less than a week', () => {
        const threeDaysAgo = new Date('2026-01-09T12:00:00Z').toISOString();
        expect(formatCreationDate(threeDaysAgo)).toBe('3 days ago');

        const oneDayAgo = new Date('2026-01-11T12:00:00Z').toISOString();
        expect(formatCreationDate(oneDayAgo)).toBe('1 day ago');

        const sixDaysAgo = new Date('2026-01-06T12:00:00Z').toISOString();
        expect(formatCreationDate(sixDaysAgo)).toBe('6 days ago');
    });

    test('returns weeks format for less than a month', () => {
        const twoWeeksAgo = new Date('2025-12-28T12:00:00Z').toISOString();
        expect(formatCreationDate(twoWeeksAgo)).toBe('2 weeks ago');

        const oneWeekAgo = new Date('2026-01-05T12:00:00Z').toISOString();
        expect(formatCreationDate(oneWeekAgo)).toBe('1 week ago');

        const threeWeeksAgo = new Date('2025-12-22T12:00:00Z').toISOString();
        expect(formatCreationDate(threeWeeksAgo)).toBe('3 weeks ago');
    });

    test('returns months format for less than a year', () => {
        const fiveMonthsAgo = new Date('2025-08-12T12:00:00Z').toISOString();
        expect(formatCreationDate(fiveMonthsAgo)).toBe('5 months ago');

        const oneMonthAgo = new Date('2025-12-12T12:00:00Z').toISOString();
        expect(formatCreationDate(oneMonthAgo)).toBe('1 month ago');

        const elevenMonthsAgo = new Date('2025-02-12T12:00:00Z').toISOString();
        expect(formatCreationDate(elevenMonthsAgo)).toBe('11 months ago');
    });

    test('returns years format for more than a year', () => {
        const twoYearsAgo = new Date('2024-01-12T12:00:00Z').toISOString();
        expect(formatCreationDate(twoYearsAgo)).toBe('2 years ago');

        const oneYearAgo = new Date('2025-01-12T12:00:00Z').toISOString();
        expect(formatCreationDate(oneYearAgo)).toBe('1 year ago');

        const fiveYearsAgo = new Date('2021-01-12T12:00:00Z').toISOString();
        expect(formatCreationDate(fiveYearsAgo)).toBe('5 years ago');
    });
});
