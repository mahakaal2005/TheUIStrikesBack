'use server';

import { revalidatePath } from 'next/cache';
import * as db from '@/lib/db';
import type { PrescriptionStatus, LabOrderStatus, Prescription, LabOrder, Symptom, VitalEntry } from '@/contexts/HealthcareContext';

// === Prescriptions ===

export async function getPrescriptions(patientId: string) {
    return db.getPrescriptionsByPatient(patientId);
}

export async function addPrescription(data: Omit<Prescription, 'id' | 'status' | 'prescribedAt'>) {
    const newPrescription = db.createPrescription(data);
    revalidatePath('/demos/patient');
    revalidatePath('/demos/pharmacy');
    return newPrescription;
}

export async function updatePrescriptionStatus(id: string, status: PrescriptionStatus) {
    const updated = db.updatePrescriptionStatus(id, status);
    revalidatePath('/demos/patient');
    revalidatePath('/demos/pharmacy');
    return updated;
}

// === Lab Orders ===

export async function getLabOrders(patientId: string) {
    return db.getLabOrdersByPatient(patientId);
}

export async function addLabOrder(data: Omit<LabOrder, 'id' | 'status' | 'orderedAt'>) {
    const newOrder = db.createLabOrder(data);
    revalidatePath('/demos/patient');
    revalidatePath('/demos/lab');
    return newOrder;
}

export async function updateLabOrder(id: string, updates: Partial<LabOrder>) {
    const updated = db.updateLabOrder(id, updates);
    revalidatePath('/demos/patient');
    revalidatePath('/demos/lab');
    return updated;
}

// === Symptoms ===

export async function getSymptoms(patientId: string) {
    return db.getSymptomsByPatient(patientId);
}

export async function addSymptom(data: Omit<Symptom, 'id' | 'recordedAt'>) {
    const newSymptom = db.createSymptom(data);
    revalidatePath('/demos/patient');
    return newSymptom;
}

export async function resolveSymptom(id: string) {
    const deleted = db.deleteSymptom(id);
    if (deleted) {
        revalidatePath('/demos/patient');
    }
    return deleted;
}

// === Vitals ===

export async function getVitals(patientId: string) {
    return db.getVitalsByPatient(patientId);
}

export async function addVitalEntry(data: Omit<VitalEntry, 'id' | 'recordedAt'>) {
    const newEntry = db.createVitalEntry(data);
    revalidatePath('/demos/patient');
    revalidatePath('/demos/ehr');
    return newEntry;
}

// === Utility ===

export async function resetDatabase() {
    db.resetDatabase();
    revalidatePath('/demos/patient');
    revalidatePath('/demos/lab');
    revalidatePath('/demos/pharmacy');
    revalidatePath('/demos/ehr');
    return { success: true };
}
