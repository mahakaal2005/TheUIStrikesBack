"use client";

import React from 'react';
import { TamboProvider } from "@tambo-ai/react";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { patientTools } from './tools';
import { MedicationList, medicationListSchema } from '@/components/demos/patient/MedicationList';
import { LabResultList, labResultListSchema } from '@/components/demos/patient/LabResultList';
import { BodyMapSelector, bodyMapSchema } from '@/components/demos/ehr/BodyMapSelector';
import { AdaptiveIntakeForm, adaptiveIntakeSchema } from '@/components/demos/patient/AdaptiveIntakeForm';
import { MedicalGuide, SymptomExplainer } from '@/components/demos/patient/EducationWidgets';
import { PatientVitalsCard } from '@/components/demos/ehr/PatientVitalsCard';
import { LivingTreatmentTimeline } from '@/components/demos/ehr/LivingTreatmentTimeline';
import { MedicalImageAnalyzer } from '@/components/demos/patient/MedicalImageAnalyzer';
import { DashboardWidget } from '@/components/ui/dashboard-widget';
import { FeatureDemoController } from '@/components/demos/patient/FeatureDemoController';
import { User, Activity, Calendar, GitGraph, ChevronDown, ChevronUp, LayoutGrid, BookOpen } from 'lucide-react';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

const patientComponents = [
    {
        name: "MedicationList",
        description: "Display a list of the patient's current medications.",
        component: MedicationList,
        propsSchema: medicationListSchema
    },
    {
        name: "LabResultList",
        description: "Display a list of the patient's lab results.",
        component: LabResultList,
        propsSchema: labResultListSchema
    },
    {
        name: "BodyMapSelector",
        description: "Show a body map to highlight patient symptoms or pain locations.",
        component: BodyMapSelector,
        propsSchema: bodyMapSchema
    },
    {
        name: "AdaptiveIntakeForm",
        description: "A dynamic container that renders specific intake widgets (Pain Scale, Breathing Counter, Image Upload) based on the patient's context.",
        component: AdaptiveIntakeForm,
        propsSchema: adaptiveIntakeSchema
    },
    {
        name: "MedicalGuide",
        description: "Display a step-by-step interactive medical guide or instruction set (e.g. 'How to use an inhaler', 'Preparation for X-ray').",
        component: MedicalGuide,
        propsSchema: z.object({
            topic: z.string().optional().describe("The topic of the guide (e.g. 'Using an Inhaler')"),
            difficulty: z.enum(['easy', 'medium', 'hard']).optional().describe("Complexity level"),
            steps: z.array(z.object({
                title: z.string().optional().describe("Title of the step"),
                description: z.string().optional().describe("Detailed instruction for this step"),
                image_prompt: z.string().optional().describe("A visual description of what this step looks like (for potential generation)")
            })).optional().describe("List of sequential steps")
        })
    },
    {
        name: "SymptomExplainer",
        description: "Educational card explaining a symptom, its causes, and biological context. Use when user asks 'Why does my head hurt?' or 'What is this rash?'.",
        component: SymptomExplainer,
        propsSchema: z.object({
            symptom: z.string().optional().describe("The name of the symptom"),
            severity: z.enum(['mild', 'moderate', 'severe', 'low', 'medium', 'high']).optional().describe("General severity assessment. Prefer mild/moderate/severe."),
            possible_causes: z.array(z.string()).optional().describe("List of 3-5 potential common causes"),
            biological_context: z.string().optional().describe("A simple, one-sentence explanation of the biological mechanism (e.g. 'Inflammation causes blood vessels to swell...')"),
            recommended_action: z.string().optional().describe("Immediate advice (e.g. 'Rest and hydrate', 'See a doctor')")
        })
    }
];



export default function GenerativePatientPage() {
    const mcpServers = useMcpServers();
    const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

    if (!apiKey) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <p className="text-red-600">Missing NEXT_PUBLIC_TAMBO_API_KEY environment variable.</p>
            </div>
        );
    }

    return (
        <TamboProvider
            apiKey={apiKey}
            components={patientComponents}
            tools={patientTools}
            tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
            mcpServers={mcpServers}
        >
            <div className="flex h-screen bg-slate-50 font-[family-name:var(--font-geist-sans)]">
                {/* Content Container */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Chat Column (Now includes Profile Header) */}
                    <div className="w-[450px] flex flex-col border-r border-indigo-100 bg-white shadow-2xl z-10 relative">
                        {/* Merged Header: Profile + Title */}
                        <div className="p-4 border-b border-indigo-50 bg-indigo-50/30 flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                                    AM
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-800 leading-tight">Alex Morgan</h2>
                                <p className="text-xs text-slate-500 font-medium">Patient ID: #84920</p>
                            </div>
                            <div className="ml-auto">
                                <span className="px-2 py-1 bg-white border border-indigo-100 rounded text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                                    Online
                                </span>
                            </div>
                        </div>

                        {/* Tips / Alerts Section (previously in sidebar) */}
                        <div className="px-4 pt-4 pb-2">
                            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-3">
                                <div className="p-1.5 bg-amber-100 rounded-full shrink-0 mt-0.5">
                                    <Activity className="w-3 h-3 text-amber-700" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-0.5">Health Tip</h4>
                                    <p className="text-xs text-amber-800 leading-relaxed">
                                        Your blood pressure is slightly elevated today. Remember to stay hydrated.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Chat Interface */}
                        <div className="flex-1 overflow-hidden relative flex flex-col">
                            <MessageThreadFull />
                        </div>
                    </div>

                    {/* Dashboard Grid Column (Right) */}
                    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
                        <div className="max-w-6xl mx-auto">
                            <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Activity className="w-6 h-6 text-indigo-600" />
                                Live Health Dashboard
                            </h1>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20 auto-rows-[minmax(400px,auto)]">
                                {/* 1. Vitals Monitor */}
                                <DashboardWidget title="Live Vitals Monitor" icon={Activity}>
                                    <PatientVitalsCard />
                                </DashboardWidget>

                                {/* 2. Treatment Timeline */}
                                <DashboardWidget title="Events & Timeline" icon={GitGraph}>
                                    <LivingTreatmentTimeline />
                                </DashboardWidget>

                                {/* 3. Symptom Map */}
                                <DashboardWidget title="Symptom Topology" icon={User}>
                                    <div className="flex justify-center h-full items-center">
                                        <BodyMapSelector highlightedRegions={['head', 'chest']} />
                                    </div>
                                </DashboardWidget>

                                {/* 4. AI Image Analysis */}
                                <DashboardWidget title="AI Diagnostics" icon={LayoutGrid}>
                                    <MedicalImageAnalyzer context="Dermatology Scan" />
                                </DashboardWidget>

                                {/* 5. Feature Demos (New) */}
                                <DashboardWidget title="Interactive Features Demo" icon={BookOpen} className="xl:col-span-2">
                                    <FeatureDemoController />
                                </DashboardWidget>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </TamboProvider>
    );
}
