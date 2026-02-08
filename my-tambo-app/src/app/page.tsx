"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SimpleChatbox } from "@/components/simple-chatbox";
import { Bot } from "lucide-react";
import { motion } from "framer-motion";

// Keyword lists for smart routing
const SYMPTOM_KEYWORDS = [
  'headache', 'pain', 'fever', 'nausea', 'dizzy', 'cough', 'cold', 'flu',
  'sick', 'hurt', 'ache', 'sore', 'bleeding', 'injury', 'vomit', 'rash',
  'swelling', 'fatigue', 'tired', 'weak', 'chest pain', 'stomach', 'migraine'
];

const LAB_KEYWORDS = ['lab', 'test', 'blood work', 'specimen', 'results', 'analysis'];
const PHARMACY_KEYWORDS = ['prescription', 'medication', 'pharmacy', 'refill', 'drug'];
const DOCTOR_KEYWORDS = ['doctor', 'physician', 'clinical', 'ehr', 'patient encounter', 'chart'];

export default function Home() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [targetPortal, setTargetPortal] = useState<string>('patient');

  // Determine which portal to route to based on message content
  const determinePortal = useCallback((message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (SYMPTOM_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
      return 'patient';
    } else if (LAB_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
      return 'lab';
    } else if (PHARMACY_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
      return 'pharmacy';
    } else if (DOCTOR_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
      return 'doctor';
    }

    // Default to patient portal
    return 'patient';
  }, []);

  // Handle message submission
  const handleSubmit = useCallback((message: string) => {
    // Determine target portal
    const portal = determinePortal(message);
    setTargetPortal(portal);

    // Show loading screen
    setIsRedirecting(true);

    // Store the user's message in sessionStorage so the portal can use it
    sessionStorage.setItem('userMessage', message);
    sessionStorage.setItem('targetPortal', portal);

    // Route immediately
    requestAnimationFrame(() => {
      if (portal === 'doctor') router.push('/demos/ehr');
      else if (portal === 'patient') router.push('/demos/patient');
      else if (portal === 'lab') router.push('/demos/lab');
      else if (portal === 'pharmacy') router.push('/demos/pharmacy');
    });
  }, [router, determinePortal]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)] relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="max-w-4xl w-full p-8 z-10 relative">

        {isRedirecting ? (
          // Loading Screen
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center text-center min-h-[400px]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full mb-8"
            />
            <h3 className="text-3xl font-bold text-white mb-3">Generating Interface...</h3>
            <p className="text-slate-400 text-lg">Configuring the {targetPortal} portal for your session.</p>
          </motion.div>
        ) : (
          // Main Interface
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 shadow-xl border border-white/10">
                <Bot className="w-12 h-12 text-indigo-400" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
                Nexus Health Gateway
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Your intelligent healthcare companion.
                <br />
                Tell me what you need, and I'll guide you to the right place.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <SimpleChatbox
                onSubmit={handleSubmit}
                placeholder="Describe your symptoms, ask about lab results, or tell me what you need..."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 text-center"
            >
              <p className="text-slate-500 text-sm">
                Powered by Tambo AI & Next.js
              </p>
            </motion.div>
          </>
        )}

      </main>
    </div>
  );
}
