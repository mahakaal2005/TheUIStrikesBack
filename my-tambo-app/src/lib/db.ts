import fs from 'fs';
import path from 'path';
import { SEED_DATA } from './seed-data';
import type { Patient, Prescription, LabOrder, Symptom, VitalEntry, PrescriptionStatus, LabOrderStatus } from '@/contexts/HealthcareContext';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

interface Database {
    patients: Patient[];
    prescriptions: Prescription[];
    labOrders: LabOrder[];
    symptoms: Symptom[];
    vitals: VitalEntry[];
}

// Ensure data directory exists
function ensureDataDir() {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

// Read database from file
function readDB(): Database {
    ensureDataDir();

    if (!fs.existsSync(DB_PATH)) {
        // First run - seed the database
        console.log('[DB] Initializing database with seed data...');
        seedDatabase();
    }

    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data, (key, value) => {
        // Deserialize dates
        if (key.endsWith('At')) {
            return new Date(value);
        }
        return value;
    });
}

// Write database to file
function writeDB(data: Database) {
    ensureDataDir();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Seed database with initial data
function seedDatabase() {
    writeDB(SEED_DATA as Database);
    console.log('[DB] Database seeded successfully!');
}

// === Patients ===

export function getAllPatients(): Patient[] {
    const db = readDB();
    return db.patients;
}

export function getPatientById(id: string): Patient | undefined {
    const db = readDB();
    return db.patients.find(p => p.id === id);
}

// === Prescriptions ===

export function getAllPrescriptions(): Prescription[] {
    const db = readDB();
    return db.prescriptions;
}

export function getPrescriptionsByPatient(patientId: string): Prescription[] {
    const db = readDB();
    return db.prescriptions.filter(rx => rx.patientId === patientId);
}

export function createPrescription(data: Omit<Prescription, 'id' | 'status' | 'prescribedAt'>): Prescription {
    const db = readDB();
    const newPrescription: Prescription = {
        ...data,
        id: `rx-${Date.now()}`,
        status: 'pending',
        prescribedAt: new Date(),
    };
    db.prescriptions.unshift(newPrescription);
    writeDB(db);
    return newPrescription;
}

export function updatePrescriptionStatus(id: string, status: PrescriptionStatus): Prescription | null {
    const db = readDB();
    const prescription = db.prescriptions.find(rx => rx.id === id);
    if (!prescription) return null;

    prescription.status = status;
    if (status === 'ready_for_pickup' && !prescription.filledAt) {
        prescription.filledAt = new Date();
    }

    writeDB(db);
    return prescription;
}

// === Lab Orders ===

export function getAllLabOrders(): LabOrder[] {
    const db = readDB();
    return db.labOrders;
}

export function getLabOrdersByPatient(patientId: string): LabOrder[] {
    const db = readDB();
    return db.labOrders.filter(lab => lab.patientId === patientId);
}

export function createLabOrder(data: Omit<LabOrder, 'id' | 'status' | 'orderedAt'>): LabOrder {
    const db = readDB();
    const newOrder: LabOrder = {
        ...data,
        id: `lab-${Date.now()}`,
        status: 'ordered',
        orderedAt: new Date(),
    };
    db.labOrders.unshift(newOrder);
    writeDB(db);
    return newOrder;
}

export function updateLabOrder(id: string, updates: Partial<LabOrder>): LabOrder | null {
    const db = readDB();
    const order = db.labOrders.find(lab => lab.id === id);
    if (!order) return null;

    Object.assign(order, updates);
    writeDB(db);
    return order;
}

// === Symptoms ===

export function getAllSymptoms(): Symptom[] {
    const db = readDB();
    return db.symptoms;
}

export function getSymptomsByPatient(patientId: string): Symptom[] {
    const db = readDB();
    // Note: Current seed data doesn't have patientId on symptoms, so return all
    // In production, filter by patientId
    return db.symptoms;
}

export function createSymptom(data: Omit<Symptom, 'id' | 'recordedAt'>): Symptom {
    const db = readDB();
    const newSymptom: Symptom = {
        ...data,
        id: `sx-${Date.now()}`,
        recordedAt: new Date(),
    };
    db.symptoms.unshift(newSymptom);
    writeDB(db);
    return newSymptom;
}

export function deleteSymptom(id: string): boolean {
    const db = readDB();
    const initialLength = db.symptoms.length;
    db.symptoms = db.symptoms.filter(sx => sx.id !== id);
    const deleted = db.symptoms.length < initialLength;
    if (deleted) {
        writeDB(db);
    }
    return deleted;
}

// === Vitals ===

export function getAllVitals(): VitalEntry[] {
    const db = readDB();
    return db.vitals;
}

export function getVitalsByPatient(patientId: string): VitalEntry[] {
    const db = readDB();
    return db.vitals.filter(v => v.patientId === patientId);
}

export function createVitalEntry(data: Omit<VitalEntry, 'id' | 'recordedAt'>): VitalEntry {
    const db = readDB();
    const newEntry: VitalEntry = {
        ...data,
        id: `v-${Date.now()}`,
        recordedAt: new Date(),
    };
    db.vitals.push(newEntry);
    writeDB(db);
    return newEntry;
}

// === Utility ===

export function resetDatabase() {
    seedDatabase();
    console.log('[DB] Database reset to seed data');
}
