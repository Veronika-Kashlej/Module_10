import React from 'react';
import { SectionItem } from '../../../../components/SectionItem/SectionItem';
import { profileApi } from '../../../../store/api';
import { Community } from '../../../../store/types';
import { SectionItemSkeleton } from 'components/Skeletons/SectionItemSkeleton/SectionItemSkeleton';

type CommunitiesSectionState = {
    communities: Community[];
    isLoading: boolean;
};

export class CommunitiesSection extends React.Component {
    state: CommunitiesSectionState = {
        communities: [],
        isLoading: true,
    };

    componentDidMount() {
        this.fetchCommunities();
    }

    fetchCommunities = async () => {
        this.setState({ isLoading: true });
        try {
            const response = await profileApi.getCommunities();
            this.setState({ communities: response.data });
        } catch (err) {
            console.error(err);
        } finally {
            this.setState({ isLoading: false });
        }
    };

    formatMembersCount = (membersCount: number) => {
        if (membersCount >= 1_000_000) {
            return `${(membersCount / 1_000_000).toFixed(1).replace(/\.0$/, '')}m members`;
        }
        if (membersCount >= 1000) {
            return `${(membersCount / 1000).toFixed(1).replace(/\.0$/, '')}k members`;
        }
        return `${membersCount} members`;
    };

    render() {
        return (
            <aside>
                <h2>Communities you might like</h2>
                <div className="section-list">
                    {this.state.isLoading && <SectionItemSkeleton />}
                    {this.state.isLoading && <SectionItemSkeleton />}
                    {this.state.isLoading && <SectionItemSkeleton />}
                    {this.state.communities.map((community) => (
                        <SectionItem
                            key={community.id}
                            title={community.title}
                            subtitle={this.formatMembersCount(
                                community.membersCount
                            )}
                            image={community.photo}
                        />
                    ))}
                </div>
            </aside>
        );
    }
}
