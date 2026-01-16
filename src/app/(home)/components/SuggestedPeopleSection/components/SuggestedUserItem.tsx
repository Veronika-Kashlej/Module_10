import { SectionItem } from 'components/SectionItem/SectionItem';
import { memo, useMemo } from 'react';
import { SuggestedPeople } from 'store/types';

interface UserItemProps {
    user: SuggestedPeople;
}

export const SuggestedUserItem = memo(function SuggestedUserItem({
    user,
}: UserItemProps) {
    const title = useMemo(
        () => `${user.firstName} ${user.secondName}`,
        [user.firstName, user.secondName]
    );

    const subtitle = useMemo(() => `@${user.username}`, [user.username]);

    return <SectionItem title={title} subtitle={subtitle} image={user.photo} />;
});
