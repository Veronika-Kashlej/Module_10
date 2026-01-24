import { act, render, screen } from '@testing-library/react';
import { SuggestedPeopleSection } from './SuggestedPeopleSection';
import { profileApi } from '@/utils/api/api';

let consoleErrorSpy: jest.SpyInstance;

jest.mock('store/api/api', () => {
    const mockProfileApi = {
        getSuggestedUsers: jest.fn(),
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
    (profileApi.getSuggestedUsers as jest.Mock).mockResolvedValue({ data: [] });
});

afterEach(() => {
    consoleErrorSpy.mockRestore();
});

test('renders heading correctly', () => {
    render(<SuggestedPeopleSection />);
    expect(screen.getByText('Suggested people')).toBeInTheDocument();
});

test('shows loading skeletons initially', () => {
    (profileApi.getSuggestedUsers as jest.Mock).mockResolvedValue({ data: [] });
    render(<SuggestedPeopleSection />);
    const skeletons = document.querySelectorAll('.section-item.skeleton');
    expect(skeletons).toHaveLength(4);
});

test('shows people correctly', async () => {
    const mockData = {
        data: [
            {
                id: 1,
                firstName: 'Helena',
                secondName: 'Hills',
                username: 'helenahills',
                description: '',
                photo: '',
            },
        ],
    };
    (profileApi.getSuggestedUsers as jest.Mock).mockResolvedValue(mockData);

    await act(async () => {
        render(<SuggestedPeopleSection />);
    });

    expect(await screen.findByText('Helena Hills')).toBeInTheDocument();
    expect(await screen.findByText('@helenahills')).toBeInTheDocument();
});
