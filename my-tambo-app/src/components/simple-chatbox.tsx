"use client";

import React, { useState } from "react";
import { Mic, Send } from "lucide-react";
import { motion } from "framer-motion";

interface SimpleChatboxProps {
    onSubmit: (message: string) => void;
    placeholder?: string;
}

export function SimpleChatbox({ onSubmit, placeholder = "Type your message or speak..." }: SimpleChatboxProps) {
    const [message, setMessage] = useState("");
    const [isListening, setIsListening] = useState(false);

    const handleSubmit = () => {
        if (message.trim()) {
            onSubmit(message);
            setMessage("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const startVoiceInput = () => {
        // Check if browser supports speech recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser doesn't support voice input. Please use Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setMessage(transcript);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                <div className="p-6">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="w-full bg-white/5 text-white placeholder-slate-400 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                        rows={4}
                    />
                </div>

                <div className="px-6 pb-6 flex items-center justify-between">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startVoiceInput}
                        disabled={isListening}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${isListening
                                ? 'bg-red-500 text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                        <span className="text-sm font-medium">
                            {isListening ? 'Listening...' : 'Voice Input'}
                        </span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmit}
                        disabled={!message.trim()}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium"
                    >
                        <span>Send</span>
                        <Send className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
