"use client";

import React, { useState } from 'react';
import { useHealthcare, Prescription } from '@/contexts/HealthcareContext';
import { Pill, CheckCircle, Clock, Package } from 'lucide-react';

export default function PharmacyPage() {
    const { prescriptions, updatePrescriptionStatus } = useHealthcare();
    const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

    const [isMounted, setIsMounted] = useState(false);
    React.useEffect(() => { setIsMounted(true); }, []);

    const rxList = prescriptions || [];
    const pendingRx = rxList.filter(p => p.status === 'pending');
    const readyRx = rxList.filter(p => p.status === 'ready_for_pickup');
    const pickedUpRx = rxList.filter(p => p.status === 'picked_up');

    const handleFulfillRx = (rx: Prescription) => {
        updatePrescriptionStatus(rx.id, 'ready_for_pickup');
        setSelectedRx(null);
    };

    const handleMarkPickedUp = (rx: Prescription) => {
        updatePrescriptionStatus(rx.id, 'picked_up');
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-[family-name:var(--font-geist-sans)]">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Pill className="w-8 h-8 text-emerald-600" />
                        Pharmacy Portal
                    </h1>
                    <p className="text-slate-500 mt-2">Dispense medications and manage active prescriptions.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Intake Queue */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* New Prescriptions */}
                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-500" />
                                New Prescriptions (Intake)
                            </h2>
                            {pendingRx.length === 0 ? (
                                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400">
                                    No new prescriptions.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingRx.map(rx => (
                                        <div key={rx.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900">{rx.medicationName} <span className="text-slate-500 font-normal text-base">{rx.dosage}</span></h3>
                                                <p className="text-slate-500 text-sm">Patient ID: {rx.patientId}</p>
                                                <p className="text-sm text-slate-600 mt-1 italic">"{rx.instructions}"</p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedRx(rx)}
                                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                                            >
                                                Review & Fill
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Ready for Pickup */}
                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-blue-500" />
                                Ready for Pickup
                            </h2>
                            {readyRx.length === 0 ? (
                                <p className="text-slate-400 text-sm">No orders waiting for pickup.</p>
                            ) : (
                                <div className="space-y-4">
                                    {readyRx.map(rx => (
                                        <div key={rx.id} className="bg-white p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium text-slate-900">{rx.medicationName}</h3>
                                                <p className="text-xs text-emerald-600 font-medium">Ready since {isMounted && rx.filledAt ? new Date(rx.filledAt).toLocaleTimeString() : ''}</p>
                                            </div>
                                            <button
                                                onClick={() => handleMarkPickedUp(rx)}
                                                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full border border-slate-300 transition-colors"
                                            >
                                                Mark Picked Up
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* History */}
                        <section className="opacity-60 hover:opacity-100 transition-opacity">
                            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-slate-400" />
                                Dispensed History
                            </h2>
                            {pickedUpRx.map(rx => (
                                <div key={rx.id} className="py-2 border-b border-slate-200 flex justify-between text-sm">
                                    <span className="text-slate-700">{rx.medicationName}</span>
                                    <span className="text-slate-400">Picked up</span>
                                </div>
                            ))}
                        </section>

                    </div>

                    {/* Right Column: Action Panel */}
                    <div className="lg:col-span-1">
                        {selectedRx ? (
                            <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-lg sticky top-8">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">
                                    Fill Prescription
                                </h3>

                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Medication</div>
                                        <div className="text-xl font-bold text-slate-900">{selectedRx.medicationName}</div>
                                        <div className="text-md text-slate-600">{selectedRx.dosage}</div>
                                    </div>

                                    <div>
                                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Patient Instructions</div>
                                        <p className="text-slate-800 bg-yellow-50 p-3 rounded border border-yellow-100">
                                            {selectedRx.instructions}
                                        </p>
                                    </div>


                                    <div>
                                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Safety Checks</div>
                                        <ul className="space-y-2 text-sm text-slate-600">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-500" /> Drug-Drug Interactions (None)
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-500" /> Allergy Check (Passed)
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-500" /> Insurance Status (Active)
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            onClick={() => setSelectedRx(null)}
                                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleFulfillRx(selectedRx)}
                                            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-sm"
                                        >
                                            Dispense
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-100 p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-400">
                                <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Select a prescription to review and fill.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
