"use client";

import React from 'react';
import { TamboProvider } from "@tambo-ai/react";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { scribeTools, scribeComponents } from './tools';
import { Mic, FileText, Info } from 'lucide-react';

export default function AmbientScribePage() {
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
            components={scribeComponents}
            tools={scribeTools}
            tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
            mcpServers={mcpServers}

        >
            <div className="flex h-screen bg-white font-[family-name:var(--font-geist-sans)]">
                {/* Sidebar Info */}
                <div className="w-80 border-r border-slate-200 bg-slate-50 hidden md:flex flex-col p-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                            <Mic className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900">Ambient Scribe</h2>
                            <p className="text-xs text-slate-500">Live Documentation</p>
                        </div>
                    </div>

                    <div className="space-y-6 text-sm text-slate-600">
                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                                <Info className="w-4 h-4 text-indigo-500" />
                                Instructions
                            </h3>
                            <p className="leading-relaxed mb-4">
                                Act as the audio stream by typing the dialogue between the doctor and patient.
                            </p>
                            <p className="leading-relaxed">
                                <span className="font-medium text-slate-900">Example Input:</span>
                                <br />
                                <em>"Patient says they have had a fever of 102 for 3 days. I observe wheezing in the left lung."</em>
                            </p>
                        </div>

                        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Output
                            </h3>
                            <p>
                                The AI will extract clinical entities and populate the SOAP note on the right in real-time.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col relative bg-slate-100">
                    <header className="p-4 border-b border-white/50 flex justify-between items-center md:hidden bg-white">
                        <span className="font-bold text-slate-700">Ambient Scribe</span>
                    </header>
                    <div className="flex-1 overflow-hidden p-4 md:p-8">
                        <div className="h-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                            <MessageThreadFull />
                        </div>
                    </div>
                </div>
            </div>
        </TamboProvider>
    );
}
