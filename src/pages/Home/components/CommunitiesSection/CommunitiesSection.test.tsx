import { render, screen, waitFor } from '@testing-library/react';
import { CommunitiesSection } from './CommunitiesSection';
import { profileApi } from '../../../../utils/api/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Community } from '../../../../store/types';

jest.mock('../../../../utils/api/api', () => ({
    profileApi: {
        getCommunities: jest.fn(),
    },
}));

jest.mock('../../../../components/SectionItem/SectionItem', () => ({
    SectionItem: ({ title, subtitle }: { title: string; subtitle: string }) => (
        <div data-testid="community-item">
            <div data-testid="community-title">{title}</div>
            <div data-testid="community-subtitle">{subtitle}</div>
        </div>
    ),
}));

jest.mock(
    'components/Skeletons/SectionItemSkeleton/SectionItemSkeleton',
    () => ({
        SectionItemSkeleton: () => <div data-testid="skeleton">Loading...</div>,
    })
);

jest.mock('../../../../utils/formatMembersCount', () => ({
    formatMembersCount: jest.fn((count: number) => `${count} members`),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) =>
            ({
                'pages.home.communities.title': 'Communities you might like',
            })[key] || key,
    }),
}));

import { formatMembersCount } from '../../../../utils/formatMembersCount';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('CommunitiesSection', () => {
    const mockCommunities: Community[] = [
        {
            id: '1',
            title: 'Tech Enthusiasts',
            membersCount: 1500,
            photo: 'tech.jpg',
        },
        {
            id: '2',
            title: 'Art Lovers',
            membersCount: 800,
            photo: 'art.jpg',
        },
        {
            id: '3',
            title: 'Music Fans',
            membersCount: 2500,
            photo: 'music.jpg',
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        queryClient.clear();

        (profileApi.getCommunities as jest.Mock).mockResolvedValue({
            data: mockCommunities,
        });

        (formatMembersCount as jest.Mock).mockClear();
    });

    test('renders heading correctly', () => {
        render(<CommunitiesSection />, { wrapper });
        expect(
            screen.getByText('Communities you might like')
        ).toBeInTheDocument();
    });

    test('shows loading skeletons initially', () => {
        (profileApi.getCommunities as jest.Mock).mockReturnValueOnce(
            new Promise(() => {})
        );

        render(<CommunitiesSection />, { wrapper });
        expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
    });

    test('shows communities when data loads', async () => {
        render(<CommunitiesSection />, { wrapper });

        await waitFor(() => {
            expect(screen.getByText('Tech Enthusiasts')).toBeInTheDocument();
        });

        expect(screen.getByText('Art Lovers')).toBeInTheDocument();
        expect(screen.getByText('Music Fans')).toBeInTheDocument();
    });

    test('shows empty state when no communities', async () => {
        (profileApi.getCommunities as jest.Mock).mockResolvedValueOnce({
            data: [],
        });

        render(<CommunitiesSection />, { wrapper });

        await waitFor(() => {
            expect(
                screen.queryByTestId('community-item')
            ).not.toBeInTheDocument();
        });
    });

    test('calls API once', async () => {
        render(<CommunitiesSection />, { wrapper });

        await waitFor(() => {
            expect(screen.getByText('Tech Enthusiasts')).toBeInTheDocument();
        });

        expect(profileApi.getCommunities).toHaveBeenCalledTimes(1);
    });

    test('removes skeletons after data loads', async () => {
        render(<CommunitiesSection />, { wrapper });

        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Tech Enthusiasts')).toBeInTheDocument();
    });

    test('handles community without photo', async () => {
        const communityWithoutPhoto: Community = {
            id: '4',
            title: 'No Photo Group',
            membersCount: 100,
            photo: undefined,
        };

        (profileApi.getCommunities as jest.Mock).mockResolvedValueOnce({
            data: [communityWithoutPhoto],
        });

        render(<CommunitiesSection />, { wrapper });

        await waitFor(() => {
            expect(screen.getByText('No Photo Group')).toBeInTheDocument();
        });
    });

    test('renders with correct HTML structure', () => {
        render(<CommunitiesSection />, { wrapper });

        expect(document.querySelector('aside')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
        expect(document.querySelector('.section-list')).toBeInTheDocument();
    });
});
