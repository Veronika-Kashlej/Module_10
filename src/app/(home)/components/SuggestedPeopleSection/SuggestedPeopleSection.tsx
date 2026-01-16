import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { profileApi } from '../../../../store/api/api';
import { SuggestedPeople } from '../../../../store/types';
import { SectionItemSkeleton } from 'components/Skeletons/SectionItemSkeleton/SectionItemSkeleton';
import { SuggestedUserItem } from './components/SuggestedUserItem';

export const SuggestedPeopleSection = memo(function SuggestedPeopleSection() {
    const [suggestedUsers, setSuggestedUsers] = useState<SuggestedPeople[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSuggestedUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await profileApi.getSuggestedUsers();
            setSuggestedUsers(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSuggestedUsers();
    }, [fetchSuggestedUsers]);

    const userList = useMemo(() => {
        if (isLoading) {
            return Array.from({ length: 4 }).map((_, index) => (
                <SectionItemSkeleton key={`skeleton-${index}`} />
            ));
        }

        return suggestedUsers.map((user, index) => (
            <SuggestedUserItem user={user} key={index} />
        ));
    }, [isLoading, suggestedUsers]);

    return (
        <>
            <aside aria-label="suggested people">
                <h2>Suggested people</h2>
                <div className="aside-list">{userList}</div>
            </aside>
        </>
    );
});
