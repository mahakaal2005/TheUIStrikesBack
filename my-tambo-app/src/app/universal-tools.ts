import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

export const universalTools: TamboTool[] = [
    {
        name: "accessPortal",
        description: "Route the user to the correct healthcare portal based on their role or intent.",
        tool: async (input) => {
            return {
                action: "redirect",
                target: input.role,
                message: `Redirecting you to the ${input.role} portal...`
            };
        },
        inputSchema: z.object({
            role: z.enum(['doctor', 'patient', 'lab', 'pharmacy']).describe("The user's role or the intent of the portal they need.")
        }),
        outputSchema: z.any()
    }
];
