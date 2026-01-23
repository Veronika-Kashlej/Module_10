import { useEffect, useState } from 'react';
import './CardStatisticsList.css';
import { StatisticsCard } from '@/store/types';
import { profileApi } from '../../../../utils/api/api';

export function CardStatistics({ title, count, progress }: StatisticsCard) {
    return (
        <div className="card-statistics">
            <p className="card-statistics-title">{title}</p>
            <p className="card-statistics-count">{count}</p>
            <p className="card-statistics-progress">{progress}</p>
        </div>
    );
}

export function CardStatisticsList() {
    const [statistics, setStatistics] = useState<StatisticsCard[]>([]);
    useEffect(() => {
        const fetchAllStatistics = async () => {
            try {
                const [postsResult, likesResult, commentsResult] =
                    await Promise.allSettled([
                        profileApi.getPosts(),
                        profileApi.getLikes(),
                        profileApi.getComments(),
                    ]);

                const formattedStats: StatisticsCard[] = [
                    {
                        title: 'Posts',
                        count:
                            postsResult.status === 'fulfilled'
                                ? postsResult.value.data?.length || 0
                                : 0,
                        progress: '+5% from last month',
                    },
                    {
                        title: 'Likes',
                        count:
                            likesResult.status === 'fulfilled'
                                ? likesResult.value.data?.length || 0
                                : 0,
                        progress: '+12% from last month',
                    },
                    {
                        title: 'Comments',
                        count:
                            commentsResult.status === 'fulfilled'
                                ? commentsResult.value.data?.length || 0
                                : 0,
                        progress: '+8% from last month',
                    },
                ];

                setStatistics(formattedStats);
            } catch (err) {
                console.error('Error fetching statistics:', err);
            }
        };

        fetchAllStatistics();
    }, []);
    return (
        <section className="cards-statistics-list">
            {statistics.map((item, index) => {
                return (
                    <CardStatistics
                        key={index}
                        title={item.title}
                        count={item.count}
                        progress={item.progress}
                    />
                );
            })}
        </section>
    );
}
