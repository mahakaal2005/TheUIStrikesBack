'use client';

import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider"; // Assuming Shadcn UI or simple HTML input
import { cn } from "@/lib/utils";
import { Camera, Image as ImageIcon, Timer, Upload, X } from 'lucide-react';

// --- Pain Scale Slider ---

interface PainScaleProps {
    initialValue?: number;
    onValueChange?: (value: number) => void;
}

export const PainScaleSlider = ({ initialValue = 0, onValueChange }: PainScaleProps) => {
    const [value, setValue] = useState(initialValue);

    const getEmojiConfig = (v: number) => {
        if (v === 0) return { emoji: "😊", label: "No Pain", color: "text-emerald-500" };
        if (v <= 3) return { emoji: "🙂", label: "Mild", color: "text-green-500" };
        if (v <= 6) return { emoji: "😐", label: "Moderate", color: "text-yellow-500" };
        if (v <= 8) return { emoji: "😣", label: "Severe", color: "text-orange-500" };
        return { emoji: "😭", label: "Worst Possible", color: "text-red-500" };
    };

    const config = getEmojiConfig(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = parseInt(e.target.value);
        setValue(newVal);
        onValueChange?.(newVal);
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Rate Your Pain</h3>

            <div className="flex flex-col items-center justify-center mb-6">
                <span className="text-6xl mb-2 animate-bounce-subtle transition-all duration-300 transform scale-110">
                    {config.emoji}
                </span>
                <span className={cn("text-xl font-bold transition-colors", config.color)}>
                    {value} - {config.label}
                </span>
            </div>

            <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={value}
                onChange={handleChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />

            <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                <span>0</span>
                <span>5</span>
                <span>10</span>
            </div>
        </div>
    );
};


// --- Breathing Counter ---

interface BreathingCounterProps {
    onComplete?: (rate: number) => void;
}

export const BreathingCounter = ({ onComplete }: BreathingCounterProps) => {
    const [taps, setTaps] = useState<number[]>([]);
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15); // Measure for 15 seconds

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            // Calculate rate per minute (taps * 4) assuming 15s window
            const rate = taps.length * 4;
            onComplete?.(rate);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, taps.length, onComplete]);

    const handleTap = () => {
        if (!isActive && timeLeft === 15) {
            setIsActive(true);
        }
        if (isActive) {
            setTaps(prev => [...prev, Date.now()]);
        }
    };

    const reset = () => {
        setIsActive(false);
        setTimeLeft(15);
        setTaps([]);
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Breathing Rate Check</h3>
            <p className="text-sm text-slate-500 mb-6">Tap the button for each breath you take.</p>

            <div className="flex justify-center mb-6">
                <div className={cn("w-20 h-20 rounded-full flex items-center justify-center border-4 text-2xl font-mono font-bold transition-all",
                    isActive ? "border-blue-500 text-blue-600" : "border-slate-200 text-slate-400"
                )}>
                    {timeLeft}s
                </div>
            </div>

            {timeLeft === 0 ? (
                <div className="mb-6">
                    <p className="text-sm text-slate-500">Estimated Rate:</p>
                    <p className="text-4xl font-bold text-slate-800">{taps.length * 4} <span className="text-base font-normal text-slate-400">breaths/min</span></p>
                    <button onClick={reset} className="text-blue-600 text-sm font-medium mt-2 hover:underline">Try Again</button>
                </div>
            ) : (
                <button
                    onClick={handleTap}
                    className={cn("w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95",
                        isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700" : "bg-blue-600 text-white"
                    )}
                >
                    {isActive ? "TAP NOW" : "START TAPPING"}
                </button>
            )}
        </div>
    );
};


// --- Image Dropzone ---

interface ImageDropzoneProps {
    label?: string;
    onUpload?: (file: File) => void;
}

export const ImageUploadDropzone = ({ label = "Upload Photo", onUpload }: ImageDropzoneProps) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                onUpload?.(file);
            }
            reader.readAsDataURL(file);
        }
    };

    const clear = () => setPreview(null);

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{label}</h3>

            {preview ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-video flex items-center justify-center">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    <button onClick={clear} className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full backdrop-blur-sm transition-colors">
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
                        <Upload size={32} className="mb-2" />
                        <p className="text-sm font-medium mb-1">Click to upload or drag & drop</p>
                        <p className="text-xs text-slate-400">SVG, PNG, JPG (Max 5MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
                </label>
            )}
        </div>
    );
};
