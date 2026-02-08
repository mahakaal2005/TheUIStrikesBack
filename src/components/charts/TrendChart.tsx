"use client";

import React from 'react';

interface TrendDataPoint {
    date: string;
    value: number;
}

interface TrendChartProps {
    data: TrendDataPoint[];
}

export function TrendChart({ data }: TrendChartProps) {
    // Lazy load recharts only when this component renders
    const [Chart, setChart] = React.useState<React.ComponentType<any> | null>(null);

    React.useEffect(() => {
        import('recharts').then((mod) => {
            const { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } = mod;

            const ChartComponent = () => (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#4f46e5"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            );

            setChart(() => ChartComponent);
        });
    }, [data]);

    if (!Chart) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400 animate-pulse">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Loading chart...</span>
                </div>
            </div>
        );
    }

    return <Chart />;
}
