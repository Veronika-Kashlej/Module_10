export const formatMembersCount = (membersCount: number) => {
    if (membersCount >= 1_000_000) {
        return `${(membersCount / 1_000_000).toFixed(1).replace(/\.0$/, '')}m members`;
    }
    if (membersCount >= 1000) {
        return `${(membersCount / 1000).toFixed(1).replace(/\.0$/, '')}k members`;
    }
    return `${membersCount} members`;
};
