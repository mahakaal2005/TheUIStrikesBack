'use client';

import React from 'react';
import { PainScaleSlider, BreathingCounter, ImageUploadDropzone } from './IntakeWidgets';
import { withInteractable } from '@tambo-ai/react';
import { z } from 'zod';
import { useHealthcare } from '@/contexts/HealthcareContext';
import { recordPatientSymptom } from '@/app/demos/patient/tools';

// NUCLEAR OPTION: Use z.any() for widgetType to strictly avoid prop validation failures.
// The component internal logic will handle the "safety" by normalizing inputs.
export const adaptiveIntakeSchema = z.object({
    widgetType: z.any().describe("The type of widget to display. Inferred from context if missing or fuzzy."),
    contextLabel: z.string().optional().describe("Contextual label or question for the widget (e.g. 'Rate your chest pain')"),
    region: z.string().optional().describe("Associated body region for the symptom, if known")
});

type AdaptiveIntakeProps = z.infer<typeof adaptiveIntakeSchema>;

export const AdaptiveIntakeFormBase = ({ widgetType, contextLabel, region }: AdaptiveIntakeProps) => {
    // Normalize widgetType to be robust against AI hallucination or missing prop
    const normalizedType = (() => {
        // Fallback Strategy:
        // 1. Convert widgetType to string (in case undefined/null/object)
        // 2. Concatenate with contextLabel for context clues
        // 3. Fuzzy match against known types
        const typeInput = widgetType ? String(widgetType) : '';
        const input = (typeInput + ' ' + (contextLabel || '')).toLowerCase();

        console.log('[AdaptiveIntake] Normalizing:', { widgetType, contextLabel, input });

        if (input.includes('pain') || input.includes('scale') || input.includes('rate')) return 'pain_scale';
        if (input.includes('breath') || input.includes('counter')) return 'breathing_counter';
        // Expanded keywords for image upload
        if (input.includes('image') || input.includes('upload') || input.includes('photo') || input.includes('rash') || input.includes('wound') || input.includes('skin')) return 'image_upload';

        // Return original if no match (will hit fallback)
        return typeInput.toLowerCase().trim();
    })();

    const handlePainRecord = async (val: number) => {
        // Optimistically record to context/storage if we have region info
        if (region) {
            // Mapping numeric 0-10 to mild/moderate/severe approximation
            let severity: 'mild' | 'moderate' | 'severe' = 'mild';
            if (val > 3) severity = 'moderate';
            if (val > 7) severity = 'severe';

            // We can call the tool directly or use context
            // Using tool ensures consistent behavior with "recordSymptom"
            await recordPatientSymptom({
                region: region.toLowerCase(),
                description: `Pain Level ${val}/10`,
                severity
            });
        }
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {contextLabel && (
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">{contextLabel}</p>
            )}

            {normalizedType === 'pain_scale' && (
                <PainScaleSlider onValueChange={handlePainRecord} />
            )}

            {normalizedType === 'breathing_counter' && (
                <BreathingCounter />
            )}

            {normalizedType === 'image_upload' && (
                <ImageUploadDropzone label={contextLabel || "Upload Photo"} />
            )}

            {/* Fallback for completely unknown types/debug */}
            {!['pain_scale', 'breathing_counter', 'image_upload'].includes(normalizedType) && (
                <div className="p-4 bg-yellow-50 text-yellow-700 text-xs rounded border border-yellow-100">
                    <p className="font-bold">Widget Info</p>
                    <p>AI did not specify a known widget type.</p>
                    <p className="font-mono text-[10px] mt-1">Raw: {JSON.stringify(widgetType)}</p>
                    <p className="font-mono text-[10px]">Norm: {normalizedType}</p>
                </div>
            )}
        </div>
    );
};

export const AdaptiveIntakeForm = withInteractable(AdaptiveIntakeFormBase, {
    componentName: "AdaptiveIntakeForm",
    description: "A dynamic container that renders specific intake widgets (Pain Scale, Breathing Counter, Image Upload) based on the patient's context.",
    propsSchema: adaptiveIntakeSchema
});
