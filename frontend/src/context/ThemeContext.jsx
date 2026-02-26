import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Intentamos obtener el tema guardado en localStorage o usamos 'classic' por defecto
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "classic");

    useEffect(() => {
        // Aplicamos el atributo data-theme al elemento raíz
        document.documentElement.setAttribute("data-theme", theme);
        // Guardamos la preferencia en localStorage
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
