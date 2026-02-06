'use client';

import React from 'react';
import { PatientVitalsCard } from '@/components/demos/ehr/PatientVitalsCard';
import { BodyMapSelector } from '@/components/demos/ehr/BodyMapSelector';
import { PrescriptionPad } from '@/components/demos/ehr/PrescriptionPad';
import { LivingTreatmentTimeline } from '@/components/demos/ehr/LivingTreatmentTimeline';
import { DashboardWidget } from '@/components/ui/dashboard-widget';
import { Activity, GitGraph, User, FileText } from 'lucide-react';
import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { MedicalProvider } from "@/contexts/MedicalContext";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";

import { useHealthcare } from "@/contexts/HealthcareContext";

export default function EHRPage() {
    const mcpServers = useMcpServers();
    const { addLabOrder, activePatient } = useHealthcare();

    return (
        <TamboProvider
            apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
            components={components}
            tools={tools}
            tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
            mcpServers={mcpServers}
        >
            <MedicalProvider>
                <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden">

                    {/* Left: Chat/Transcript Log */}
                    <div className="w-full lg:w-1/3 h-[40vh] lg:h-full border-b lg:border-b-0 lg:border-r border-gray-200 bg-white flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex-none">
                            <h2 className="text-lg font-semibold text-gray-800">Transcript</h2>
                        </div>

                        <div className="flex-1 overflow-hidden relative">
                            {/* Using MessageThreadFull for the complete chat experience */}
                            <MessageThreadFull />
                        </div>
                    </div>

                    {/* Right: The "Patient Chart" (Generative UI Area) */}
                    <div className="w-full lg:w-2/3 h-[60vh] lg:h-full p-4 lg:p-8 overflow-y-auto">

                        <div className="max-w-screen-2xl mx-auto space-y-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">Patient Chart</h1>

                            {/* Components rendered here will be "live" if they are wrapped with withInteractable */}
                            {/* We are passing initial/default props, but Tambo should take over if it targets them */}

                            {/* Dashboard Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 auto-rows-[minmax(450px,auto)] w-full">
                                {/* 1. Vitals */}

                                <DashboardWidget title="Live Vitals Monitor" icon={Activity} className="h-full">
                                    <PatientVitalsCard />
                                </DashboardWidget>

                                {/* 2. Timeline */}
                                <DashboardWidget title="Treatment Timeline" icon={GitGraph}>
                                    <LivingTreatmentTimeline timeframe="7d" />
                                </DashboardWidget>

                                {/* 3. Symptom Map */}
                                <DashboardWidget title="Symptom Topology" icon={User}>
                                    <div className="flex justify-center h-full items-center">
                                        <BodyMapSelector highlightedRegions={[]} />
                                    </div>
                                </DashboardWidget>

                                {/* 4. Prescription Pad */}
                                <DashboardWidget title="Prescription Pad" icon={FileText}>
                                    <PrescriptionPad />
                                </DashboardWidget>
                            </div>

                            {/* Quick Navigation for Demo */}
                            <div className="pt-8 border-t border-slate-200 mt-8">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Ecosystem Quick Links</h3>
                                <div className="flex gap-4">
                                    <a href="/demos/patient" target="_blank" rel="noopener" className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">
                                        Open Patient Portal
                                    </a>
                                    <a href="/demos/lab" target="_blank" rel="noopener" className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200">
                                        Open Lab Portal
                                    </a>
                                    <a href="/demos/pharmacy" target="_blank" rel="noopener" className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200">
                                        Open Pharmacy Portal
                                    </a>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => addLabOrder({
                                            patientId: activePatient.id,
                                            testName: 'Complete Blood Count (CBC)',
                                            notes: 'Check for infection'
                                        })}
                                        className="text-xs text-slate-400 hover:text-slate-600 underline"
                                    >
                                        [Debug] Simulate: Order Blood Test
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MedicalProvider>
        </TamboProvider>
    );
}
