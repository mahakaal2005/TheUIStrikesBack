"use client";

import React, { useState, useEffect } from 'react';
import { useHealthcare, Prescription } from '@/contexts/HealthcareContext';
import { DashboardWidget } from '@/components/ui/dashboard-widget';
import { Pill, CheckCircle, Clock, Package, AlertTriangle, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// AI Integration
import { TamboProvider } from "@tambo-ai/react";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { pharmacyTools } from './tools';
import { components } from "@/lib/tambo";
import { z } from "zod";

export default function PharmacyPage() {
    const { prescriptions, updatePrescriptionStatus } = useHealthcare();
    const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
    const [safetyCheckStatus, setSafetyCheckStatus] = useState<'idle' | 'checking' | 'safe' | 'warning'>('idle');

    const [isMounted, setIsMounted] = useState(false);
    React.useEffect(() => { setIsMounted(true); }, []);

    const rxList = prescriptions || [];
    const pendingRx = rxList.filter(p => p.status === 'pending');
    const readyRx = rxList.filter(p => p.status === 'ready_for_pickup');
    const pickedUpRx = rxList.filter(p => p.status === 'picked_up');

    // Simulate stock check (random for demo)
    const getStockStatus = (medName: string) => {
        // Deterministic mock based on name length
        return medName.length % 5 === 0 ? 'low' : 'ok';
    };

    const handleCheckSafety = () => {
        setSafetyCheckStatus('checking');
        setTimeout(() => {
            // Mock logic: warn if "Aspirin" and "Warfarin" exist, else safe.
            // For now, just a random safe check for the demo feel.
            setSafetyCheckStatus('safe');
        }, 1500);
    };

    const handleFulfillRx = (rx: Prescription) => {
        updatePrescriptionStatus(rx.id, 'ready_for_pickup');
        setSelectedRx(null);
        setSafetyCheckStatus('idle');
    };

    const handleMarkPickedUp = (rx: Prescription) => {
        updatePrescriptionStatus(rx.id, 'picked_up');
    }

    // AI Integration Hooks
    const mcpServers = useMcpServers();
    const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

    /* eslint-disable react-hooks/exhaustive-deps */
    const dynamicPharmacyTools = React.useMemo(() => {
        return [
            {
                name: "checkQueue",
                description: "List prescriptions waiting in the Intake Queue.",
                tool: async () => {
                    const count = pendingRx.length;
                    return {
                        info: `There are ${count} prescriptions in the queue.`,
                        scripts: pendingRx.map(p => `${p.medicationName} for ${p.patientId}`)
                    };
                },
                inputSchema: pharmacyTools[0].inputSchema,
                outputSchema: z.any()
            },
            {
                name: "inspectPrescription",
                description: "Select and open a specific prescription for verification.",
                tool: async (input: { query: string }) => {
                    const rx = pendingRx.find(p =>
                        p.id.includes(input.query) ||
                        p.medicationName.toLowerCase().includes(input.query.toLowerCase()) ||
                        p.patientId.toLowerCase().includes(input.query.toLowerCase())
                    );

                    if (rx) {
                        setSelectedRx(rx);
                        setSafetyCheckStatus('idle');
                        return { success: true, message: `Opened verification for ${rx.medicationName}` };
                    }
                    return { success: false, message: "Prescription not found in pending queue." };
                },
                inputSchema: pharmacyTools[1].inputSchema,
                outputSchema: z.any()
            },
            {
                name: "runSafetyCheck",
                description: "Run clinical safety checks on the current prescription.",
                tool: async () => {
                    if (selectedRx) {
                        handleCheckSafety();
                        return { success: true, message: "Safety check usage initiated." };
                    }
                    return { success: false, message: "No prescription selected." };
                },
                inputSchema: pharmacyTools[2].inputSchema,
                outputSchema: z.any()
            }
        ];
    }, [pendingRx, selectedRx]); // Re-create to access state setters

    if (!isMounted) return null;
    if (!apiKey) return <div className="p-4 text-red-500">Missing API Key</div>;

    return (
        <TamboProvider
            apiKey={apiKey}
            components={components}
            tools={dynamicPharmacyTools}
            tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
            mcpServers={mcpServers}
        >
            <div className="flex h-screen bg-slate-50 font-[family-name:var(--font-geist-sans)] overflow-hidden">
                {/* AI Sidebar (Left) */}
                <div className="w-[400px] flex flex-col border-r border-slate-200 bg-white shadow-xl z-20">
                    <div className="p-4 border-b border-emerald-50 bg-emerald-50/10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md">
                            <Pill size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800 leading-tight">Pharmacy Agent</h2>
                            <p className="text-xs text-slate-500 font-medium">Safety Protocols Active</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden relative flex flex-col">
                        <MessageThreadFull />
                    </div>
                </div>

                {/* Main Content Area (Right) */}
                <div className="flex-1 overflow-y-auto bg-slate-50 relative">
                    <div className="p-6 max-w-7xl mx-auto space-y-6">

                        {/* Header */}
                        <header className="flex items-center justify-between pb-6 border-b border-slate-200">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                    <div className="bg-emerald-600 p-2 rounded-lg shadow-sm">
                                        <Pill className="w-8 h-8 text-white" />
                                    </div>
                                    Central Pharmacy
                                </h1>
                                <p className="text-slate-500 mt-2 text-lg">Dispensing & Clinical Review</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-center">
                                    <div className="text-2xl font-bold text-orange-500">{pendingRx.length}</div>
                                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Queue</div>
                                </div>
                                <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-center">
                                    <div className="text-2xl font-bold text-blue-600">{readyRx.length}</div>
                                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Ready</div>
                                </div>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                            {/* LEFT COLUMN: Queues */}
                            <div className="lg:col-span-4 xl:col-span-3 space-y-6">

                                {/* Intake Queue Widget */}
                                <DashboardWidget title="Intake Queue" icon={Clock} defaultOpen={true}>
                                    {pendingRx.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400">
                                            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                                            <p>No new prescriptions.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {pendingRx.map(rx => (
                                                <motion.div
                                                    key={rx.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    onClick={() => { setSelectedRx(rx); setSafetyCheckStatus('idle'); }}
                                                    className={cn(
                                                        "p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm",
                                                        selectedRx?.id === rx.id
                                                            ? "bg-emerald-50 border-emerald-200 ring-1 ring-emerald-200"
                                                            : "bg-white border-slate-100 hover:border-emerald-200"
                                                    )}
                                                >
                                                    <div className="font-bold text-slate-800">{rx.medicationName}</div>
                                                    <div className="text-xs text-slate-500 mb-2">{rx.dosage}</div>
                                                    <div className="flex justify-between items-center text-xs text-slate-400">
                                                        <span>Pt ID: #{rx.patientId}</span>
                                                        <span className="font-mono">
                                                            {new Date(rx.prescribedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </DashboardWidget>

                                {/* Ready for Pickup Widget */}
                                <DashboardWidget title="Ready for Pickup" icon={Package}>
                                    {readyRx.length === 0 ? (
                                        <p className="text-slate-400 text-sm p-4 text-center">No orders waiting.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {readyRx.map(rx => (
                                                <div key={rx.id} className="p-3 bg-white rounded-lg border border-emerald-100 flex justify-between items-center shadow-sm">
                                                    <div>
                                                        <div className="font-medium text-slate-900 text-sm">{rx.medicationName}</div>
                                                        <div className="text-xs text-emerald-600 font-medium">Ready</div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleMarkPickedUp(rx)}
                                                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full border border-slate-300 transition-colors uppercase font-bold tracking-wide"
                                                    >
                                                        Pickup
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </DashboardWidget>

                                {/* Dispsensed History (Collapsed default) */}
                                <DashboardWidget title="Dispensed History" icon={CheckCircle} defaultOpen={false}>
                                    {pickedUpRx.map(rx => (
                                        <div key={rx.id} className="py-2 border-b border-slate-100 flex justify-between text-xs last:border-0">
                                            <span className="text-slate-700 font-medium">{rx.medicationName}</span>
                                            <span className="text-slate-400">Picked up</span>
                                        </div>
                                    ))}
                                </DashboardWidget>
                            </div>

                            {/* CENTER/RIGHT COLUMN: Filling Station */}
                            <div className="lg:col-span-8 xl:col-span-9">
                                <AnimatePresence mode="wait">
                                    {selectedRx ? (
                                        <motion.div
                                            key={selectedRx.id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            className="h-full"
                                        >
                                            <DashboardWidget title="Pharmacy Verification Station" icon={ShieldCheck} className="min-h-[600px]">

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">

                                                    {/* LEFT: Rx Details */}
                                                    <div className="space-y-6">
                                                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                                                            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Medication Order</div>
                                                            <div className="text-3xl font-bold text-slate-900 mb-1">{selectedRx.medicationName}</div>
                                                            <div className="text-xl text-slate-600 font-medium">{selectedRx.dosage}</div>

                                                            <div className="mt-4 flex gap-2">
                                                                {getStockStatus(selectedRx.medicationName) === 'low' ? (
                                                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded flex items-center gap-1">
                                                                        <AlertTriangle size={12} /> Low Stock
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded flex items-center gap-1">
                                                                        <CheckCircle size={12} /> In Stock
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Patient Instructions (Sig)</div>
                                                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-slate-800 italic leading-relaxed text-lg">
                                                                "{selectedRx.instructions}"
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* RIGHT: Safety & Action */}
                                                    <div className="flex flex-col h-full bg-slate-50/50 rounded-xl border border-slate-100 p-6">
                                                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                            <ShieldCheck className="text-indigo-600" /> Clinical Safety Check
                                                        </h3>

                                                        {/* Interaction Checker */}
                                                        <div className="flex-1 space-y-4">
                                                            {safetyCheckStatus === 'idle' && (
                                                                <div className="text-center py-10">
                                                                    <p className="text-slate-500 mb-4 text-sm">Run automated screening for drug-drug interactions and dosage alerts.</p>
                                                                    <button
                                                                        onClick={handleCheckSafety}
                                                                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium transition-colors text-sm"
                                                                    >
                                                                        Run Safety Checks
                                                                    </button>
                                                                </div>
                                                            )}

                                                            {safetyCheckStatus === 'checking' && (
                                                                <div className="text-center py-10 animate-pulse">
                                                                    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                                                    <p className="text-indigo-600 font-medium">Analyzing database...</p>
                                                                </div>
                                                            )}

                                                            {safetyCheckStatus === 'safe' && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className="bg-green-50 border border-green-100 p-4 rounded-lg"
                                                                >
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <div className="bg-green-100 p-2 rounded-full">
                                                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-bold text-green-900">Safety Check Passed</div>
                                                                            <div className="text-xs text-green-700">No interactions found.</div>
                                                                        </div>
                                                                    </div>
                                                                    <ul className="space-y-1 mt-2 ml-10 text-xs text-green-800 list-disc">
                                                                        <li>Drug-Drug Interactions: None</li>
                                                                        <li>Drug-Allergy: Cleared</li>
                                                                        <li>Dosage Range: Normal</li>
                                                                    </ul>
                                                                </motion.div>
                                                            )}
                                                        </div>

                                                        {/* Dispense Action */}

                                                        <div className="mt-8 pt-6 border-t border-slate-200">
                                                            <button
                                                                onClick={() => handleFulfillRx(selectedRx)}
                                                                disabled={safetyCheckStatus !== 'safe'}
                                                                className={cn(
                                                                    "w-full py-3 rounded-xl font-bold text-lg shadow-sm transition-all flex items-center justify-center gap-2",
                                                                    safetyCheckStatus === 'safe'
                                                                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200"
                                                                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                                                )}
                                                            >
                                                                <Truck size={20} />
                                                                {safetyCheckStatus === 'safe' ? "Approve & Dispense" : "Complete Safety Check"}
                                                            </button>
                                                        </div>

                                                    </div>

                                                    {/* AI Counseling Guide */}
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.2 }}
                                                        className="mt-8 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl p-6 border border-violet-100 col-span-1 md:col-span-2"
                                                    >
                                                        <h3 className="flex items-center gap-2 font-bold text-violet-900 mb-4">
                                                            <div className="bg-violet-200 p-1.5 rounded-lg text-violet-700">
                                                                <Sparkles size={16} />
                                                            </div>
                                                            AI Patient Counseling Assistant
                                                        </h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                            {/* Generative Mock Content */}
                                                            {[
                                                                { title: "Key Usage", text: `Take ${selectedRx.medicationName} ${selectedRx.instructions.toLowerCase().includes('food') ? 'with food' : 'with water'} to ensure proper absorption.` },
                                                                { title: "Side Effects", text: "May cause drowsiness. Avoid operating heavy machinery until you know how it affects you." },
                                                                { title: "Storage", text: "Store at room temperature away from moisture. Keep out of reach of children." }
                                                            ].map((point, i) => (
                                                                <div key={i} className="bg-white/60 p-4 rounded-lg border border-violet-100/50">
                                                                    <div className="font-semibold text-violet-800 text-sm mb-1">{point.title}</div>
                                                                    <p className="text-sm text-slate-600 leading-relaxed">{point.text}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                </div>

                                            </DashboardWidget>
                                        </motion.div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                                <Pill className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-slate-700 mb-2">Pharmacy Workstation</h3>
                                            <p className="max-w-md mx-auto">Select a prescription from the Intake Queue to start the verification and filling process.</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </TamboProvider>
    );
}

