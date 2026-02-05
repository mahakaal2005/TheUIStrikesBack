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


export interface VitalEntry {
    id: string;
    patientId: string;
    type: 'heart_rate' | 'blood_pressure' | 'temperature' | 'oxygen_sat';
    value: number; // Normalized numeric value
    meta?: string; // Original string value if needed (e.g. "120/80")
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
    vitalsHistory: VitalEntry[];
    addPrescription: (prescription: Omit<Prescription, 'id' | 'status' | 'prescribedAt'>) => void;
    updatePrescriptionStatus: (id: string, status: PrescriptionStatus) => void;
    addLabOrder: (order: Omit<LabOrder, 'id' | 'status' | 'orderedAt'>) => void;
    updateLabOrder: (id: string, updates: Partial<LabOrder>) => void;
    addSymptom: (symptom: Omit<Symptom, 'id' | 'recordedAt'>) => void;
    resolveSymptom: (id: string) => void;
    addVitalEntry: (entry: Omit<VitalEntry, 'id' | 'recordedAt'>) => void;
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
    const [vitalsHistory, setVitalsHistory] = useState<VitalEntry[]>([]);
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

                const storedVitals = localStorage.getItem('healthcare_vitals');
                if (storedVitals) {
                    setVitalsHistory(JSON.parse(storedVitals, (key, value) =>
                        key.endsWith('At') ? new Date(value) : value
                    ));
                } else {
                    // Seed initial mock data for demo if empty
                    const now = new Date();
                    const mockVitals: VitalEntry[] = [];
                    for (let i = 6; i >= 0; i--) {
                        const date = new Date(now);
                        date.setDate(date.getDate() - i);
                        // Mock BP
                        mockVitals.push({
                            id: `bp-${i}`, patientId: 'p-123', type: 'blood_pressure', value: 115 + Math.floor(Math.random() * 15), meta: '120/80', recordedAt: date
                        });
                        // Mock HR
                        mockVitals.push({
                            id: `hr-${i}`, patientId: 'p-123', type: 'heart_rate', value: 65 + Math.floor(Math.random() * 20), recordedAt: date
                        });
                    }
                    saveVitals(mockVitals);
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

    const saveVitals = (newVitals: VitalEntry[]) => {
        setVitalsHistory(newVitals);
        localStorage.setItem('healthcare_vitals', JSON.stringify(newVitals));
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

    const addVitalEntry = (data: Omit<VitalEntry, 'id' | 'recordedAt'>) => {
        const newEntry: VitalEntry = {
            ...data,
            id: crypto.randomUUID(),
            recordedAt: new Date(),
        };
        saveVitals([...vitalsHistory, newEntry]);
    };

    // if (!isInitialized) return null; // Removed to allow SSR rendering

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
            addVitalEntry,
            vitalsHistory,
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
