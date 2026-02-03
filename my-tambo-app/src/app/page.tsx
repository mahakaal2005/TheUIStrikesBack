"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Activity, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl w-full p-8 space-y-12">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <Image
              src="/Octo-Icon.svg"
              alt="Tambo AI Logo"
              width={80}
              height={80}
              className="mb-0"
            />
          </div>

          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
            Zero-Click EHR Scribe
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl">
            A Generative UI demo for the Tambo Hackathon. Experience the future of medical charting where the interface adapts to the conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Demo Card */}
          <Link href="/demos/ehr" className="group">
            <div className="bg-white h-full p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="text-blue-600 w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Launch Demo</h2>
              <p className="text-slate-500 mb-8">
                Enter the EHR Scribe interface. Simulate a patient encounter and watch the chart build itself.
              </p>
              <div className="mt-auto flex items-center text-blue-600 font-medium">
                Start Scenarios <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Documentation/Info Card */}
          <Link href="https://github.com/mahakaal2005/TheUIStrikesBack" target="_blank" className="group">
            <div className="bg-white h-full p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="text-slate-600 w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">View Source</h2>
              <p className="text-slate-500 mb-8">
                Check out the code, PRD, and implementation details on GitHub.
              </p>
              <div className="mt-auto flex items-center text-slate-600 font-medium">
                Open Repository <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </main>

      <footer className="py-8 text-slate-400 text-sm">
        Built with Tambo AI SDK & Next.js
      </footer>
    </div>
  );
}
