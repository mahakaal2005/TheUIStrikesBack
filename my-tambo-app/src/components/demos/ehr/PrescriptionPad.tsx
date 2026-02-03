'use client';

import React from 'react';
import { Pill, Check, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { withInteractable } from '@tambo-ai/react';

export const prescriptionPadSchema = z.object({
    data: z.object({
        medication: z.string().optional().describe("Name of the medication"),
        dosage: z.string().optional().describe("Dosage of the medication"),
        frequency: z.string().optional().describe("Frequency of administration"),
        route: z.string().optional().describe("Route of administration (e.g., PO, IV)"),
        notes: z.string().optional().describe("Additional notes or instructions"),
        status: z.enum(['draft', 'signed', 'rejected']).optional().describe("Status of the prescription"),
    }).optional(),
});

type PrescriptionState = z.infer<typeof prescriptionPadSchema>['data'] & {
    status?: 'draft' | 'signed' | 'rejected'; // ensure status is there
};

interface PrescriptionPadProps {
    data?: PrescriptionState;
    // Events are local, not part of Zod schema usually
    onSign?: () => void;
    onReject?: () => void;
}

export const PrescriptionPadBase = ({ data, onSign, onReject }: PrescriptionPadProps) => {
    const [internalState, setInternalState] = React.useState<NonNullable<PrescriptionState>>({
        medication: '',
        dosage: '',
        frequency: '',
        route: 'PO',
        notes: '',
        status: 'draft',
        ...data
    });

    // Effect to update internal state when props change (from AI stream)
    React.useEffect(() => {
        if (data) {
            setInternalState(prev => ({ ...prev, ...data }));
        }
    }, [data]);

    const isSigned = internalState.status === 'signed';

    // Handler wrappers for internal state if needed
    const handleSign = () => {
        setInternalState(prev => ({ ...prev, status: 'signed' }));
        onSign?.();
    };

    const handleReject = () => {
        setInternalState(prev => ({ ...prev, status: 'rejected' }));
        onReject?.();
    };

    return (
        <div className={cn(
            "relative max-w-md mx-auto bg-[#fffbf0] text-slate-900 shadow-lg transform transition-transform duration-300",
            isSigned ? "scale-95 opacity-80" : "scale-100"
        )}>
            {/* Paper Texture Effect */}
            <div className="absolute inset-0 border-l-4 border-red-200/50 pointer-events-none" />

            {/* Header */}
            <div className="p-6 border-b border-blue-100 bg-blue-50/30 flex justify-between items-start">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg">
                        <Pill size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-serif font-bold text-slate-900 tracking-tight">Prescription</h2>
                        <p className="text-xs text-slate-500 font-serif">Dr. Smith, MD • Emergency Medicine</p>
                    </div>
                </div>
                {/* Status Stamp */}
                {internalState.status !== 'draft' && (
                    <div className={cn(
                        "px-3 py-1 border-2 text-sm font-black uppercase transform rotate-12 rounded opacity-80",
                        internalState.status === 'signed' ? "border-green-600 text-green-700" : "border-red-600 text-red-700"
                    )}>
                        {internalState.status}
                    </div>
                )}
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6 font-serif">
                {/* Rx Symbol */}
                <div className="text-4xl font-serif text-slate-300 pointer-events-none absolute right-8 top-24">Rx</div>

                <div className="space-y-4 relative z-10">
                    <div>
                        <label className="block text-xs font-sans text-slate-400 uppercase tracking-wide mb-1">Medication</label>
                        <input
                            type="text"
                            value={internalState.medication || ''}
                            readOnly
                            placeholder="Generative Field..."
                            className="w-full bg-transparent border-b-2 border-slate-200 focus:border-blue-500 outline-none text-xl font-bold py-1 placeholder:font-normal placeholder:text-slate-300"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-sans text-slate-400 uppercase tracking-wide mb-1">Dosage</label>
                            <input
                                type="text"
                                value={internalState.dosage || ''}
                                readOnly
                                placeholder="--"
                                className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none text-lg py-1 placeholder:font-normal placeholder:text-slate-300"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-sans text-slate-400 uppercase tracking-wide mb-1">Frequency</label>
                            <input
                                type="text"
                                value={internalState.frequency || ''}
                                readOnly
                                placeholder="--"
                                className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none text-lg py-1 placeholder:font-normal placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-sans text-slate-400 uppercase tracking-wide mb-1">Notes / Instructions</label>
                        <textarea
                            value={internalState.notes || ''}
                            readOnly
                            rows={2}
                            placeholder="Additional patient instructions..."
                            className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none resize-none py-1 text-slate-600"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end space-x-3">
                {internalState.status === 'draft' ? (
                    <>
                        <button
                            onClick={handleReject}
                            className="flex items-center space-x-2 px-4 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-sans text-sm font-medium"
                        >
                            <X size={16} />
                            <span>Reject</span>
                        </button>
                        <button
                            onClick={handleSign}
                            className="flex items-center space-x-2 px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all hover:shadow-lg font-sans text-sm font-medium"
                        >
                            <FileText size={16} />
                            <span>Sign Script</span>
                        </button>
                    </>
                ) : (
                    <p className="text-sm text-slate-400 italic">Order locked {new Date().toLocaleTimeString()}</p>
                )}
            </div>
        </div>
    );
};

export const PrescriptionPad = withInteractable(PrescriptionPadBase, {
    componentName: "PrescriptionPad",
    description: "A prescription form to draft, review, and sign medication orders.",
    propsSchema: prescriptionPadSchema
});
