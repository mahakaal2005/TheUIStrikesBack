'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Patient {
    name: string;
    age: number;
    gender: string;
    id: string;
}

interface MedicalContextType {
    patient: Patient | null;
    setPatient: (patient: Patient) => void;
}

const MedicalContext = createContext<MedicalContextType | undefined>(undefined);

export const MedicalProvider = ({ children }: { children: ReactNode }) => {
    const [patient, setPatient] = useState<Patient | null>({
        name: "John Doe",
        age: 45,
        gender: "Male",
        id: "MRN-12345"
    });

    return (
        <MedicalContext.Provider value={{ patient, setPatient }}>
            {children}
        </MedicalContext.Provider>
    );
};

export const useMedicalContext = () => {
    const context = useContext(MedicalContext);
    if (context === undefined) {
        throw new Error('useMedicalContext must be used within a MedicalProvider');
    }
    return context;
};
