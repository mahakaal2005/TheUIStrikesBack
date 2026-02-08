"use client";

import React from 'react';
import { useHealthcare } from '@/contexts/HealthcareContext';
import { TamboProvider } from "@tambo-ai/react";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { LabHeader } from '@/components/lab/LabHeader';
import { labTools } from './tools';
import { components } from "@/lib/tambo";

export default function LabPage() {
    const { labOrders } = useHealthcare();
    const mcpServers = useMcpServers();
    const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

    const pendingOrders = labOrders.filter(order => order.status === 'ordered' || order.status === 'processing');

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
            tools={labTools}
            tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
            mcpServers={mcpServers}
        >
            {/* Skip to chat link for accessibility */}
            <a
                href="#chat"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-4 py-2 rounded-lg shadow-lg z-50 text-indigo-600 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                Skip to chat
            </a>

            <div className="flex h-screen bg-slate-50 font-[family-name:var(--font-geist-sans)]">
                <div className="flex-1 max-w-5xl mx-auto flex flex-col">

                    {/* Compact header */}
                    <div className="p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                        <LabHeader
                            technicianName="Mike Rodriguez"
                            department="Clinical Laboratory"
                            pendingTests={pendingOrders.length}
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
