import React from 'react';

export default function EHRPage() {
    return (
        <div className="flex h-screen bg-slate-50">
            {/* Left: Chat/Transcript Log */}
            <div className="w-1/3 border-r border-gray-200 bg-white p-4 flex flex-col">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Transcript</h2>
                <div className="flex-1 overflow-y-auto space-y-4 text-gray-600">
                    <p className="italic text-sm">Waiting for conversation to start...</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                    {/* Placeholder for Input */}
                    <div className="h-12 bg-gray-50 rounded border border-gray-300 flex items-center px-4 text-gray-400">
                        Listening...
                    </div>
                </div>
            </div>

            {/* Right: The "Patient Chart" (Generative UI Area) */}
            <div className="w-2/3 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-2xl font-bold text-gray-900">Patient Chart</h1>

                    {/* Vitals Section Placeholder */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/60">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Live Vitals</h3>
                        <div className="h-20 bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                            Vitals Monitor Component
                        </div>
                    </div>

                    {/* Body Map Section Placeholder */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/60">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Symptom Map</h3>
                        <div className="h-64 bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                            Body Map Component
                        </div>
                    </div>

                    {/* Prescription Section Placeholder */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/60">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Plan & Orders</h3>
                        <div className="h-40 bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                            Prescription Pad Component
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
