"use client";

import React, { useCallback } from "react";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useTamboThreadInput } from "@tambo-ai/react";

interface SmartRoutingWrapperProps {
    onRouteDetected: (message: string) => boolean;
    children?: React.ReactNode;
}

export const SmartRoutingWrapper: React.FC<SmartRoutingWrapperProps> = ({ onRouteDetected, children }) => {
    // Intercept message submission
    const handleBeforeSubmit = useCallback((event: CustomEvent) => {
        const message = event.detail?.message;
        if (message && typeof message === 'string') {
            // Check if we should route immediately
            const shouldRoute = onRouteDetected(message);
            if (shouldRoute) {
                // Prevent the message from being sent to AI
                event.preventDefault();
            }
        }
    }, [onRouteDetected]);

    React.useEffect(() => {
        // Listen for message submission events
        window.addEventListener('tambo:beforeSubmit' as any, handleBeforeSubmit);
        return () => {
            window.removeEventListener('tambo:beforeSubmit' as any, handleBeforeSubmit);
        };
    }, [handleBeforeSubmit]);

    return <>{children}</>;
};
