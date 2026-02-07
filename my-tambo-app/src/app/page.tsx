"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TamboProvider } from "@tambo-ai/react";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { components } from "@/lib/tambo";
import { z } from "zod";
import { Sparkles, Bot } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const mcpServers = useMcpServers();
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [targetPortal, setTargetPortal] = useState<string | null>(null);

  const universalTools = React.useMemo(() => [
    {
      name: "accessPortal",
      description: "Route the user to the correct healthcare portal based on their role or intent.",
      tool: async (input: { role: 'doctor' | 'patient' | 'lab' | 'pharmacy' }) => {
        setIsRedirecting(true);
        setTargetPortal(input.role);

        // Simulate a brief delay for effect before continuous routing
        setTimeout(() => {
          if (input.role === 'doctor') router.push('/demos/ehr');
          else if (input.role === 'patient') router.push('/demos/patient');
          else if (input.role === 'lab') router.push('/demos/lab');
          else if (input.role === 'pharmacy') router.push('/demos/pharmacy');
        }, 1500);

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
  ], [router]);

  if (!apiKey) return <div className="p-4 text-red-500">Missing API Key</div>;

  return (
    <TamboProvider
      apiKey={apiKey}
      components={components}
      tools={universalTools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
    >
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)] relative overflow-hidden">

        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <main className="max-w-2xl w-full p-8 z-10 relative flex flex-col h-[80vh]">

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 shadow-xl border border-white/10">
              <Bot className="w-10 h-10 text-indigo-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Nexus Health Gateway
            </h1>
            <p className="text-lg text-slate-400 max-w-lg mx-auto">
              I am the central intelligence for your healthcare ecosystem.
              <br />Tell me who you are or what you need.
            </p>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
          >
            {isRedirecting ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mb-6"
                />
                <h3 className="text-2xl font-bold text-white mb-2">Generating Interface...</h3>
                <p className="text-slate-400">Configuring the {targetPortal} portal for your session.</p>
              </div>
            ) : (
              <MessageThreadFull className="h-full" />
            )}
          </motion.div>

        </main>

        <footer className="py-8 text-slate-600 text-sm z-10">
          Powered by Tambo AI & Next.js
        </footer>
      </div>
    </TamboProvider>
  );
}
