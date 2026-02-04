"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- Types ---

export type PrescriptionStatus = 'pending' | 'ready_for_pickup' | 'picked_up';

export interface Prescription {
    id: string;
    patientId: string;
    medicationName: string;
    dosage: string;
    instructions: string;
    status: PrescriptionStatus;
    prescribedAt: Date;
    filledAt?: Date;
}

export type LabOrderStatus = 'ordered' | 'processing' | 'completed';

export interface LabResult {
    parameter: string;
    value: string;
    unit: string;
    range: string;
    flag?: 'high' | 'low' | 'normal';
}

export interface LabOrder {
    id: string;
    patientId: string;
    testName: string;
    status: LabOrderStatus;
    orderedAt: Date;
    completedAt?: Date;
    results?: LabResult[];
    notes?: string;
}

export interface Symptom {
    id: string;
    region: string; // e.g., 'head', 'chest'
    description: string;
    severity?: 'mild' | 'moderate' | 'severe';
    recordedAt: Date;
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
}

interface HealthcareContextType {
    activePatient: Patient;
    prescriptions: Prescription[];
    labOrders: LabOrder[];
    activeSymptoms: Symptom[];
    addPrescription: (prescription: Omit<Prescription, 'id' | 'status' | 'prescribedAt'>) => void;
    updatePrescriptionStatus: (id: string, status: PrescriptionStatus) => void;
    addLabOrder: (order: Omit<LabOrder, 'id' | 'status' | 'orderedAt'>) => void;
    updateLabOrder: (id: string, updates: Partial<LabOrder>) => void;
    addSymptom: (symptom: Omit<Symptom, 'id' | 'recordedAt'>) => void;
    resolveSymptom: (id: string) => void;
}

// --- Context ---

const HealthcareContext = createContext<HealthcareContextType | undefined>(undefined);

// --- Provider ---

const DEMO_PATIENT: Patient = {
    id: 'p-123',
    name: 'Alex Morgan',
    age: 42,
    gender: 'Female'
};

export function HealthcareProvider({ children }: { children: ReactNode }) {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
    const [activeSymptoms, setActiveSymptoms] = useState<Symptom[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial load from localStorage
    React.useEffect(() => {
        const loadState = () => {
            try {
                const storedRx = localStorage.getItem('healthcare_prescriptions');
                const storedLabs = localStorage.getItem('healthcare_lab_orders');
                const storedSx = localStorage.getItem('healthcare_symptoms');

                if (storedRx) {
                    setPrescriptions(JSON.parse(storedRx, (key, value) =>
                        key.endsWith('At') ? new Date(value) : value
                    ));
                }
                if (storedLabs) {
                    setLabOrders(JSON.parse(storedLabs, (key, value) =>
                        key.endsWith('At') ? new Date(value) : value
                    ));
                }
                if (storedSx) {
                    setActiveSymptoms(JSON.parse(storedSx, (key, value) =>
                        key.endsWith('At') ? new Date(value) : value
                    ));
                }
            } catch (e) {
                console.error("Failed to load healthcare state", e);
            }
            setIsInitialized(true);
        };
        loadState();

        // Listen for storage events (cross-tab sync)
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'healthcare_prescriptions' || e.key === 'healthcare_lab_orders' || e.key === 'healthcare_symptoms') {
                loadState();
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const savePrescriptions = (newRx: Prescription[]) => {
        setPrescriptions(newRx);
        localStorage.setItem('healthcare_prescriptions', JSON.stringify(newRx));
        // Force storage event for current tab (optional, but good practice if needed locally, though storage event is usually other tabs)
        // actually storage event only fires on other tabs.
    };

    const saveLabOrders = (newLabs: LabOrder[]) => {
        setLabOrders(newLabs);
        localStorage.setItem('healthcare_lab_orders', JSON.stringify(newLabs));
    };

    const saveSymptoms = (newSx: Symptom[]) => {
        setActiveSymptoms(newSx);
        localStorage.setItem('healthcare_symptoms', JSON.stringify(newSx));
    };

    const addPrescription = (data: Omit<Prescription, 'id' | 'status' | 'prescribedAt'>) => {
        const newPrescription: Prescription = {
            ...data,
            id: crypto.randomUUID(),
            status: 'pending',
            prescribedAt: new Date(),
        };
        savePrescriptions([newPrescription, ...prescriptions]);
        // Dispath custom event for local tab updates if needed, but react state handles local tab.
        // We might want to dispatch storage event manually for other tabs if we were using a single page app pattern, 
        // but here multiple tabs rely on 'storage' event which fires automatically on setItem.
    };

    const updatePrescriptionStatus = (id: string, status: PrescriptionStatus) => {
        const updated = prescriptions.map(p =>
            p.id === id ? { ...p, status, filledAt: status === 'ready_for_pickup' ? new Date() : p.filledAt } : p
        );
        savePrescriptions(updated);
    };

    const addLabOrder = (data: Omit<LabOrder, 'id' | 'status' | 'orderedAt'>) => {
        const newOrder: LabOrder = {
            ...data,
            id: crypto.randomUUID(),
            status: 'ordered',
            orderedAt: new Date(),
        };
        saveLabOrders([newOrder, ...labOrders]);
    };

    const updateLabOrder = (id: string, updates: Partial<LabOrder>) => {
        const updated = labOrders.map(o =>
            o.id === id ? { ...o, ...updates } : o
        );
        saveLabOrders(updated);
    };

    const addSymptom = (data: Omit<Symptom, 'id' | 'recordedAt'>) => {
        const newSymptom: Symptom = {
            ...data,
            id: crypto.randomUUID(),
            recordedAt: new Date(),
        };
        saveSymptoms([newSymptom, ...activeSymptoms]);
    };

    const resolveSymptom = (id: string) => {
        const updated = activeSymptoms.filter(s => s.id !== id);
        saveSymptoms(updated);
    };

    if (!isInitialized) return null; // Prevent hydration mismatch

    return (
        <HealthcareContext.Provider value={{
            activePatient: DEMO_PATIENT,
            prescriptions,
            labOrders,
            activeSymptoms,
            addPrescription,
            updatePrescriptionStatus,
            addLabOrder,
            updateLabOrder,
            addSymptom,
            resolveSymptom,
        }}>
            {children}
        </HealthcareContext.Provider>
    );
}

// --- Hook ---

export function useHealthcare() {
    const context = useContext(HealthcareContext);
    if (context === undefined) {
        throw new Error('useHealthcare must be used within a HealthcareProvider');
    }
    return context;
}
