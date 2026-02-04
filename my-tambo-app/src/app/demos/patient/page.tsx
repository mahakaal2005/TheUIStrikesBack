"use client";

import React from 'react';
import { TamboProvider } from "@tambo-ai/react";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { patientTools } from './tools';
import { MedicationList, medicationListSchema } from '@/components/demos/patient/MedicationList';
import { LabResultList, labResultListSchema } from '@/components/demos/patient/LabResultList';
import { BodyMapSelector, bodyMapSchema } from '@/components/demos/ehr/BodyMapSelector';
import { User } from 'lucide-react';

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
    }
];

export default function GenerativePatientPage() {
    const mcpServers = useMcpServers();

    return (
        <TamboProvider
            apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
            components={patientComponents}
            tools={patientTools}
            tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
            mcpServers={mcpServers}
        >
            <div className="flex h-screen bg-slate-50 font-[family-name:var(--font-geist-sans)]">
                {/* Sidebar profile */}
                <div className="w-80 border-r border-slate-200 bg-white hidden md:flex flex-col p-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900">Alex Morgan</h2>
                            <p className="text-xs text-slate-500">Patient Portal</p>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm text-slate-600">
                        <p className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <strong>Tip:</strong> You can ask questions like:
                            <br /><br />
                            "Show my active prescriptions"
                            <br />
                            "Do I have any new lab results?"
                            <br />
                            "What is Amoxicillin used for?"
                        </p>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col relative">
                    <header className="p-4 border-b border-white/50 flex justify-between items-center md:hidden">
                        <span className="font-bold text-slate-700">My Health Portal</span>
                    </header>
                    <div className="flex-1 overflow-hidden">
                        <MessageThreadFull />
                    </div>
                </div>
            </div>
        </TamboProvider>
    );
}
