import { render, screen, waitFor } from '@testing-library/react';
import { profileApi } from '../../../../../utils/api/api';
import { CardStatisticsList } from '../CardStatisticsList';

jest.mock('../../../../../../store/api/api', () => ({
    profileApi: {
        getPosts: jest.fn(),
        getLikes: jest.fn(),
        getComments: jest.fn(),
    },
}));

jest.mock('./components/CardStatistics', () => ({
    CardStatistics: ({ title, count, progress }: any) => (
        <div data-testid={`card-${title.toLowerCase()}`}>
            {title}: {count} ({progress})
        </div>
    ),
}));

describe('CardStatisticsList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders statistics after API call', async () => {
        (profileApi.getPosts as jest.Mock).mockResolvedValue({
            data: [{ id: 1 }],
        });
        (profileApi.getLikes as jest.Mock).mockResolvedValue({
            data: [{ id: 1 }, { id: 2 }],
        });
        (profileApi.getComments as jest.Mock).mockResolvedValue({ data: [] });

        render(<CardStatisticsList />);

        await waitFor(() => {
            expect(screen.getByTestId('card-posts')).toBeInTheDocument();
            expect(screen.getByTestId('card-likes')).toBeInTheDocument();
            expect(screen.getByTestId('card-comments')).toBeInTheDocument();
        });

        expect(
            screen.getByText('Posts: 1 (+5% from last month)')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Likes: 2 (+12% from last month)')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Comments: 0 (+8% from last month)')
        ).toBeInTheDocument();
    });

    test('handles empty responses', async () => {
        (profileApi.getPosts as jest.Mock).mockResolvedValue({ data: [] });
        (profileApi.getLikes as jest.Mock).mockResolvedValue({ data: [] });
        (profileApi.getComments as jest.Mock).mockResolvedValue({ data: [] });

        render(<CardStatisticsList />);

        await waitFor(() => {
            expect(
                screen.getByText('Posts: 0 (+5% from last month)')
            ).toBeInTheDocument();
            expect(
                screen.getByText('Likes: 0 (+12% from last month)')
            ).toBeInTheDocument();
            expect(
                screen.getByText('Comments: 0 (+8% from last month)')
            ).toBeInTheDocument();
        });
    });
});
