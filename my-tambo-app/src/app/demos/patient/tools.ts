import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";
import { Prescription, LabOrder, Symptom } from "@/contexts/HealthcareContext";
import { bodyMapSchema } from "@/components/demos/ehr/BodyMapSelector";

// Helper to read from localStorage since tools run outside React Context
const getStoredData = () => {
    if (typeof window === 'undefined') return { prescriptions: [], labOrders: [] };

    try {
        const rx = JSON.parse(localStorage.getItem('healthcare_prescriptions') || '[]');
        const labs = JSON.parse(localStorage.getItem('healthcare_lab_orders') || '[]');
        const symptoms = JSON.parse(localStorage.getItem('healthcare_symptoms') || '[]');
        return { prescriptions: rx as Prescription[], labOrders: labs as LabOrder[], symptoms: symptoms as Symptom[] };
    } catch (e) {
        return { prescriptions: [], labOrders: [], symptoms: [] };
    }
};

const saveSymptom = (symptom: Omit<Symptom, 'id' | 'recordedAt'>) => {
    if (typeof window === 'undefined') return;
    try {
        const currentData = getStoredData();
        const currentSymptoms = currentData.symptoms || [];
        const newSymptom: Symptom = {
            ...symptom,
            id: Math.random().toString(36).substring(7),
            recordedAt: new Date()
        };
        const newSymptoms = [newSymptom, ...currentSymptoms];
        localStorage.setItem('healthcare_symptoms', JSON.stringify(newSymptoms));

        // Dispatch storage event to notify other tabs/hooks
        window.dispatchEvent(new Event('storage'));
        return newSymptom;
    } catch (e) {
        console.error("Failed to save symptom", e);
        return null;
    }
}

export const getPatientPrescriptions = async () => {
    const { prescriptions } = getStoredData();
    // Return wrapped object to match MedicationList props
    return { medications: prescriptions };
};

export const getPatientLabResults = async () => {
    const { labOrders } = getStoredData();
    // Return wrapped object to match LabResultList props
    return { results: labOrders };
};

export const getPatientSymptoms = async () => {
    const { symptoms } = getStoredData();
    const currentSymptoms = symptoms || [];
    // Map internal symptom data to the visual BodyMap props
    const highlightedRegions = currentSymptoms.map(s => s.region.toLowerCase());
    return { highlightedRegions };
};

export const recordPatientSymptom = async (args: { region: string, description: string, severity: 'mild' | 'moderate' | 'severe' }) => {
    const result = await saveSymptom(args);
    if (!result) {
        return { success: false, message: "Failed to record symptom due to storage error." };
    }
    return { success: true, message: `Recorded ${args.severity} ${args.description} in ${args.region} region.` };
};

export const patientTools: TamboTool[] = [
    {
        name: "getMyPrescriptions",
        description: "Get the list of active prescriptions and medications for the current patient.",
        tool: getPatientPrescriptions,
        inputSchema: z.object({}), // No args needed for "my" data in this context
        outputSchema: z.object({
            medications: z.array(z.object({
                medicationName: z.string(),
                dosage: z.string(),
                instructions: z.string(),
                status: z.string()
            }))
        })
    },
    {
        name: "getMyLabResults",
        description: "Get the list of lab test results and orders for the current patient.",
        tool: getPatientLabResults,
        inputSchema: z.object({}),
        outputSchema: z.object({
            results: z.array(z.object({
                testName: z.string(),
                status: z.string(),
                results: z.array(z.object({
                    parameter: z.string(),
                    value: z.string(),
                    unit: z.string()
                })).optional()
            }))
        })
    },
    {
        name: "getMySymptoms",
        description: "Get the list of currently reported symptoms to display on the body map.",
        tool: getPatientSymptoms,
        inputSchema: z.object({}),
        outputSchema: bodyMapSchema
    },
    {
        name: "recordSymptom",
        description: "Record a new symptom or pain location for the patient.",
        tool: recordPatientSymptom,
        inputSchema: z.object({
            region: z.string().describe("The body region (e.g., head, chest, stomach, left_arm, etc.)"),
            description: z.string().describe("Description of the symptom (e.g., 'Thumping headache', 'Sharp pain')"),
            severity: z.enum(['mild', 'moderate', 'severe']).describe("Severity of the symptom")
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string()
        })
    }
];
