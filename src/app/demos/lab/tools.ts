import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";
import { LabOrder } from "@/contexts/HealthcareContext";

/**
 * Lab Portal Tools
 * These tools allow the AI to control the Lab Dashboard based on user intent.
 */

export const labTools: TamboTool[] = [
    {
        name: "findPendingOrders",
        description: "List all lab orders that correspond to a specific status (default: 'ordered') or urgency. Use this when the user asks 'What's next?', 'Show pending', or 'Any STAT orders?'.",
        tool: async (input) => {
            // In a real app, this would fetch from an API. 
            // Here, we return a structured object that the AI can use to generate a response.
            // The actual filtering happens in the UI via the `useHealthcare` context, 
            // so we mostly need to acknowledge the intent or return mock data if the AI needs it to speak.
            return {
                action: "filter_queue",
                status: input.status || 'ordered',
                urgency: input.urgency
            };
        },
        inputSchema: z.object({
            status: z.enum(['ordered', 'processing', 'completed', 'cancelled']).optional().describe("Filter by order status"),
            urgency: z.enum(['routine', 'stat', 'urgent']).optional().describe("Filter by urgency level")
        }),
        outputSchema: z.any()
    },
    {
        name: "selectOrder",
        description: "Select a specific lab order to open its result entry form. Use this when the user says 'Open the CBC for Alex' or 'Process order #123'.",
        tool: async (input) => {
            return {
                action: "select_order",
                query: input.query
            };
        },
        inputSchema: z.object({
            query: z.string().describe("The ID, patient name, or test name to search for.")
        }),
        outputSchema: z.any()
    },
    {
        name: "analyzeTrend",
        description: "Open the trend analysis view for a specific test type or patient history. Use when user asks 'Show history' or 'Trend for Glucose'.",
        tool: async (input) => {
            return {
                action: "view_trend",
                testName: input.testType
            };
        },
        inputSchema: z.object({
            testType: z.string().describe("The name of the test to analyze trends for (e.g. 'Glucose', 'Hemoglobin')")
        }),
        outputSchema: z.any()
    }
];
