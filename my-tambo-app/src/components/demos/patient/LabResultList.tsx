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

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full max-w-md">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Beaker className="w-5 h-5 text-indigo-600" />
                Lab Results
            </h3>
            <div className="space-y-4">
                {results.map((res, idx) => (
                    <div key={idx} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-slate-900">{res.testName}</span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${res.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {res.status}
                            </span>
                        </div>
                        {res.results && (
                            <div className="bg-slate-50 p-2 rounded text-sm space-y-1">
                                {res.results.map((val: any, vIdx: number) => (
                                    <div key={vIdx} className="flex justify-between">
                                        <span className="text-slate-500">{val.parameter}</span>
                                        <span className="font-mono font-bold text-slate-800">{val.value} {val.unit}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
