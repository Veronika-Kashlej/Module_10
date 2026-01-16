import React from 'react';
import { SectionItem } from '../../../../components/SectionItem/SectionItem';
import { profileApi } from '../../../../store/api/api';
import { Community } from '../../../../store/types';
import { SectionItemSkeleton } from 'components/Skeletons/SectionItemSkeleton/SectionItemSkeleton';
import { formatMembersCount } from 'store/utils/formatMembersCount';

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

    render() {
        return (
            <aside aria-label="communities">
                <h2>Communities you might like</h2>
                <div className="section-list">
                    {this.state.isLoading
                        ? Array.from({ length: 3 }).map((_, index) => (
                              <SectionItemSkeleton key={`skeleton-${index}`} />
                          ))
                        : this.state.communities.map((community) => (
                              <SectionItem
                                  key={community.id}
                                  title={community.title}
                                  subtitle={formatMembersCount(
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
