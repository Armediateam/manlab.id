import { Head } from '@inertiajs/react';
import { DashboardStatCards } from '@/components/dashboard-stat-cards';
import { StatisticsSummaryChart } from '@/components/statistics-summary-chart';
import { dashboard } from '@/routes';

interface DashboardProps {
    stats?: {
        counts: {
            customers: number;
            quotations: number;
            messages: number;
            reviews: number;
        };
        trends: {
            customers: string;
            quotations: string;
            messages: string;
            reviews: string;
        };
    };
    chartData?: any[];
}

export default function Dashboard({ stats, chartData }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DashboardStatCards serverStats={stats} />
                <StatisticsSummaryChart serverChartData={chartData} />
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
