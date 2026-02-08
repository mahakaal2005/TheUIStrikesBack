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
import { PatientHeader } from '@/components/patient/PatientHeader';
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

export default function PatientPage() {
    const [isDashboardExpanded, setIsDashboardExpanded] = React.useState(true);
    const mcpServers = useMcpServers();
    const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

    // Auto-submit user message from sessionStorage
    React.useEffect(() => {
        // CRITICAL: Only run on patient demo page to prevent cross-page pollution
        if (typeof window === 'undefined') return;
        if (!window.location.pathname.includes('/demos/patient')) {
            console.log('[AUTO-SUBMIT] Skipped - not on patient page (pathname:', window.location.pathname, ')');
            return;
        }

        console.log('[AUTO-SUBMIT] Effect triggered on patient page');
        const userMessage = sessionStorage.getItem('userMessage');
        console.log('[AUTO-SUBMIT] userMessage:', userMessage);

        if (!userMessage) {
            console.log('[AUTO-SUBMIT] No message to submit');
            return;
        }

        sessionStorage.removeItem('userMessage');
        console.log('[AUTO-SUBMIT] Message removed from storage');

        // Optimized: Check for editor with retry mechanism instead of fixed delay
        const findEditorAndSubmit = (retryCount = 0, maxRetries = 20) => {
            const editor = document.querySelector('.tiptap.ProseMirror') as HTMLElement;

            if (editor) {
                console.log('[AUTO-SUBMIT] ✅ Found Tiptap editor');
                editor.innerHTML = `<p>${userMessage}</p>`;
                editor.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('[AUTO-SUBMIT] Value set, events dispatched');

                // Reduced delay for button rerender
                setTimeout(() => {
                    const submitButton = document.querySelector('button[aria-label*="Send"]') as HTMLButtonElement;
                    console.log('[AUTO-SUBMIT] Found button:', !!submitButton);

                    if (submitButton) {
                        submitButton.click();
                        console.log('[AUTO-SUBMIT] ✅ Message submitted!');
                    } else {
                        console.error('[AUTO-SUBMIT] ❌ No submit button found');
                    }
                }, 200); // Reduced from 500ms
            } else if (retryCount < maxRetries) {
                // Retry every 100ms instead of waiting 2s upfront
                console.log(`[AUTO-SUBMIT] Editor not ready, retry ${retryCount + 1}/${maxRetries}`);
                setTimeout(() => findEditorAndSubmit(retryCount + 1, maxRetries), 100);
            } else {
                console.error('[AUTO-SUBMIT] ❌ Tiptap editor not found after max retries');
            }
        };

        // Start checking after minimal delay (reduced from 2000ms to 300ms)
        setTimeout(() => findEditorAndSubmit(), 300);
    }, []);

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
            {/* Skip to chat link for accessibility */}
            <a
                href="#chat"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-4 py-2 rounded-lg shadow-lg z-50 text-cyan-600 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
                Skip to chat
            </a>

            <div className="flex h-screen bg-slate-50 font-[family-name:var(--font-geist-sans)]">
                <div className="flex-1 max-w-5xl mx-auto flex flex-col">

                    {/* Compact header */}
                    <div className="p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                        <PatientHeader />
                    </div>

                    {/* Full-width chat - Tambo injects components contextually */}
                    <div id="chat" className="flex-1 overflow-y-auto p-6">
                        <MessageThreadFull />
                    </div>

                </div>
            </div>
        </TamboProvider>
    );
}
