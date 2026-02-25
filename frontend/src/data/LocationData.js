// frontend/src/data/LocationData.js
/**
 * 📍 LocationData.js
 * 
 * Este archivo contiene la estructura jerárquica de ubicaciones para el wizard de creación.
 * Permite que al seleccionar un país, los departamentos y ciudades se filtren automáticamente.
 * 
 * Relacionado con:
 * - StepBasicInfo.jsx (Selector UI)
 * - WizardContext.jsx (Estado Global)
 */

export const locationData = [
    {
        country: "Colombia",
        departments: [
            {
                name: "Antioquia",
                cities: ["Medellín", "Envigado", "Itagüí", "Sabaneta", "Bello", "Rionegro"]
            },
            {
                name: "Cundinamarca",
                cities: ["Bogotá", "Soacha", "Chía", "Zipaquirá", "Fusagasugá"]
            },
            {
                name: "Valle del Cauca",
                cities: ["Cali", "Palmira", "Tuluá", "Buga", "Cartago"]
            },
            {
                name: "Atlántico",
                cities: ["Barranquilla", "Soledad", "Malambo", "Puerto Colombia"]
            }
        ]
    },
    {
        country: "México",
        departments: [
            {
                name: "CDMX",
                cities: ["Coyoacán", "Polanco", "Condesa", "Santa Fe"]
            },
            {
                name: "Jalisco",
                cities: ["Guadalajara", "Zapopan", "Tlaquepaque"]
            },
            {
                name: "Nuevo León",
                cities: ["Monterrey", "San Pedro Garza García", "Guadalupe"]
            }
        ]
    }
];
