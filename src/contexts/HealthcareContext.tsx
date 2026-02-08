"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as dbActions from '@/app/actions/db-actions';

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
    isLoading: boolean;
    addPrescription: (prescription: Omit<Prescription, 'id' | 'status' | 'prescribedAt'>) => Promise<void>;
    updatePrescriptionStatus: (id: string, status: PrescriptionStatus) => Promise<void>;
    addLabOrder: (order: Omit<LabOrder, 'id' | 'status' | 'orderedAt'>) => Promise<void>;
    updateLabOrder: (id: string, updates: Partial<LabOrder>) => Promise<void>;
    addSymptom: (symptom: Omit<Symptom, 'id' | 'recordedAt'>) => Promise<void>;
    resolveSymptom: (id: string) => Promise<void>;
    addVitalEntry: (entry: Omit<VitalEntry, 'id' | 'recordedAt'>) => Promise<void>;
}

// --- Context ---

const HealthcareContext = createContext<HealthcareContextType | undefined>(undefined);

// --- Provider ---

const DEMO_PATIENT: Patient = {
    id: 'p-alex',
    name: 'Alex Morgan',
    age: 42,
    gender: 'Female'
};

export function HealthcareProvider({ children }: { children: ReactNode }) {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
    const [activeSymptoms, setActiveSymptoms] = useState<Symptom[]>([]);
    const [vitalsHistory, setVitalsHistory] = useState<VitalEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial load from database
    React.useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const patientId = DEMO_PATIENT.id;

                // Load all data in parallel
                const [rxData, labData, symptomData, vitalsData] = await Promise.all([
                    dbActions.getPrescriptions(patientId),
                    dbActions.getLabOrders(patientId),
                    dbActions.getSymptoms(patientId),
                    dbActions.getVitals(patientId),
                ]);

                setPrescriptions(rxData);
                setLabOrders(labData);
                setActiveSymptoms(symptomData);
                setVitalsHistory(vitalsData);
            } catch (error) {
                console.error('[HealthcareContext] Failed to load data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const addPrescription = async (data: Omit<Prescription, 'id' | 'status' | 'prescribedAt'>) => {
        try {
            const newPrescription = await dbActions.addPrescription(data);
            setPrescriptions(prev => [newPrescription, ...prev]);
        } catch (error) {
            console.error('[HealthcareContext] Failed to add prescription:', error);
            throw error;
        }
    };

    const updatePrescriptionStatus = async (id: string, status: PrescriptionStatus) => {
        try {
            const updated = await dbActions.updatePrescriptionStatus(id, status);
            if (updated) {
                setPrescriptions(prev =>
                    prev.map(p => p.id === id ? updated : p)
                );
            }
        } catch (error) {
            console.error('[HealthcareContext] Failed to update prescription:', error);
            throw error;
        }
    };

    const addLabOrder = async (data: Omit<LabOrder, 'id' | 'status' | 'orderedAt'>) => {
        try {
            const newOrder = await dbActions.addLabOrder(data);
            setLabOrders(prev => [newOrder, ...prev]);
        } catch (error) {
            console.error('[HealthcareContext] Failed to add lab order:', error);
            throw error;
        }
    };

    const updateLabOrder = async (id: string, updates: Partial<LabOrder>) => {
        try {
            const updated = await dbActions.updateLabOrder(id, updates);
            if (updated) {
                setLabOrders(prev =>
                    prev.map(o => o.id === id ? updated : o)
                );
            }
        } catch (error) {
            console.error('[HealthcareContext] Failed to update lab order:', error);
            throw error;
        }
    };

    const addSymptom = async (data: Omit<Symptom, 'id' | 'recordedAt'>) => {
        try {
            const newSymptom = await dbActions.addSymptom(data);
            setActiveSymptoms(prev => [newSymptom, ...prev]);
        } catch (error) {
            console.error('[HealthcareContext] Failed to add symptom:', error);
            throw error;
        }
    };

    const resolveSymptom = async (id: string) => {
        try {
            const deleted = await dbActions.resolveSymptom(id);
            if (deleted) {
                setActiveSymptoms(prev => prev.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error('[HealthcareContext] Failed to resolve symptom:', error);
            throw error;
        }
    };

    const addVitalEntry = async (data: Omit<VitalEntry, 'id' | 'recordedAt'>) => {
        try {
            const newEntry = await dbActions.addVitalEntry(data);
            setVitalsHistory(prev => [...prev, newEntry]);
        } catch (error) {
            console.error('[HealthcareContext] Failed to add vital entry:', error);
            throw error;
        }
    };

    return (
        <HealthcareContext.Provider value={{
            activePatient: DEMO_PATIENT,
            prescriptions,
            labOrders,
            activeSymptoms,
            vitalsHistory,
            isLoading,
            addPrescription,
            updatePrescriptionStatus,
            addLabOrder,
            updateLabOrder,
            addSymptom,
            resolveSymptom,
            addVitalEntry,
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
