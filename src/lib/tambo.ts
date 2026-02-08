/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";
import { PatientVitalsCard, patientVitalsSchema } from "@/components/demos/ehr/PatientVitalsCard";
import { BodyMapSelector, bodyMapSchema } from "@/components/demos/ehr/BodyMapSelector";
import { PrescriptionPad, prescriptionPadSchema } from "@/components/demos/ehr/PrescriptionPad";
import { LivingTreatmentTimeline, timelineSchema } from "@/components/demos/ehr/LivingTreatmentTimeline";
import { AdaptiveIntakeForm, adaptiveIntakeSchema } from "@/components/demos/patient/AdaptiveIntakeForm";
import { MedicalGuide, SymptomExplainer } from '@/components/demos/patient/EducationWidgets';
import { LabResultList, labResultListSchema } from "@/components/demos/patient/LabResultList";
import { MedicalImageAnalyzer, medicalImageAnalyzerSchema } from "@/components/demos/patient/MedicalImageAnalyzer";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "countryPopulation",
    description:
      "A tool to get population statistics by country with advanced filtering options",
    tool: getCountryPopulations,
    inputSchema: z.object({
      continent: z.string().optional(),
      sortBy: z.enum(["population", "growthRate"]).optional(),
      limit: z.number().optional(),
      order: z.enum(["asc", "desc"]).optional(),
    }),
    outputSchema: z.array(
      z.object({
        countryCode: z.string(),
        countryName: z.string(),
        continent: z.enum([
          "Asia",
          "Africa",
          "Europe",
          "North America",
          "South America",
          "Oceania",
        ]),
        population: z.number(),
        year: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "globalPopulation",
    description:
      "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        year: z.number(),
        population: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  // Add more tools here
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Supports customizable data visualization with labels, datasets, and styling options.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as clickable cards with links and summaries with the ability to select multiple items.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  {
    name: "PatientVitalsCard",
    description: "Display the patient's vital signs including heart rate, blood pressure, temperature, and oxygen saturation.",
    component: PatientVitalsCard,
    propsSchema: patientVitalsSchema,
  },
  {
    name: "BodyMapSelector",
    description: "Visual body map to highlight regions where the patient is experiencing symptoms or pain.",
    component: BodyMapSelector,
    propsSchema: bodyMapSchema,
  },
  {
    name: "PrescriptionPad",
    description: "A prescription form to draft, review, and sign medication orders.",
    component: PrescriptionPad,
    propsSchema: prescriptionPadSchema,
  },
  {
    name: "LivingTreatmentTimeline",
    description: "Visualizes the patient's vitals (heart rate, BP) over time along with medical events like prescriptions and lab results.",
    component: LivingTreatmentTimeline,
    propsSchema: timelineSchema,
  },
  {
    name: "AdaptiveIntakeForm",
    description: "A dynamic container that renders specific intake widgets (Pain Scale, Breathing Counter, Image Upload) based on the patient's context.",
    component: AdaptiveIntakeForm,
    propsSchema: adaptiveIntakeSchema,
  },
  {
    name: "MedicalGuide",
    description: "Display a step-by-step interactive medical guide or instruction set (e.g. 'How to use an inhaler', 'Preparation for X-ray').",
    component: MedicalGuide,
    propsSchema: z.object({
      topic: z.string().optional().describe("The topic of the guide (e.g. 'Using an Inhaler')"),
      difficulty: z.enum(['easy', 'medium', 'hard']).optional().describe("Complexity level"),
      steps: z.array(z.object({
        title: z.string().optional().describe("Title of the step"),
        description: z.string().optional().describe("Detailed instruction for this step"),
        image_prompt: z.string().optional().describe("A visual description of what this step looks like (for potential generation)")
      })).optional().describe("List of sequential steps")
    })
  },
  {
    name: "SymptomExplainer",
    description: "Educational card explaining a symptom, its causes, and biological context. Use when user asks 'Why does my head hurt?' or 'What is this rash?'.",
    component: SymptomExplainer,
    propsSchema: z.object({
      symptom: z.string().optional().describe("The name of the symptom"),
      severity_level: z.enum(['low', 'medium', 'high']).optional().describe("General severity assessment"),
      possible_causes: z.array(z.string()).optional().describe("List of 3-5 potential common causes"),
      biological_context: z.string().optional().describe("A simple, one-sentence explanation of the biological mechanism (e.g. 'Inflammation causes blood vessels to swell...')"),
      recommended_action: z.string().optional().describe("Immediate advice (e.g. 'Rest and hydrate', 'See a doctor')")
    })
  },
  {
    name: "LabResultList",
    description: "Displays a list of laboratory test results with status and trend indicators (up/down).",
    component: LabResultList,
    propsSchema: labResultListSchema,
  },
  {
    name: "MedicalImageAnalyzer",
    description: "An AI-powered tool to analyze uploaded medical images (X-rays, skin lesions, etc.) and provide clinical insights.",
    component: MedicalImageAnalyzer,
    propsSchema: medicalImageAnalyzerSchema,
  },
  // Add more components here
];
