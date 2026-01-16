import { act, render, screen, waitFor } from '@testing-library/react';
import { CommunitiesSection } from './CommunitiesSection';
import { profileApi } from '../../../../store/api/api';

let consoleErrorSpy: jest.SpyInstance;

jest.mock('store/api/api', () => {
    const mockProfileApi = {
        getCommunities: jest.fn(),
    };

    return {
        profileApi: mockProfileApi,
    };
});

beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
});

afterEach(() => {
    consoleErrorSpy.mockRestore();
});

test('renders heading correctly', () => {
    render(<CommunitiesSection />);
    expect(screen.getByText('Communities you might like')).toBeInTheDocument();
});

test('shows loading skeletons initially', () => {
    (profileApi.getCommunities as jest.Mock).mockResolvedValue([]);
    render(<CommunitiesSection />);
    const skeletons = document.querySelectorAll('.section-item.skeleton');
    expect(skeletons).toHaveLength(3);
});

it('should render communities', async () => {
    (profileApi.getCommunities as jest.Mock).mockResolvedValue({
        data: [
            { id: 1, title: 'Community 1', membersCount: '1000' },
            { id: 2, title: 'Community 2', membersCount: '35' },
        ],
    });

    await act(async () => {
        render(<CommunitiesSection />);
    });

    await waitFor(() => {
        expect(screen.getByText('Community 1')).toBeInTheDocument();
        expect(screen.getByText('Community 2')).toBeInTheDocument();
    });
});
