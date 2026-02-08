'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, BookOpen, Activity, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

export interface Step {
    title: string;
    description: string;
    image_prompt?: string; // For potential future image generation
}

export interface MedicalGuideProps {
    topic: string;
    steps: Step[];
    difficulty?: 'easy' | 'medium' | 'hard';
}

export interface SymptomExplainerProps {
    symptom?: string;
    severity?: 'mild' | 'moderate' | 'severe' | 'low' | 'medium' | 'high';
    possible_causes?: string[];
    recommended_action?: string;
    biological_context?: string; // "What's happening inside?"
}

// --- Components ---

/**
 * MedicalGuide: A step-by-step interactive carousel for instructions.
 * AI Use Case: "How do I use an inhaler?", "How to check my pulse?"
 */
export const MedicalGuide = ({ topic, steps, difficulty = 'easy' }: MedicalGuideProps) => {
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep(c => c + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(c => c - 1);
    };

    return (
        <Card className="w-full max-w-md mx-auto overflow-hidden border-blue-100 shadow-md">
            <CardHeader className="bg-blue-50/50 pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-500" />
                            {topic}
                        </CardTitle>
                        <CardDescription>Step {currentStep + 1} of {steps.length}</CardDescription>
                    </div>
                    <Badge variant="outline" className="capitalize bg-white text-blue-600 border-blue-200">
                        {difficulty}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="min-h-[200px] flex flex-col justify-between">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            <h3 className="text-xl font-semibold text-slate-800">{steps[currentStep].title}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {steps[currentStep].description}
                            </p>

                            {/* Placeholder for GenUI visualization */}
                            <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm border border-slate-200 border-dashed">
                                {steps[currentStep].image_prompt ? (
                                    <span>Visual: {steps[currentStep].image_prompt}</span>
                                ) : (
                                    <span>Visual Aid Placeholder</span>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
                        <Button
                            variant="ghost"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className="text-slate-500 hover:text-blue-600"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" /> Back
                        </Button>

                        <div className="flex gap-1">
                            {steps.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 w-1.5 rounded-full transition-colors ${idx === currentStep ? 'bg-blue-500' : 'bg-slate-200'}`}
                                />
                            ))}
                        </div>

                        <Button
                            onClick={nextStep}
                            disabled={currentStep === steps.length - 1}
                            className={currentStep === steps.length - 1 ? 'invisible' : 'bg-blue-600 hover:bg-blue-700'}
                        >
                            Next <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

/**
 * SymptomExplainer: Visualizes what a symptom means.
 * AI Use Case: "Why do I have a headache?", "What does high BP mean?"
 */
export const SymptomExplainer = ({
    symptom = "Unknown Symptom",
    severity = "mild",
    possible_causes = [],
    recommended_action,
    biological_context
}: SymptomExplainerProps) => {

    const normalizedSeverity = (severity === 'low' ? 'mild' :
        severity === 'medium' ? 'moderate' :
            severity === 'high' ? 'severe' : severity) as 'mild' | 'moderate' | 'severe';

    const severityColor = {
        'mild': 'bg-green-100 text-green-700 border-green-200',
        'moderate': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'severe': 'bg-red-100 text-red-700 border-red-200'
    }[normalizedSeverity];

    return (
        <Card className="w-full max-w-md mx-auto border-purple-100 shadow-md">
            <CardHeader className="bg-purple-50/50">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-purple-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-600" />
                        Understanding: {symptom}
                    </CardTitle>
                    <Badge variant="outline" className={`capitalize ${severityColor}`}>
                        {normalizedSeverity} Concern
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                {/* Biological Context Section */}
                {biological_context && (
                    <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                        <h4 className="text-sm font-semibold text-purple-900 mb-2 uppercase tracking-wide text-[10px]">What's Happening Inside</h4>
                        <p className="text-sm text-slate-600 italic">"{biological_context}"</p>
                    </div>
                )}

                {/* Causes Grid */}
                <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-3">Common Causes</h4>
                    <div className="flex flex-wrap gap-2">
                        {possible_causes.map((cause, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                                {cause}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Action Box */}
                {recommended_action && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold text-blue-900">Recommended Action</h4>
                            <p className="text-sm text-blue-800 mt-1">{recommended_action}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
