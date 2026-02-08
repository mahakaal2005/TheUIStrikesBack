import type { Patient, Prescription, LabOrder, Symptom, VitalEntry } from '@/contexts/HealthcareContext';

// Seed data for demo - multiple personas can access this shared database

export const SEED_DATA = {
    patients: [
        {
            id: 'p-alex',
            name: 'Alex Morgan',
            age: 42,
            gender: 'Female',
        },
        {
            id: 'p-john',
            name: 'John Doe',
            age: 35,
            gender: 'Male',
        },
        {
            id: 'p-sarah',
            name: 'Sarah Chen',
            age: 58,
            gender: 'Female',
        },
    ] as Patient[],

    prescriptions: [
        {
            id: 'rx-001',
            patientId: 'p-alex',
            medicationName: 'Lisinopril',
            dosage: '10mg',
            instructions: 'Take 1 tablet daily in the morning with water',
            status: 'ready_for_pickup' as const,
            prescribedAt: new Date('2026-02-01T10:00:00Z'),
            filledAt: new Date('2026-02-03T14:30:00Z'),
        },
        {
            id: 'rx-002',
            patientId: 'p-alex',
            medicationName: 'Metformin',
            dosage: '500mg',
            instructions: 'Take 1 tablet twice daily with meals',
            status: 'pending' as const,
            prescribedAt: new Date('2026-02-05T09:15:00Z'),
        },
        {
            id: 'rx-003',
            patientId: 'p-john',
            medicationName: 'Amoxicillin',
            dosage: '500mg',
            instructions: 'Take 1 capsule 3 times daily for 7 days',
            status: 'ready_for_pickup' as const,
            prescribedAt: new Date('2026-02-04T11:20:00Z'),
            filledAt: new Date('2026-02-05T16:00:00Z'),
        },
    ] as Prescription[],

    labOrders: [
        {
            id: 'lab-001',
            patientId: 'p-alex',
            testName: 'Comprehensive Metabolic Panel (CMP)',
            status: 'completed' as const,
            orderedAt: new Date('2026-01-28T08:00:00Z'),
            completedAt: new Date('2026-01-29T14:30:00Z'),
            results: [
                { parameter: 'Glucose', value: '92', unit: 'mg/dL', range: '70-100', flag: 'normal' as const },
                { parameter: 'Sodium', value: '140', unit: 'mEq/L', range: '136-145', flag: 'normal' as const },
                { parameter: 'Potassium', value: '4.2', unit: 'mEq/L', range: '3.5-5.0', flag: 'normal' as const },
                { parameter: 'Calcium', value: '9.8', unit: 'mg/dL', range: '8.5-10.5', flag: 'normal' as const },
            ],
            notes: 'Fasting sample collected',
        },
        {
            id: 'lab-002',
            patientId: 'p-alex',
            testName: 'Lipid Panel',
            status: 'processing' as const,
            orderedAt: new Date('2026-02-06T09:30:00Z'),
            notes: 'Patient fasted for 12 hours',
        },
        {
            id: 'lab-003',
            patientId: 'p-john',
            testName: 'Complete Blood Count (CBC)',
            status: 'ordered' as const,
            orderedAt: new Date('2026-02-07T10:00:00Z'),
        },
    ] as LabOrder[],

    symptoms: [
        {
            id: 'sx-001',
            region: 'head',
            description: 'Mild headache, pressure behind eyes',
            severity: 'mild' as const,
            recordedAt: new Date('2026-02-07T18:30:00Z'),
        },
    ] as Symptom[],

    vitals: generateMockVitals(),
};

// Generate realistic vitals history for the past 7 days
function generateMockVitals(): VitalEntry[] {
    const vitals: VitalEntry[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(8, 0, 0, 0); // Morning reading

        // Blood pressure (slightly trending down)
        const systolic = 125 - i * 2 + Math.floor(Math.random() * 5);
        const diastolic = 80 - i + Math.floor(Math.random() * 3);
        vitals.push({
            id: `v-bp-${i}`,
            patientId: 'p-alex',
            type: 'blood_pressure',
            value: systolic,
            meta: `${systolic}/${diastolic}`,
            recordedAt: date,
        });

        // Heart rate (stable with minor variation)
        const hr = 72 + Math.floor(Math.random() * 12);
        vitals.push({
            id: `v-hr-${i}`,
            patientId: 'p-alex',
            type: 'heart_rate',
            value: hr,
            recordedAt: date,
        });

        // Oxygen saturation (consistently good)
        if (i % 2 === 0) {
            vitals.push({
                id: `v-o2-${i}`,
                patientId: 'p-alex',
                type: 'oxygen_sat',
                value: 97 + Math.floor(Math.random() * 3),
                recordedAt: date,
            });
        }
    }

    return vitals;
}
