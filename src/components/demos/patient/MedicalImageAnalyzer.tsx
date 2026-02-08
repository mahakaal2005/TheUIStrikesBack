'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ScanEye, CheckCircle2, Activity } from 'lucide-react';
import { ImageUploadDropzone } from './IntakeWidgets';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

export const medicalImageAnalyzerSchema = z.object({
    context: z.string().optional().describe("Context for the analysis (e.g. 'Check this rash', 'Analyze X-ray')"),
});

export type MedicalImageAnalyzerProps = z.infer<typeof medicalImageAnalyzerSchema>;

interface AnalysisResult {
    finding: string;
    confidence: number;
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
    details: string;
}

export const MedicalImageAnalyzer = ({ context = "Medical Image Analysis" }: MedicalImageAnalyzerProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const handleUpload = (uploadedFile: File) => {
        setFile(uploadedFile);
        setResult(null); // Reset result on new upload
    };

    const analyzeImage = () => {
        if (!file) return;

        setIsAnalyzing(true);

        // Simulate AI Analysis Delay
        setTimeout(() => {
            // Mock Results based on random chance or file name for demo variety
            const isSevere = Math.random() > 0.5;

            setResult({
                finding: isSevere ? "Potential Contact Dermatitis" : "Benign Skin Abrasion",
                confidence: 85 + Math.floor(Math.random() * 14),
                severity: isSevere ? 'medium' : 'low',
                recommendation: isSevere ? "Apply hydrocortisone cream and monitor." : "Keep clean and covered.",
                details: "Visual analysis detects localized erythema consistent with inflammatory response."
            });
            setIsAnalyzing(false);
        }, 2500);
    };

    return (
        <div className="space-y-4">
            {/* Header - Aligned with BodyMapSelector/PrescriptionPad */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                    <ScanEye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">AI Scan Analysis</h3>
                    <p className="text-xs text-slate-500">{context || 'Medical Imaging'}</p>
                </div>
            </div>

            {/* Main Interactive Area */}
            <div className="relative">
                {result && (
                    <Badge variant="outline" className={`absolute top-0 right-0 mt-2 mr-2 capitalize ${result.severity === 'high' ? 'bg-red-50 text-red-700 border-red-100' :
                        result.severity === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                            'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                        {result.severity} Risk
                    </Badge>
                )}
            </div>

            <div className="p-6 space-y-6">

                {/* Upload Section - Simplified to match aesthetic */}
                <div className={result ? "opacity-50 pointer-events-none transition-opacity scale-95 origin-top" : ""}>
                    <ImageUploadDropzone
                        label="Upload Medical Image"
                        onUpload={handleUpload}
                    />
                </div>

                {/* Analysis Loading State - Cleaner animation */}
                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-8"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25" />
                            <div className="relative p-4 bg-white rounded-full shadow-lg border border-blue-50">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        </div>
                        <p className="text-sm font-bold text-slate-700 mt-4">Analyzing Clinical Patterns...</p>
                        <p className="text-xs text-slate-400">Comparing with 2M+ medical records</p>
                    </motion.div>
                )}

                {/* Results Display - Matching BodyMap "Reported Symptoms" container style */}
                <AnimatePresence>
                    {result && !isAnalyzing && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Finding</p>
                                    <div className="flex items-center gap-1 text-emerald-600 bg-white px-2 py-0.5 rounded-full border border-emerald-100 shadow-sm">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span className="text-[10px] font-bold">{result.confidence}% Conf.</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{result.finding}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{result.details}</p>
                            </div>

                            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex gap-3">
                                <Activity className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Recommendation</p>
                                    <p className="text-sm font-medium text-blue-900">{result.recommendation}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                <p className="text-[10px] text-slate-400 font-medium">
                    AI-generated analysis. Not a diagnosis.
                </p>
                <Button
                    onClick={analyzeImage}
                    disabled={!file || isAnalyzing || !!result}
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95"
                >
                    {isAnalyzing ? "Scanning..." : "Run Analysis"}
                </Button>
            </div>
        </div>
    );
};
