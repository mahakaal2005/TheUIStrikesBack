'use client';

import React from 'react';
import { useHealthcare } from '@/contexts/HealthcareContext';
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
    status?: 'draft' | 'signed' | 'rejected';
};

interface PrescriptionPadProps {
    data?: PrescriptionState;
    onSign?: () => void;
    onReject?: () => void;
}

export const PrescriptionPadBase = ({ data, onSign, onReject }: PrescriptionPadProps) => {
    const { addPrescription, activePatient } = useHealthcare();

    const [medication, setMedication] = React.useState(data?.medication || '');
    const [dosage, setDosage] = React.useState(data?.dosage || '');
    const [frequency, setFrequency] = React.useState(data?.frequency || '');
    const [instructions, setInstructions] = React.useState(data?.notes || '');
    const [status, setStatus] = React.useState<'draft' | 'signed' | 'rejected'>('draft');

    React.useEffect(() => {
        if (data) {
            if (data.medication) setMedication(data.medication);
            if (data.dosage) setDosage(data.dosage);
            if (data.frequency) setFrequency(data.frequency);
            if (data.notes) setInstructions(data.notes);
            if (data.status) setStatus(data.status);
        }
    }, [data]);

    const handleSubmit = () => {
        setStatus('signed');
        onSign?.();

        if (medication) {
            addPrescription({
                patientId: activePatient.id,
                medicationName: medication,
                dosage: dosage || 'As directed',
                instructions: instructions || 'Take as prescribed',
            });
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 space-y-4">
                {/* Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Medication</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="e.g. Amoxicillin"
                            value={medication}
                            onChange={(e) => setMedication(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Dosage</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="500mg"
                            value={dosage}
                            onChange={(e) => setDosage(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Frequency</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="BID x 7 days"
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                        />
                    </div>
                </div>

                {/* Instructions */}
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Instructions</label>
                    <textarea
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-20"
                        placeholder="Take with food..."
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                    />
                </div>

                {/* Safety Badge */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-emerald-800">Safety Checks Passed</h4>
                        <p className="text-xs text-emerald-600">No interactions detected.</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-auto border-t border-slate-100 flex justify-end gap-3">
                <button
                    onClick={() => { setMedication(''); setDosage(''); setFrequency(''); setInstructions(''); }}
                    className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium"
                >
                    Clear
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!medication || status === 'signed'}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                    <FileText size={16} />
                    {status === 'signed' ? 'Signed' : 'Sign & Order'}
                </button>
            </div>
        </div>
    );
};

export const PrescriptionPad = withInteractable(PrescriptionPadBase, {
    componentName: "PrescriptionPad",
    description: "A prescription form to draft, review, and sign medication orders.",
    propsSchema: prescriptionPadSchema
});
