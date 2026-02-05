"use client";

import React, { useState } from 'react';
import { useHealthcare, LabOrder } from '@/contexts/HealthcareContext';
import { Beaker, CheckCircle, Clock, ClipboardList } from 'lucide-react';

export default function LabPage() {
    const { labOrders, updateLabOrder } = useHealthcare();
    const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
    const [resultValue, setResultValue] = useState('');

    const [isMounted, setIsMounted] = useState(false);
    React.useEffect(() => { setIsMounted(true); }, []);

    const orders = labOrders || [];
    const pendingOrders = orders.filter(o => o.status === 'ordered');
    const completedOrders = orders.filter(o => o.status === 'completed');

    const handleCompleteOrder = (order: LabOrder) => {
        updateLabOrder(order.id, {
            status: 'completed',
            completedAt: new Date(),
            results: [{
                parameter: 'Result', // Simplified for demo
                value: resultValue || 'Normal',
                unit: 'N/A',
                range: 'N/A'
            }]
        });
        setSelectedOrder(null);
        setResultValue('');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-[family-name:var(--font-geist-sans)]">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <Beaker className="w-8 h-8 text-indigo-600" />
                            Lab Technician Portal
                        </h1>
                        <p className="text-slate-500 mt-2">Manage test requests and enter results.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Order Queue */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Pending Orders */}
                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-500" />
                                Pending Orders
                            </h2>
                            {pendingOrders.length === 0 ? (
                                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400">
                                    No pending lab orders.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingOrders.map(order => (
                                        <div key={order.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-900">{order.testName}</h3>
                                                    <p className="text-slate-500 text-sm">Patient ID: {order.patientId}</p>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        Ordered: {isMounted ? new Date(order.orderedAt).toLocaleTimeString() : ''}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                                >
                                                    Process
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Completed Orders History */}
                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Completed History
                            </h2>
                            <div className="space-y-4 opacity-75">
                                {completedOrders.map(order => (
                                    <div key={order.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-medium text-slate-900">{order.testName}</h3>
                                            <p className="text-sm text-slate-500">Result: {order.results?.[0]?.value}</p>
                                        </div>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                            Completed
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Action Panel */}
                    <div className="lg:col-span-1">
                        {selectedOrder ? (
                            <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-lg sticky top-8">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">
                                    Enter Results
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Test
                                        </label>
                                        <div className="text-slate-900 font-medium">{selectedOrder.testName}</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Result Value
                                        </label>
                                        <input
                                            autoFocus
                                            type="text"
                                            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="e.g. Positive, 140 mg/dL..."
                                            value={resultValue}
                                            onChange={(e) => setResultValue(e.target.value)}
                                        />
                                    </div>
                                    <div className="pt-4 flex gap-3">
                                        <button
                                            onClick={() => setSelectedOrder(null)}
                                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleCompleteOrder(selectedOrder)}
                                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm"
                                        >
                                            Submit Results
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-100 p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-400">
                                <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Select a pending order to input results.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
