import './CardStatisticsList.css';
import { StatisticsCard } from '@/store/types';
import { profileApi } from '../../../../utils/api/api';
import { useQueries } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const results = useQueries({
        queries: [
            {
                queryKey: ['posts'],
                queryFn: profileApi.getPosts,
            },
            {
                queryKey: ['likes'],
                queryFn: profileApi.getLikes,
            },
            {
                queryKey: ['comments'],
                queryFn: profileApi.getComments,
            },
        ],
    });

    const statistics: StatisticsCard[] = [
        {
            title: t('pages.statistics.titles.posts'),
            count: results[0].data?.data?.length || 0,
            progress: `+5% ${t('pages.statistics.progress')}`,
        },
        {
            title: t('pages.statistics.titles.likes'),
            count: results[1].data?.data?.length || 0,
            progress: `+12% ${t('pages.statistics.progress')}`,
        },
        {
            title: t('pages.statistics.titles.comments'),
            count: results[2].data?.data?.length || 0,
            progress: `+8% ${t('pages.statistics.progress')}`,
        },
    ];

    return (
        <section className="cards-statistics-list">
            {statistics.map((item, index) => (
                <CardStatistics
                    key={index}
                    title={item.title}
                    count={item.count}
                    progress={item.progress}
                />
            ))}
        </section>
    );
}
