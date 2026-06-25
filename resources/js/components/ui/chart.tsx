import * as React from 'react';
import {
    Legend as RechartsLegend,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
} from 'recharts';
import { cn } from '@/lib/utils';

export type ChartConfig = Record<
    string,
    {
        label?: string;
        color?: string;
    }
>;

const ChartContext = React.createContext<ChartConfig | null>(null);

function useChart() {
    const context = React.useContext(ChartContext);

    if (!context) {
        throw new Error('Chart components must be used within ChartContainer.');
    }

    return context;
}

function ChartContainer({
    id,
    className,
    children,
    config,
}: React.ComponentProps<'div'> & {
    config: ChartConfig;
}) {
    const style = Object.fromEntries(
        Object.entries(config)
            .filter(([, value]) => value.color)
            .map(([key, value]) => [`--color-${key}`, value.color as string]),
    ) as React.CSSProperties;

    return (
        <ChartContext.Provider value={config}>
            <div
                data-slot="chart"
                data-chart={id ?? 'chart'}
                className={cn('flex aspect-video justify-center text-xs', className)}
                style={style}
            >
                <ResponsiveContainer width="100%" height="100%">
                    {children as React.ReactElement}
                </ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    );
}

const ChartTooltip = RechartsTooltip;
const ChartLegend = RechartsLegend;

type ChartTooltipPayloadItem = {
    color?: string;
    dataKey?: string | number;
    name?: string;
    value?: number | string;
};

type ChartTooltipContentProps = React.ComponentProps<'div'> & {
    active?: boolean;
    payload?: ChartTooltipPayloadItem[];
    label?: string | number;
    labelFormatter?: (value: string | number) => React.ReactNode;
    indicator?: 'dot' | 'line';
};

function ChartTooltipContent({
    active,
    payload,
    label,
    className,
    labelFormatter,
    indicator = 'dot',
}: ChartTooltipContentProps) {
    const config = useChart();

    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div
            className={cn(
                'min-w-[180px] rounded-xl border bg-background/95 px-3 py-2 text-sm shadow-xl backdrop-blur',
                className,
            )}
        >
            <div className="mb-2 font-medium">
                {labelFormatter ? labelFormatter(label ?? '') : label}
            </div>
            <div className="space-y-1.5">
                {payload.map((item) => {
                    const itemConfig = config[item.dataKey as string];

                    return (
                        <div
                            key={item.dataKey}
                            className="flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className={cn(
                                        indicator === 'dot'
                                            ? 'size-2 rounded-full'
                                            : 'h-0.5 w-3',
                                    )}
                                    style={{
                                        backgroundColor: item.color,
                                    }}
                                />
                                <span className="text-muted-foreground">
                                    {itemConfig?.label ?? item.name}
                                </span>
                            </div>
                            <span className="font-medium tabular-nums">
                                {Number(item.value).toLocaleString('en-US')}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

type ChartLegendPayloadItem = {
    color?: string;
    dataKey?: string | number;
    value?: string;
};

function ChartLegendContent({
    className,
    payload,
}: React.ComponentProps<'div'> & {
    payload?: ChartLegendPayloadItem[];
}) {
    const config = useChart();

    if (!payload?.length) {
        return null;
    }

    return (
        <div
            className={cn(
                'flex flex-wrap items-center justify-center gap-4 pt-4 text-xs text-muted-foreground',
                className,
            )}
        >
            {payload.map((item) => {
                const itemConfig = config[item.dataKey as string];

                return (
                    <div
                        key={item.value}
                        className="flex items-center gap-2"
                    >
                        <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span>{itemConfig?.label ?? item.value}</span>
                    </div>
                );
            })}
        </div>
    );
}

export {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
};
