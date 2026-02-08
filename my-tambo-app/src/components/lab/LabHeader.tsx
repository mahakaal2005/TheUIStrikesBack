"use client";

import React from 'react';

interface LabHeaderProps {
    technicianName?: string;
    department?: string;
    pendingTests?: number;
    status?: 'online' | 'offline' | 'away';
}

export function LabHeader({
    technicianName = "Mike Rodriguez",
    department = "Clinical Laboratory",
    pendingTests = 0,
    status = 'online'
}: LabHeaderProps) {
    const statusConfig = {
        online: {
            label: 'Active',
            color: 'bg-emerald-50 border-emerald-300 text-emerald-700',
            ariaLabel: 'Lab tech status: Active'
        },
        offline: {
            label: 'Offline',
            color: 'bg-slate-100 border-slate-300 text-slate-700',
            ariaLabel: 'Lab tech status: Offline'
        },
        away: {
            label: 'Break',
            color: 'bg-amber-50 border-amber-300 text-amber-700',
            ariaLabel: 'Lab tech status: On Break'
        }
    };

    const currentStatus = statusConfig[status];
    const initials = technicianName.split(' ').map(n => n[0]).join('');

    return (
        <header className="flex items-center justify-between" role="banner">
            <div className="flex items-center gap-3">
                {/* Tech Avatar */}
                <div className="relative" role="img" aria-label={`${technicianName}'s avatar`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                        {initials}
                    </div>
                    {status === 'online' && (
                        <div
                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"
                            aria-hidden="true"
                        />
                    )}
                </div>

                {/* Tech Info */}
                <div>
                    <h1 className="font-semibold text-slate-900 text-sm">{technicianName}</h1>
                    <p className="text-xs text-slate-600">{department} • {pendingTests} pending tests</p>
                </div>
            </div>

            {/* Status Badge */}
            <span
                className={`px-3 py-1 border rounded-full text-xs font-semibold ${currentStatus.color}`}
                role="status"
                aria-label={currentStatus.ariaLabel}
            >
                {currentStatus.label}
            </span>
        </header>
    );
}
