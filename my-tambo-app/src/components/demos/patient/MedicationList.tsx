"use client";

import React from 'react';
import { Pill } from 'lucide-react';
import { z } from 'zod';
import { useHealthcare } from '@/contexts/HealthcareContext';

export const medicationListSchema = z.object({});

export function MedicationList() {
    const { prescriptions: medications } = useHealthcare();

    if (medications.length === 0) {
        return (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full max-w-md">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Pill className="w-5 h-5 text-emerald-600" />
                    Current Medications
                </h3>
                <p className="text-slate-500 text-sm">No active prescriptions found.</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full max-w-md">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Pill className="w-5 h-5 text-emerald-600" />
                Current Medications
            </h3>
            <div className="space-y-3">
                {medications.map((med, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex justify-between items-start">
                            <div className="font-semibold text-slate-900">{med.medicationName}</div>
                            {med.status && (
                                <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    {med.status.replace(/_/g, ' ')}
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-slate-500">{med.dosage}</div>
                        <div className="text-xs text-slate-400 mt-1 italic">{med.instructions}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
