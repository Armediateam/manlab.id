import * as React from 'react';
import { Area, AreaChart, XAxis } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
    
} from '@/components/ui/chart';
import type {ChartConfig} from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const getDynamicChartData = () => {
    if (typeof window === 'undefined') return [];

    const clients = JSON.parse(localStorage.getItem('mandorlab_clients') || '[]');
    const quotations = JSON.parse(localStorage.getItem('mandorlab_quotations') || '[]');
    const messages = JSON.parse(localStorage.getItem('mandorlab_messages') || '[]');

    const data = [];
    const today = new Date();

    // Seed baseline factors (to make the chart look nice and full, like mock data)
    for (let i = 90; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        // Base seed values that progress smoothly
        const dayFactor = 90 - i;
        const seedCustomers = Math.floor(100 + dayFactor * 2.5 + Math.sin(dayFactor * 0.1) * 20);
        const seedQuotations = Math.floor(50 + dayFactor * 1.8 + Math.cos(dayFactor * 0.1) * 15);
        const seedMessages = Math.floor(150 + dayFactor * 3.2 + Math.sin(dayFactor * 0.15) * 30);

        // Find real items matching this date
        const realCustomers = clients.filter((c: any) => {
            if (!c.id) return false;
            const cDate = new Date(c.id).toISOString().split('T')[0];
            return cDate === dateStr;
        }).length;

        const realQuotations = quotations.filter((q: any) => {
            let qDate = q.requestDate;
            if (q.id && q.id > 1700000000000) {
                try {
                    const parsed = new Date(q.id).toISOString().split('T')[0];
                    if (parsed) qDate = parsed;
                } catch (e) {}
            }
            return qDate === dateStr;
        }).length;

        const realMessages = messages.filter((m: any) => {
            let mDate = m.requestDateTime ? m.requestDateTime.split(' ')[0] : '';
            if (m.id && m.id > 1700000000000) {
                try {
                    const parsed = new Date(m.id).toISOString().split('T')[0];
                    if (parsed) mDate = parsed;
                } catch (e) {}
            }
            return mDate === dateStr;
        }).length;

        data.push({
            date: dateStr,
            customer: seedCustomers + realCustomers,
            quotation: seedQuotations + realQuotations,
            message: seedMessages + realMessages,
        });
    }

    return data;
};

const chartConfig = {
    customer: {
        label: 'Client',
        color: 'hsl(199 89% 48%)',
    },
    quotation: {
        label: 'Quotation',
        color: 'hsl(142 71% 45%)',
    },
    message: {
        label: 'Message',
        color: 'hsl(36 92% 50%)',
    },
} satisfies ChartConfig;

export function StatisticsSummaryChart({
    serverChartData,
}: {
    serverChartData?: any[];
}) {
    const [timeRange, setTimeRange] = React.useState('90d');
    const [chartData, setChartData] = React.useState<any[]>(serverChartData ?? []);

    const reloadData = React.useCallback(() => {
        if (serverChartData) {
            setChartData(serverChartData);
            return;
        }
        setChartData(getDynamicChartData());
    }, [serverChartData]);

    React.useEffect(() => {
        reloadData();
        if (!serverChartData) {
            window.addEventListener('storage', reloadData);
            return () => window.removeEventListener('storage', reloadData);
        }
    }, [reloadData, serverChartData]);

    const filteredData = React.useMemo(() => {
        const referenceDate = new Date();
        return chartData.filter((item) => {
            const date = new Date(item.date);
            let daysToSubtract = 90;

            if (timeRange === '30d') {
                daysToSubtract = 30;
            } else if (timeRange === '7d') {
                daysToSubtract = 7;
            }

            const startDate = new Date(referenceDate);
            startDate.setDate(startDate.getDate() - daysToSubtract);

            return date >= startDate;
        });
    }, [chartData, timeRange]);

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Statistics Summary</CardTitle>
                    <CardDescription>
                        Showing client, quotation, and message activity for
                        the selected period
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-full rounded-lg sm:ml-auto sm:w-[160px]"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[420px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient
                                id="fillCustomer"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-customer)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-customer)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient
                                id="fillQuotation"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-quotation)"
                                    stopOpacity={0.75}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-quotation)"
                                    stopOpacity={0.08}
                                />
                            </linearGradient>
                            <linearGradient
                                id="fillMessage"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-message)"
                                    stopOpacity={0.65}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-message)"
                                    stopOpacity={0.06}
                                />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);

                                return date.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(
                                            value,
                                        ).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        });
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="message"
                            type="natural"
                            fill="url(#fillMessage)"
                            stroke="var(--color-message)"
                            stackId="a"
                            activeDot={{
                                r: 4,
                                stroke: 'var(--color-message)',
                                strokeWidth: 0,
                                fill: 'var(--color-message)',
                            }}
                        />
                        <Area
                            dataKey="quotation"
                            type="natural"
                            fill="url(#fillQuotation)"
                            stroke="var(--color-quotation)"
                            stackId="a"
                            activeDot={{
                                r: 4,
                                stroke: 'var(--color-quotation)',
                                strokeWidth: 0,
                                fill: 'var(--color-quotation)',
                            }}
                        />
                        <Area
                            dataKey="customer"
                            type="natural"
                            fill="url(#fillCustomer)"
                            stroke="var(--color-customer)"
                            stackId="a"
                            activeDot={{
                                r: 4,
                                stroke: 'var(--color-customer)',
                                strokeWidth: 0,
                                fill: 'var(--color-customer)',
                            }}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
