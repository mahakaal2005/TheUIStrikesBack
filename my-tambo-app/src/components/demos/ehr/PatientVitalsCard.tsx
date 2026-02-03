'use client';

import React from 'react';
import { Activity, Heart, Thermometer, Wind } from 'lucide-react';
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

export const PatientVitalsCardBase = ({
    heartRate,
    bloodPressure,
    temperature,
    oxygenSat
}: VitalsProps) => {
    // Simple logic for "abnormal" values for demo purposes
    const isTempHigh = temperature ? Number(temperature) > 99.5 : false;

    // Parse BP if string
    let isBPHigh = false;
    if (typeof bloodPressure === 'string' && bloodPressure.includes('/')) {
        const [sys] = bloodPressure.split('/').map(Number);
        if (sys > 140) isBPHigh = true;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
                <Activity className="text-blue-600" size={24} />
                <h2 className="text-lg font-semibold text-slate-800">Live Vitals Monitor</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <VitalMetric
                    icon={Heart}
                    label="Heart Rate"
                    value={heartRate || "--"}
                    unit="bpm"
                    colorClass="text-rose-500"
                />
                <VitalMetric
                    icon={Activity}
                    label="Blood Pressure"
                    value={bloodPressure || "--/--"}
                    unit="mmHg"
                    isAbnormal={isBPHigh}
                    colorClass="text-indigo-500"
                />
                <VitalMetric
                    icon={Thermometer}
                    label="Temperature"
                    value={temperature || "--"}
                    unit="°F"
                    isAbnormal={isTempHigh}
                    colorClass="text-orange-500"
                />
                <VitalMetric
                    icon={Wind}
                    label="O2 Saturation"
                    value={oxygenSat || "--"}
                    unit="%"
                    colorClass="text-sky-500"
                />
            </div>
        </div>
    );
};

export const PatientVitalsCard = withInteractable(PatientVitalsCardBase, {
    componentName: "PatientVitalsCard",
    description: "Display the patient's vital signs including heart rate, blood pressure, temperature, and oxygen saturation.",
    propsSchema: patientVitalsSchema
});
