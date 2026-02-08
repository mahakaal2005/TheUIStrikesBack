'use client';

import React from 'react';
import { TamboProvider } from "@tambo-ai/react";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { useHealthcare } from "@/contexts/HealthcareContext";
import { EHRHeader } from "@/components/ehr/EHRHeader";
import { components, tools } from "@/lib/tambo";

export default function EHRPage() {
    const mcpServers = useMcpServers();
    const { activePatient, labOrders } = useHealthcare();
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
            components={components}
            tools={tools}
            tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
            mcpServers={mcpServers}
        >
            {/* Skip to chat link for accessibility */}
            <a
                href="#chat"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-4 py-2 rounded-lg shadow-lg z-50 text-blue-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Skip to chat
            </a>

            <div className="flex h-screen bg-slate-50 font-[family-name:var(--font-geist-sans)]">
                <div className="flex-1 max-w-5xl mx-auto flex flex-col">

                    {/* Compact header */}
                    <div className="p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                        <EHRHeader
                            doctorName="Dr. Sarah Chen"
                            specialty="Internal Medicine"
                            patientName={activePatient.name}
                            status="online"
                        />
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
