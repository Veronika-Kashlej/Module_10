import { useEffect, useState } from 'react';
import { SectionItem } from '../../../../components/SectionItem/SectionItem';
import { profileApi } from '../../../../store/api';
import { SuggestedPeople } from '../../../../store/types';
import { SectionItemSkeleton } from 'components/Skeletons/SectionItemSkeleton/SectionItemSkeleton';

export function SuggestedPeopleSection() {
    const [suggestedUsers, setSuggestedUsers] = useState<SuggestedPeople[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            setIsLoading(true);
            try {
                const response = await profileApi.getSuggestedUsers();
                setSuggestedUsers(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSuggestedUsers();
    }, []);
    return (
        <>
            <aside>
                <h2>Suggested people</h2>
                <div className="aside-list">
                    {isLoading && <SectionItemSkeleton />}
                    {isLoading && <SectionItemSkeleton />}
                    {isLoading && <SectionItemSkeleton />}
                    {isLoading && <SectionItemSkeleton />}
                    {suggestedUsers.map((user) => (
                        <SectionItem
                            key={user.id}
                            title={`${user.firstName} ${user.secondName}`}
                            subtitle={`@${user.username}`}
                            image={user.photo}
                        />
                    ))}
                </div>
            </aside>
        </>
    );
}
