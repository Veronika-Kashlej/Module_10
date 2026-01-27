import { memo, useMemo } from 'react';
import { SuggestedPeople } from '../../../../store/types';
import { SectionItemSkeleton } from 'components/Skeletons/SectionItemSkeleton/SectionItemSkeleton';
import { SectionItem } from 'components/SectionItem/SectionItem';
import { profileApi } from '../../../../utils/api/api';
import { useQuery } from '@tanstack/react-query';
import { ErrorBoundaryFallback } from '../../../../components/ErrorBoundaryFallback/ErrorBoundaryFallback';
import { useTranslation } from 'react-i18next';

interface UserItemProps {
    user: SuggestedPeople;
}

const SuggestedUserItem = function ({ user }: UserItemProps) {
    const title = `${user.firstName} ${user.secondName}`;
    const subtitle = `@${user.username}`;

    return <SectionItem title={title} subtitle={subtitle} image={user.photo} />;
};

export const SuggestedPeopleSection = memo(function SuggestedPeopleSection() {
    const {
        data: suggestedUsers,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['suggestedUsers'],
        queryFn: profileApi.getSuggestedUsers,
        select: (response) => response.data,
        staleTime: 2 * 60 * 1000,
    });
    const { t } = useTranslation();

    const userList = useMemo(() => {
        if (isLoading) {
            return Array.from({ length: 4 }).map((_, index) => (
                <SectionItemSkeleton key={`skeleton-${index}`} />
            ));
        }

        if (isError) {
            console.error('Fetching users error:', error);
            return <ErrorBoundaryFallback />;
        }

        return (
            suggestedUsers?.map((user: SuggestedPeople, index: number) => (
                <SuggestedUserItem user={user} key={`${user.id}-${index}`} />
            )) || []
        );
    }, [isLoading, isError, error, suggestedUsers]);

    return (
        <>
            <aside>
                <h2>{t('pages.home.suggestedPeople.title')}</h2>
                <div className="aside-list">{userList}</div>
            </aside>
        </>
    );
});
