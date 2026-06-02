import { useState, useEffect, useCallback } from "react";

export function useDarkMode() {
    const [darkMode, setDarkModeState] = useState(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem("darkMode") === "true" ||
            window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    const setDarkMode = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
        setDarkModeState(prev => {
            const newValue = typeof value === "function" ? value(prev) : value;

            // Update DOM
            if (newValue) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }

            // Persist to localStorage
            localStorage.setItem("darkMode", String(newValue));

            return newValue;
        });
    }, []);

    useEffect(() => {
        // Apply dark mode on mount if needed
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return { darkMode, setDarkMode };
}
