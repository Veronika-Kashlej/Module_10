const GRAPHQL_URL = 'http://localhost:3000/graphql';

export interface GQLCommunity {
    id: string;
    title: string;
    membersCount: number;
    photo?: string;
}

interface GQLGetCommunitiesResponse {
    getCommunities: GQLCommunity[];
}

interface GraphQLResponse<T> {
    data: T;
    errors?: Array<{ message: string }>;
}

const GET_COMMUNITIES_QUERY = `
  query GetCommunities {
    getCommunities {
      id
      title
      membersCount
      photo
    }
  }
`;

const graphqlRequest = async <T>(
    query: string,
    variables?: Record<string, unknown>
): Promise<T> => {
    const token = localStorage.getItem('accessToken');

    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/sign-in';
            }
            throw new Error(
                `HTTP Error: ${response.status} ${response.statusText}`
            );
        }

        const result: GraphQLResponse<T> = await response.json();

        if (result.errors && result.errors.length > 0) {
            const errorMessages = result.errors
                .map((err) => err.message)
                .join(', ');
            throw new Error(`GraphQL Error: ${errorMessages}`);
        }

        return result.data;
    } catch (error) {
        console.error('GraphQL request failed:', error);
        throw error;
    }
};

export const profileApi = {
    getCommunities: async (): Promise<{ data: GQLCommunity[] }> => {
        const data = await graphqlRequest<GQLGetCommunitiesResponse>(
            GET_COMMUNITIES_QUERY
        );

        const communities: GQLCommunity[] = data.getCommunities.map(
            (community) => ({
                id: community.id,
                title: community.title,
                membersCount: community.membersCount,
                photo: community.photo || '',
            })
        );

        return { data: communities };
    },
};
