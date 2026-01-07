import { useEffect, useState } from 'react';
import { profileApi } from '../../../../../../store/api';
import { CardStatistics } from './components/CardStatistics';
import './CardStatisticsList.css';
import { StatisticsCard } from '../../../../../../store/types';

export function CardStatisticsList() {
    const [statistics, setStatistics] = useState<StatisticsCard[]>([]);
    useEffect(() => {
        const fetchAllStatistics = async () => {
            try {
                const [postsResponse, likesResponse, commentsResponse] =
                    await Promise.all([
                        profileApi.getPosts(),
                        profileApi.getLikes(),
                        profileApi.getComments(),
                    ]);

                const formattedStats: StatisticsCard[] = [
                    {
                        title: 'Posts',
                        count: postsResponse.data?.length || 0,
                        progress: '+5% from last month',
                    },
                    {
                        title: 'Likes',
                        count: likesResponse.data?.length || 0,
                        progress: '+12% from last month',
                    },
                    {
                        title: 'Comments',
                        count: commentsResponse.data?.length || 0,
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
