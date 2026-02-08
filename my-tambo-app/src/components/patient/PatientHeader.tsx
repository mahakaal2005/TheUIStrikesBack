"use client";

import React from 'react';

interface PatientHeaderProps {
    name?: string;
    patientId?: string;
    status?: 'online' | 'offline' | 'away';
}

export function PatientHeader({
    name = "Alex Morgan",
    patientId = "#84920",
    status = 'online'
}: PatientHeaderProps) {
    const statusConfig = {
        online: {
            label: 'Online',
            color: 'bg-emerald-50 border-emerald-300 text-emerald-700',
            ariaLabel: 'Patient status: Online'
        },
        offline: {
            label: 'Offline',
            color: 'bg-slate-100 border-slate-300 text-slate-700',
            ariaLabel: 'Patient status: Offline'
        },
        away: {
            label: 'Away',
            color: 'bg-amber-50 border-amber-300 text-amber-700',
            ariaLabel: 'Patient status: Away'
        }
    };

    const currentStatus = statusConfig[status];
    const initials = name.split(' ').map(n => n[0]).join('');

    return (
        <header className="flex items-center justify-between" role="banner">
            <div className="flex items-center gap-3">
                {/* Avatar with initials */}
                <div className="relative" role="img" aria-label={`${name}'s avatar`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-sm">
                        {initials}
                    </div>
                    {status === 'online' && (
                        <div
                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"
                            aria-hidden="true"
                        />
                    )}
                </div>

                {/* Patient Info */}
                <div>
                    <h1 className="font-semibold text-slate-900 text-sm">{name}</h1>
                    <p className="text-xs text-slate-600">Patient ID: {patientId}</p>
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
