import { SectionItem } from '../../../../components/SectionItem/SectionItem';
import { SectionItemSkeleton } from 'components/Skeletons/SectionItemSkeleton/SectionItemSkeleton';
import { formatMembersCount } from '../../../../utils/formatMembersCount';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { profileApi } from '../../../../utils/api/graphQL';
import { Community } from '../../../../store/types';

export function CommunitiesSection() {
    const { data: communities, isLoading } = useQuery({
        queryKey: ['communities'],
        queryFn: profileApi.getCommunities,
        select: (response) => response.data,
    });
    const { t } = useTranslation();

    return (
        <aside>
            <h2>{t('pages.home.communities.title')}</h2>
            <div className="section-list">
                {isLoading
                    ? Array.from({ length: 3 }).map((_, index) => (
                          <SectionItemSkeleton key={`skeleton-${index}`} />
                      ))
                    : communities?.map((community: Community) => (
                          <SectionItem
                              key={community.id}
                              title={community.title}
                              subtitle={formatMembersCount(
                                  community.membersCount
                              )}
                              image={community.photo || ''}
                          />
                      ))}
            </div>
        </aside>
    );
}
