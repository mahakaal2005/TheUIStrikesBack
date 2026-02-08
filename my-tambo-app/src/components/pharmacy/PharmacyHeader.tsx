"use client";

import React from 'react';

interface PharmacyHeaderProps {
    pharmacistName?: string;
    licenseNumber?: string;
    pendingRx?: number;
    status?: 'online' | 'offline' | 'away';
}

export function PharmacyHeader({
    pharmacistName = "Emma Wilson",
    licenseNumber = "RPh-125847",
    pendingRx = 0,
    status = 'online'
}: PharmacyHeaderProps) {
    const statusConfig = {
        online: {
            label: 'Active',
            color: 'bg-emerald-50 border-emerald-300 text-emerald-700',
            ariaLabel: 'Pharmacist status: Active'
        },
        offline: {
            label: 'Offline',
            color: 'bg-slate-100 border-slate-300 text-slate-700',
            ariaLabel: 'Pharmacist status: Offline'
        },
        away: {
            label: 'Consulting',
            color: 'bg-amber-50 border-amber-300 text-amber-700',
            ariaLabel: 'Pharmacist status: Consulting'
        }
    };

    const currentStatus = statusConfig[status];
    const initials = pharmacistName.split(' ').map(n => n[0]).join('');

    return (
        <header className="flex items-center justify-between" role="banner">
            <div className="flex items-center gap-3">
                {/* Pharmacist Avatar */}
                <div className="relative" role="img" aria-label={`${pharmacistName}'s avatar`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-sm">
                        {initials}
                    </div>
                    {status === 'online' && (
                        <div
                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"
                            aria-hidden="true"
                        />
                    )}
                </div>

                {/* Pharmacist Info */}
                <div>
                    <h1 className="font-semibold text-slate-900 text-sm">{pharmacistName}</h1>
                    <p className="text-xs text-slate-600">{licenseNumber} • {pendingRx} pending Rx</p>
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
