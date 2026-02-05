'use client';

import React from 'react';
import {
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Scatter
} from 'recharts';
import { useHealthcare, VitalEntry } from '@/contexts/HealthcareContext';
import { format } from 'date-fns';
import { Activity } from 'lucide-react';
import { withInteractable } from '@tambo-ai/react';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';

export const timelineSchema = z.object({
    timeframe: z.enum(['24h', '7d', '30d']).optional().describe("Time range to display"),
    highlightType: z.enum(['all', 'heart_rate', 'blood_pressure']).optional().describe("Metric to highlight")
});

type TimelineProps = z.infer<typeof timelineSchema>;

export const LivingTreatmentTimelineBase = ({ timeframe = '7d', highlightType = 'all' }: TimelineProps) => {
    const { vitalsHistory, prescriptions, labOrders, activeSymptoms } = useHealthcare();

    const data = React.useMemo(() => {
        const sorted = [...vitalsHistory].sort((a, b) =>
            new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
        );

        return sorted.map(v => ({
            date: new Date(v.recordedAt).getTime(),
            dateStr: new Date(v.recordedAt).toLocaleDateString(),
            type: v.type,
            value: v.value,
            meta: v.meta,
            heartRate: v.type === 'heart_rate' ? v.value : null,
            bpSystolic: v.type === 'blood_pressure' ? v.value : null,
        }));
    }, [vitalsHistory]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const p = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-lg text-xs">
                    <p className="font-bold text-slate-700 mb-1">{new Date(p.date).toLocaleString()}</p>
                    {p.heartRate && <p className="text-red-500 font-medium">❤️ HR: {p.heartRate} bpm</p>}
                    {p.bpSystolic && <p className="text-blue-500 font-medium">🩺 BP: {p.meta || p.bpSystolic}</p>}
                </div>
            );
        }
        return null;
    };

    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-lg animate-pulse">
                <Activity className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400 font-medium">Loading Timeline...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Treatment Timeline</h3>
                    <p className="text-sm text-slate-500">Living history of vitals & events</p>
                </div>
                <Badge variant="outline" className="bg-slate-50">7D VIEW</Badge>
            </div>

            <div className="h-64 w-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            type="number"
                            domain={['auto', 'auto']}
                            tickFormatter={(unix) => new Date(unix).toLocaleDateString(undefined, { weekday: 'short' })}
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            yAxisId="left"
                            domain={[40, 180]}
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                        {(highlightType === 'all' || highlightType === 'heart_rate') && (
                            <Line
                                yAxisId="left"
                                connectNulls
                                type="monotone"
                                dataKey="heartRate"
                                name="Heart Rate"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={{ fill: '#ef4444', r: 3, strokeWidth: 0 }}
                                activeDot={{ r: 6 }}
                            />
                        )}

                        {(highlightType === 'all' || highlightType === 'blood_pressure') && (
                            <Line
                                yAxisId="left"
                                connectNulls
                                type="monotone"
                                dataKey="bpSystolic"
                                name="Blood Pressure (Sys)"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }}
                                activeDot={{ r: 6 }}
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Event Legend / Summary */}
            <div className="mt-4 flex gap-4 border-t border-slate-100 pt-4 overflow-x-auto">
                {activeSymptoms.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Active Issues: {activeSymptoms.length}
                    </div>
                )}
                {prescriptions.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Meds Active: {prescriptions.length}
                    </div>
                )}
                {labOrders.some(l => l.status === 'ordered') && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        Labs Pending
                    </div>
                )}
            </div>
        </div>
    );
};

export const LivingTreatmentTimeline = withInteractable(LivingTreatmentTimelineBase, {
    componentName: "LivingTreatmentTimeline",
    description: "Visualizes the patient's vitals (heart rate, BP) over time along with medical events like prescriptions and lab results.",
    propsSchema: timelineSchema
});
