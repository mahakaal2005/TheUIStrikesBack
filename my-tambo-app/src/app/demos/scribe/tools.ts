import { SoapNote, soapNoteSchema } from '@/components/demos/scribe/SoapNote';
import { z } from 'zod';

export const scribeTools = [
    // We can add tools here if the scribe needs to fetch external data, 
    // e.g., "getLabResults". For now, it's a listener, so it mostly renders the component.
];

export const scribeComponents = [
    {
        name: "SoapNote",
        description: "A comprehensive clinical note (SOAP format) updated in real-time. Use this to structure the information you hear.",
        component: SoapNote,
        propsSchema: soapNoteSchema
    }
];
