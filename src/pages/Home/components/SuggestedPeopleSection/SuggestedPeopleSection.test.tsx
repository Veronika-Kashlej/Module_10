import { render, screen, waitFor } from '@testing-library/react';
import { SuggestedPeopleSection } from './SuggestedPeopleSection';
import { profileApi } from '../../../../utils/api/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuggestedPeople } from '../../../../store/types';

jest.mock('../../../../utils/api/api', () => ({
    profileApi: {
        getSuggestedUsers: jest.fn(),
    },
}));

jest.mock('components/SectionItem/SectionItem', () => ({
    SectionItem: ({ title, subtitle }: { title: string; subtitle: string }) => (
        <div data-testid="section-item">
            <div data-testid="section-title">{title}</div>
            <div data-testid="section-subtitle">{subtitle}</div>
        </div>
    ),
}));

jest.mock(
    'components/Skeletons/SectionItemSkeleton/SectionItemSkeleton',
    () => ({
        SectionItemSkeleton: () => <div data-testid="skeleton">Loading...</div>,
    })
);

jest.mock(
    '../../../../components/ErrorBoundaryFallback/ErrorBoundaryFallback',
    () => ({
        ErrorBoundaryFallback: () => (
            <div data-testid="error-fallback">Error Loading</div>
        ),
    })
);

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) =>
            ({
                'pages.home.suggestedPeople.title': 'Suggested people',
            })[key] || key,
    }),
}));

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

describe('SuggestedPeopleSection', () => {
    const mockUsers: SuggestedPeople[] = [
        {
            id: 1,
            firstName: 'Helena',
            secondName: 'Hills',
            username: 'helenahills',
            description: '',
            photo: 'photo1.jpg',
        },
        {
            id: 2,
            firstName: 'John',
            secondName: 'Doe',
            username: 'johndoe',
            description: '',
            photo: 'photo2.jpg',
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        queryClient.clear();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders heading correctly', () => {
        render(<SuggestedPeopleSection />, { wrapper });
        expect(screen.getByText('Suggested people')).toBeInTheDocument();
    });

    test('shows loading skeletons initially', () => {
        (profileApi.getSuggestedUsers as jest.Mock).mockReturnValue(
            new Promise(() => {})
        );

        render(<SuggestedPeopleSection />, { wrapper });

        expect(screen.getAllByTestId('skeleton')).toHaveLength(4);
    });

    test('shows people correctly', async () => {
        (profileApi.getSuggestedUsers as jest.Mock).mockResolvedValue({
            data: mockUsers,
        });

        render(<SuggestedPeopleSection />, { wrapper });

        await waitFor(() => {
            expect(screen.getByText('Helena Hills')).toBeInTheDocument();
        });

        expect(screen.getByText('Helena Hills')).toBeInTheDocument();
        expect(screen.getByText('@helenahills')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('@johndoe')).toBeInTheDocument();
    });

    test('shows empty state when no users', async () => {
        (profileApi.getSuggestedUsers as jest.Mock).mockResolvedValue({
            data: [],
        });

        render(<SuggestedPeopleSection />, { wrapper });

        await waitFor(() => {
            expect(
                screen.queryByTestId('section-item')
            ).not.toBeInTheDocument();
        });
    });

    test('shows error fallback when API fails', async () => {
        const error = new Error('Failed to fetch');
        (profileApi.getSuggestedUsers as jest.Mock).mockRejectedValue(error);

        render(<SuggestedPeopleSection />, { wrapper });

        await waitFor(() => {
            expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
        });
    });

    test('calls API once', async () => {
        (profileApi.getSuggestedUsers as jest.Mock).mockResolvedValue({
            data: mockUsers,
        });

        render(<SuggestedPeopleSection />, { wrapper });

        await waitFor(() => {
            expect(screen.getByText('Helena Hills')).toBeInTheDocument();
        });

        expect(profileApi.getSuggestedUsers).toHaveBeenCalledTimes(1);
    });

    test('removes skeletons after data loads', async () => {
        (profileApi.getSuggestedUsers as jest.Mock).mockResolvedValue({
            data: mockUsers,
        });

        render(<SuggestedPeopleSection />, { wrapper });

        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Helena Hills')).toBeInTheDocument();
    });

    test('handles user with empty secondName', async () => {
        const userWithEmptySecondName: SuggestedPeople = {
            id: 3,
            firstName: 'Jane',
            secondName: '',
            username: 'jane',
            description: '',
            photo: '',
        };

        (profileApi.getSuggestedUsers as jest.Mock).mockResolvedValue({
            data: [userWithEmptySecondName],
        });

        render(<SuggestedPeopleSection />, { wrapper });

        await waitFor(() => {
            expect(screen.getByTestId('section-title')).toHaveTextContent(
                'Jane'
            );
        });

        expect(screen.getByText('@jane')).toBeInTheDocument();
    });

    test('caches data and prevents duplicate requests', async () => {
        (profileApi.getSuggestedUsers as jest.Mock).mockResolvedValue({
            data: mockUsers,
        });

        const { rerender } = render(<SuggestedPeopleSection />, { wrapper });

        await waitFor(() => {
            expect(screen.getByText('Helena Hills')).toBeInTheDocument();
        });

        expect(profileApi.getSuggestedUsers).toHaveBeenCalledTimes(1);

        rerender(<SuggestedPeopleSection />);

        expect(profileApi.getSuggestedUsers).toHaveBeenCalledTimes(1);
    });

    test('renders with correct HTML structure', () => {
        render(<SuggestedPeopleSection />, { wrapper });

        expect(document.querySelector('aside')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
        expect(document.querySelector('.aside-list')).toBeInTheDocument();
    });
});
