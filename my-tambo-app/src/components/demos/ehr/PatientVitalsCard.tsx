'use client';

import React from 'react';
import { Activity, Heart, Thermometer, Wind } from 'lucide-react';
import { useHealthcare } from '@/contexts/HealthcareContext';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { withInteractable } from '@tambo-ai/react';

// Define Schema Here
export const patientVitalsSchema = z.object({
    heartRate: z.union([z.number(), z.string()]).optional().describe("Patient's heart rate in BPM"),
    bloodPressure: z.string().optional().describe("Patient's blood pressure (e.g., '120/80')"),
    temperature: z.union([z.number(), z.string()]).optional().describe("Patient's body temperature in Fahrenheit"),
    oxygenSat: z.union([z.number(), z.string()]).optional().describe("Patient's oxygen saturation percentage"),
});

type VitalsProps = z.infer<typeof patientVitalsSchema>;

interface VitalMetricProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    unit: string;
    isAbnormal?: boolean;
    colorClass?: string;
}

const VitalMetric = ({ icon: Icon, label, value, unit, isAbnormal, colorClass = "text-blue-500" }: VitalMetricProps) => (
    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
        <div className={cn("p-2 rounded-full bg-white shadow-sm", colorClass)}>
            <Icon size={20} />
        </div>
        <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
            <div className="flex items-baseline space-x-1">
                <span className={cn("text-xl font-bold", isAbnormal ? "text-red-500" : "text-slate-900")}>
                    {value || "--"}
                </span>
                <span className="text-xs text-slate-400">{unit}</span>
            </div>
        </div>
    </div>
);

export const PatientVitalsCardBase = () => {
    const { vitalsHistory } = useHealthcare();

    // Helper to get latest value for a type
    const getLatest = (type: string) => {
        const entries = vitalsHistory.filter(v => v.type === type);
        if (entries.length === 0) return null;
        // Sort descending by date
        return entries.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())[0];
    };

    const hr = getLatest('heart_rate');
    const bp = getLatest('blood_pressure');
    const temp = getLatest('temperature');
    const o2 = getLatest('oxygen_sat');

    // Values for display
    const heartRate = hr ? hr.value : undefined;
    const bloodPressure = bp ? (bp.meta || bp.value.toString()) : undefined; // Use meta for BP string if available
    const temperature = temp ? temp.value : undefined;
    const oxygenSat = o2 ? o2.value : undefined;
    // Simple logic for "abnormal" values for demo purposes
    const isTempHigh = temperature ? Number(temperature) > 99.5 : false;

    // Parse BP if string
    let isBPHigh = false;
    if (typeof bloodPressure === 'string' && bloodPressure.includes('/')) {
        const [sys] = bloodPressure.split('/').map(Number);
        if (sys > 140) isBPHigh = true;
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full shadow-sm text-red-500">
                        <Heart className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Heart Rate</div>
                        <div className="text-xl font-bold text-slate-900">71 <span className="text-sm font-medium text-slate-400">bpm</span></div>
                    </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full shadow-sm text-blue-500">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Blood Pressure</div>
                        <div className="text-xl font-bold text-slate-900">120/80 <span className="text-sm font-medium text-slate-400">mmHg</span></div>
                    </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full shadow-sm text-orange-500">
                        <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Temperature</div>
                        <div className="text-xl font-bold text-slate-900">-- <span className="text-sm font-medium text-slate-400">°F</span></div>
                    </div>
                </div>

                <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full shadow-sm text-sky-500">
                        <Wind className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">O2 Saturation</div>
                        <div className="text-xl font-bold text-slate-900">-- <span className="text-sm font-medium text-slate-400">%</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PatientVitalsCard = withInteractable(PatientVitalsCardBase, {
    componentName: "PatientVitalsCard",
    description: "Display the patient's vital signs including heart rate, blood pressure, temperature, and oxygen saturation.",
    propsSchema: patientVitalsSchema
});
