import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * Pharmacy Portal Tools
 */

export const pharmacyTools: TamboTool[] = [
    {
        name: "checkQueue",
        description: "List prescriptions waiting in the Intake Queue. Use when asked 'What's in the queue?' or 'Show me pending scripts'.",
        tool: async (input) => {
            return {
                action: "check_queue",
                status: "pending"
            };
        },
        inputSchema: z.object({
            filter: z.string().optional().describe("Optional filter keyword")
        }),
        outputSchema: z.any()
    },
    {
        name: "inspectPrescription",
        description: "Select and open a specific prescription for verification. Use when asked 'Process the Amoxicillin' or 'Open script #123'.",
        tool: async (input) => {
            return {
                action: "inspect_prescription",
                query: input.query
            };
        },
        inputSchema: z.object({
            query: z.string().describe("The ID, medication name, or patient ID to search for.")
        }),
        outputSchema: z.any()
    },
    {
        name: "runSafetyCheck",
        description: "Trigger the clinical safety check (DDI, allergy) for the currently selected prescription. Use when asked 'Is this safe?' or 'Run checks'.",
        tool: async (input) => {
            return {
                action: "run_safety_check"
            };
        },
        inputSchema: z.object({
            confirm: z.boolean().optional()
        }),
        outputSchema: z.any()
    }
];
