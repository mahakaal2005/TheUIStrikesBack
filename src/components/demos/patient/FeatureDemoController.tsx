"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MedicalGuide, SymptomExplainer } from '@/components/demos/patient/EducationWidgets';
import { Play, Activity } from 'lucide-react';

export const FeatureDemoController = () => {
    const [view, setView] = useState<'none' | 'guide' | 'explainer'>('none');

    return (
        <div className="space-y-6">
            <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100 items-center justify-center">
                <Button
                    variant={view === 'guide' ? 'default' : 'outline'}
                    onClick={() => setView('guide')}
                    className="flex gap-2"
                >
                    <Play className="w-4 h-4" /> Preview Medical Guide
                </Button>
                <Button
                    variant={view === 'explainer' ? 'default' : 'outline'}
                    onClick={() => setView('explainer')}
                    className="flex gap-2"
                >
                    <Activity className="w-4 h-4" /> Preview Symptom Explainer
                </Button>
            </div>

            <div className="min-h-[300px] flex items-center justify-center border-t border-slate-100 pt-6">
                {view === 'none' && (
                    <div className="text-center text-slate-400">
                        <p>Select a feature above to preview.</p>
                    </div>
                )}

                {view === 'guide' && (
                    <MedicalGuide
                        topic="How to Use an Inhaler"
                        difficulty="easy"
                        steps={[
                            { title: "Prepare the Inhaler", description: "Remove the cap and shake the inhaler hard.", image_prompt: "Hand shaking an inhaler device" },
                            { title: "Breathe Out", description: "Tilt your head back slightly and breathe out all the way.", image_prompt: "Person tilting head back and exhaling" },
                            { title: "Inhale", description: "Place the inhaler in your mouth. Press down on the canister while breathing in slowly and deeply.", image_prompt: "Person inhaling medication" },
                            { title: "Hold Breath", description: "Hold your breath for 10 seconds to allow medication to settle.", image_prompt: "Person holding breath with timer icon" }
                        ]}
                    />
                )}

                {view === 'explainer' && (
                    <SymptomExplainer
                        symptom="Migraine Headache"
                        severity="moderate"
                        possible_causes={["Stress", "Dehydration", "Lack of Sleep", "Eye Strain"]}
                        biological_context="Blood vessels in the brain expand and press on nerves, causing throbbing pain."
                        recommended_action="Rest in a dark, quiet room and drink water. Take prescribed medication if available."
                    />
                )}
            </div>
        </div>
    );
};
