"use client";

import React, { useState } from 'react';
import { useHealthcare, LabOrder, LabResult } from '@/contexts/HealthcareContext';
import { DashboardWidget } from '@/components/ui/dashboard-widget';
import { Beaker, CheckCircle, Clock, ClipboardList, AlertTriangle, FileText, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';


// --- Configuration ---

interface TestParameterConfig {
    name: string;
    unit: string;
    min: number;
    max: number;
}

const LAB_TEST_DEFINITIONS: Record<string, TestParameterConfig[]> = {
    'Complete Blood Count (CBC)': [
        { name: 'WBC', unit: 'x10^3/uL', min: 4.5, max: 11.0 },
        { name: 'RBC', unit: 'x10^6/uL', min: 4.5, max: 5.9 },
        { name: 'Hemoglobin', unit: 'g/dL', min: 13.5, max: 17.5 },
        { name: 'Hematocrit', unit: '%', min: 41, max: 50 },
        { name: 'Platelets', unit: 'x10^3/uL', min: 150, max: 450 },
    ],
    'Basic Metabolic Panel (BMP)': [
        { name: 'Glucose', unit: 'mg/dL', min: 70, max: 99 },
        { name: 'Calcium', unit: 'mg/dL', min: 8.5, max: 10.2 },
        { name: 'Sodium', unit: 'mEq/L', min: 135, max: 145 },
        { name: 'Potassium', unit: 'mEq/L', min: 3.5, max: 5.0 },
    ],
    'Lipid Panel': [
        { name: 'Total Cholesterol', unit: 'mg/dL', min: 0, max: 200 },
        { name: 'HDL', unit: 'mg/dL', min: 40, max: 100 },
        { name: 'LDL', unit: 'mg/dL', min: 0, max: 100 },
        { name: 'Triglycerides', unit: 'mg/dL', min: 0, max: 150 },
    ],
};

const DEFAULT_PARAMETERS: TestParameterConfig[] = [
    { name: 'Result', unit: 'Value', min: 0, max: 100 }
];

export default function LabPage() {
    const { labOrders, updateLabOrder } = useHealthcare();
    const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);

    // State for multi-parameter results
    // Map of parameter name -> value string
    const [resultValues, setResultValues] = useState<Record<string, string>>({});

    const [isMounted, setIsMounted] = useState(false);
    React.useEffect(() => { setIsMounted(true); }, []);

    const orders = labOrders || [];
    const pendingOrders = orders.filter(o => o.status === 'ordered');
    const completedOrders = orders.filter(o => o.status === 'completed');

    // State for trends
    const [viewTrendId, setViewTrendId] = useState<string | null>(null);

    // Mock trend data generator
    const getTrendData = (testName: string) => {
        // Generate last 5 values floating around the mean
        const points = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - (i * 5)); // Every 5 days

            // Mock value based on test type
            let val = 0;
            if (testName.includes('CBC')) val = 14 + (Math.random() * 2 - 1); // Hemoglobin-ish
            else if (testName.includes('Metabolic')) val = 90 + (Math.random() * 10 - 5); // Glucose-ish
            else val = 50 + (Math.random() * 20); // Generic

            points.push({
                date: date.toLocaleDateString(),
                value: parseFloat(val.toFixed(1))
            });
        }
        return points;
    };


    // Reset form when order changes
    React.useEffect(() => {
        if (selectedOrder) {
            setResultValues({});
        }
    }, [selectedOrder]);

    const getParametersForTest = (testName: string) => {
        // Simple string matching for demo purposes
        const key = Object.keys(LAB_TEST_DEFINITIONS).find(k => testName.includes(k) || k.includes(testName));
        return key ? LAB_TEST_DEFINITIONS[key] : DEFAULT_PARAMETERS;
    };

    const handleResultChange = (paramName: string, value: string) => {
        setResultValues(prev => ({ ...prev, [paramName]: value }));
    };

    const handleCompleteOrder = (order: LabOrder) => {
        const params = getParametersForTest(order.testName);

        const results: LabResult[] = params.map(param => {
            const valStr = resultValues[param.name] || '0';
            const valNum = parseFloat(valStr);
            let flag: 'high' | 'low' | 'normal' = 'normal';

            if (!isNaN(valNum)) {
                if (valNum < param.min) flag = 'low';
                else if (valNum > param.max) flag = 'high';
            }

            return {
                parameter: param.name,
                value: valStr,
                unit: param.unit,
                range: `${param.min}-${param.max}`,
                flag: flag
            };
        });

        updateLabOrder(order.id, {
            status: 'completed',
            completedAt: new Date(),
            results: results
        });
        setSelectedOrder(null);
    };

    const getFlagColor = (flag?: 'high' | 'low' | 'normal') => {
        if (flag === 'high') return 'text-red-500 bg-red-50 border-red-100';
        if (flag === 'low') return 'text-blue-500 bg-blue-50 border-blue-100';
        return 'text-slate-700 bg-slate-50 border-slate-100';
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-[family-name:var(--font-geist-sans)]">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <header className="flex items-center justify-between pb-6 border-b border-slate-200">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
                                <Beaker className="w-8 h-8 text-white" />
                            </div>
                            Unknown Health Lab
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">Pathology & Diagnostics Portal</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-center">
                            <div className="text-2xl font-bold text-indigo-600">{pendingOrders.length}</div>
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pending</div>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-center">
                            <div className="text-2xl font-bold text-emerald-600">{completedOrders.length}</div>
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Completed</div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* LEFT COLUMN: Queues */}
                    <div className="lg:col-span-4 xl:col-span-3 space-y-6">

                        {/* Pending Orders Widget */}
                        <DashboardWidget title="Pending Orders" icon={Clock} defaultOpen={true}>
                            {pendingOrders.length === 0 ? (
                                <div className="p-8 text-center text-slate-400">
                                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                                    <p>All caught up!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingOrders.map(order => (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() => setSelectedOrder(order)}
                                            className={cn(
                                                "p-4 rounded-lg border cursor-pointer transition-all duration-200 group relative overflow-hidden",
                                                selectedOrder?.id === order.id
                                                    ? "bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-200"
                                                    : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-sm"
                                            )}
                                        >
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                                                        {order.testName}
                                                    </span>
                                                    <span className="text-[10px] font-bold tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                                        STAT
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 mb-2">Ref: #{order.id.slice(0, 6)}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Clock size={12} />
                                                    {new Date(order.orderedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            {selectedOrder?.id === order.id && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </DashboardWidget>

                        {/* Recent History Widget */}
                        <DashboardWidget title="Recent History" icon={ClipboardList}>
                            <div className="space-y-3 opacity-75">
                                {completedOrders.map(order => (
                                    <div key={order.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                                        <div className="font-medium text-slate-700">{order.testName}</div>
                                        <div className="flex justify-between items-end mt-1">
                                            <div>
                                                <span className="text-slate-500 text-xs block">#{order.id.slice(0, 6)}</span>
                                                <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium inline-flex items-center gap-1 mt-1">
                                                    <CheckCircle size={10} /> Done
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => { setSelectedOrder(null); setViewTrendId(order.id); }}
                                                className="text-[10px] text-indigo-600 font-bold hover:underline"
                                            >
                                                View Trend
                                            </button>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        </DashboardWidget>
                    </div>

                    {/* CENTER/RIGHT COLUMN: Work Area */}
                    <div className="lg:col-span-8 xl:col-span-9">
                        <AnimatePresence mode="wait">
                            {/* Trend View */}
                            {viewTrendId ? (
                                <motion.div
                                    key="trend-view"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="h-full"
                                >
                                    <DashboardWidget title="Analysis: Historical Trend" icon={Activity} className="min-h-[500px]">
                                        <div className="p-4 h-full flex flex-col">
                                            <div className="flex justify-between items-center mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-800">
                                                        {completedOrders.find(o => o.id === viewTrendId)?.testName || 'Unknown Test'}
                                                    </h3>
                                                    <p className="text-slate-500">Historical Tracking (Last 30 Days)</p>
                                                </div>
                                                <button
                                                    onClick={() => setViewTrendId(null)}
                                                    className="text-sm text-slate-500 hover:text-slate-800"
                                                >
                                                    Close
                                                </button>
                                            </div>

                                            <div className="flex-1 min-h-[300px] w-full bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={getTrendData(completedOrders.find(o => o.id === viewTrendId)?.testName || '')}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                                        <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                                        <Tooltip
                                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                        />
                                                        <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </DashboardWidget>
                                </motion.div>
                            ) : selectedOrder ? (
                                <motion.div
                                    key={selectedOrder.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="h-full"
                                >
                                    <DashboardWidget title={`Result Entry: ${selectedOrder.testName}`} icon={Activity} className="min-h-[500px]">

                                        {/* Patient Context Header */}
                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6 flex justify-between items-center">
                                            <div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Patient</div>
                                                <div className="font-bold text-lg text-slate-800">Alex Morgan (ID: #{selectedOrder.patientId})</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Order Time</div>
                                                <div className="text-slate-600 font-mono">
                                                    {new Date(selectedOrder.orderedAt).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dynamic Result Form */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                                            {getParametersForTest(selectedOrder.testName).map((param) => {
                                                const currentVal = parseFloat(resultValues[param.name] || '0');
                                                const isLow = currentVal > 0 && currentVal < param.min;
                                                const isHigh = currentVal > param.max;

                                                return (
                                                    <div key={param.name} className="relative">
                                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                            {param.name} <span className="text-slate-400 font-normal">({param.unit})</span>
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                step="0.1"
                                                                className={cn(
                                                                    "w-full border rounded-lg px-3 py-2.5 outline-none transition-all font-mono text-lg",
                                                                    isLow || isHigh
                                                                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                                                        : "border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                                                )}
                                                                placeholder={`${param.min} - ${param.max}`}
                                                                value={resultValues[param.name] || ''}
                                                                onChange={(e) => handleResultChange(param.name, e.target.value)}
                                                            />
                                                            {/* Range Indicator Badge */}
                                                            {(isLow || isHigh) && (
                                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-red-600 bg-white/50 px-2 py-0.5 rounded text-xs font-bold border border-red-100">
                                                                    <AlertTriangle size={12} />
                                                                    {isLow ? 'LOW' : 'HIGH'}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex justify-between mt-1.5 text-xs text-slate-400 px-1">
                                                            <span>Ref Range:</span>
                                                            <span className="font-mono">{param.min} - {param.max}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Action Bar */}
                                        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => setSelectedOrder(null)}
                                                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleCompleteOrder(selectedOrder)}
                                                className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                                            >
                                                <CheckCircle size={18} />
                                                Finalize & Release Results
                                            </button>
                                        </div>
                                    </DashboardWidget>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                        <FileText className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No Order Selected</h3>
                                    <p className="max-w-md mx-auto">Select a pending order from the queue on the left to begin entering result data.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
}

