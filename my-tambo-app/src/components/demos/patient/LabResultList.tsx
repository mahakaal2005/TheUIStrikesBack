"use client";

import React from 'react';
import { Beaker } from 'lucide-react';
import { z } from 'zod';
import { useHealthcare } from '@/contexts/HealthcareContext';

export const labResultListSchema = z.object({});

export function LabResultList() {
    const { labOrders: results } = useHealthcare();

    if (results.length === 0) {
        return (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full max-w-md">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Beaker className="w-5 h-5 text-indigo-600" />
                    Lab Results
                </h3>
                <p className="text-slate-500 text-sm">No lab results available.</p>
            </div>
        )
    }

    // Sort orders by date (newest first)
    const sortedOrders = [...results].sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime());

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full max-w-md">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Beaker className="w-5 h-5 text-indigo-600" />
                Lab Results
            </h3>
            <div className="space-y-4">
                {sortedOrders.map((res, idx) => {
                    const result = res;
                    // Find previous order of SAME test name that is older than this one
                    const previousOrder = sortedOrders.slice(idx + 1).find(o => o.testName === result.testName && o.status === 'completed');

                    return (
                        <div key={result.id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <span className="font-medium text-slate-900 block">{result.testName}</span>
                                    <span className="text-[10px] text-slate-400">{new Date(result.orderedAt).toLocaleDateString()}</span>
                                </div>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${result.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {result.status}
                                </span>
                            </div>
                            {result.results && (
                                <div className="bg-slate-50 p-2 rounded text-sm space-y-2">
                                    {result.results.map((val: any, vIdx: number) => {
                                        // Find matching parameter in previous order
                                        const prevVal = previousOrder?.results?.find((p: any) => p.parameter === val.parameter);

                                        // Simple numeric trend detection
                                        let trend = null;
                                        if (prevVal) {
                                            const currNum = parseFloat(val.value);
                                            const prevNum = parseFloat(prevVal.value);
                                            if (!isNaN(currNum) && !isNaN(prevNum)) {
                                                if (currNum > prevNum) trend = 'up';
                                                if (currNum < prevNum) trend = 'down';
                                            }
                                        }

                                        return (
                                            <div key={vIdx} className="flex justify-between items-center">
                                                <span className="text-slate-500">{val.parameter}</span>
                                                <div className="text-right">
                                                    <div className="font-mono font-bold text-slate-800 flex items-center justify-end gap-1">
                                                        {val.value} {val.unit}
                                                        {trend === 'up' && <span className="text-red-500 text-xs">↗</span>}
                                                        {trend === 'down' && <span className="text-blue-500 text-xs">↘</span>}
                                                    </div>
                                                    {prevVal && (
                                                        <div className="text-[10px] text-slate-400">
                                                            Was {prevVal.value}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
