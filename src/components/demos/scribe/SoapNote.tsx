import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollText, CheckCircle2, Clock } from 'lucide-react';
import { z } from 'zod';

export const soapNoteSchema = z.object({
    subjective: z.array(z.string()).describe("List of patient's stated symptoms, history, and concerns"),
    objective: z.array(z.string()).describe("List of measurable findings, vitals, and physical exam observations"),
    assessment: z.array(z.string()).describe("List of diagnoses or differential diagnoses"),
    plan: z.array(z.string()).describe("List of treatments, prescriptions, referrals, and follow-up instructions"),
    status: z.enum(['draft', 'finalized']).describe("Current status of the note")
});

export type SoapNoteProps = z.infer<typeof soapNoteSchema>;

export const SoapNote = ({
    subjective = [],
    objective = [],
    assessment = [],
    plan = [],
    status = 'draft'
}: SoapNoteProps) => {

    const Section = ({ title, items, colorClass }: { title: string, items: string[], colorClass: string }) => (
        <div className={`space-y-2 p-3 rounded-lg border ${status === 'draft' ? 'border-dashed' : 'border-solid'} ${colorClass} bg-opacity-5`}>
            <h3 className="font-semibold text-sm uppercase tracking-wider opacity-80 flex items-center gap-2">
                {title}
                {items.length > 0 && <span className="text-xs bg-white bg-opacity-50 px-1.5 py-0.5 rounded-full">{items.length}</span>}
            </h3>
            {items.length === 0 ? (
                <p className="text-xs italic opacity-50 pl-4">Waiting for input...</p>
            ) : (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    {items.map((item, idx) => (
                        <li key={idx} className="leading-snug text-slate-700">
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 font-bold text-slate-800">
                        <ScrollText className="w-5 h-5 text-blue-600" />
                        Clinical Note (SOAP)
                    </CardTitle>
                    <Badge
                        variant={status === 'finalized' ? 'default' : 'outline'}
                        className={status === 'finalized' ? 'bg-green-600 hover:bg-green-700' : 'text-amber-600 border-amber-200 bg-amber-50'}
                    >
                        {status === 'finalized' ? (
                            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Signed</span>
                        ) : (
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Live Draft</span>
                        )}
                    </Badge>
                </div>
                <CardDescription>
                    AI-generated clinical documentation based on live consultation.
                </CardDescription>
            </CardHeader>

            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Section title="Subjective" items={subjective} colorClass="border-blue-200 bg-blue-50 text-blue-900" />
                <Section title="Objective" items={objective} colorClass="border-emerald-200 bg-emerald-50 text-emerald-900" />
                <Section title="Assessment" items={assessment} colorClass="border-purple-200 bg-purple-50 text-purple-900" />
                <Section title="Plan" items={plan} colorClass="border-amber-200 bg-amber-50 text-amber-900" />
            </CardContent>
        </Card>
    );
};
