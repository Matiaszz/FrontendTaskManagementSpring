'use client';
import { useEffect, useState } from "react";

interface ToastProps {
    message: string;
    onClose: () => void;
}

const Toast = ({ message, onClose }: ToastProps) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const totalDuration = 5000;
        const interval = 50;
        const steps = totalDuration / interval;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            setProgress(100 - (currentStep / steps) * 100);

            if (currentStep >= steps) {
                clearInterval(timer);
                onClose();
            }
        }, interval);

        return () => clearInterval(timer);
    }, [onClose]);

    return (
        <div className="bg-red-500 text-white shadow-lg rounded-lg p-4 mb-3 w-80 relative overflow-hidden animate-fade-in-down">
            <p className="text-sm">{message}</p>
            <div className="absolute bottom-0 left-0 h-1 bg-white transition-all duration-50"
                style={{ width: `${progress}%` }} />
        </div>
    );
};

export default Toast;
