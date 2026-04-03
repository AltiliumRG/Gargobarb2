// frontend/src/context/WizardContext.jsx

import { createContext, useContext, useState } from "react";

const WizardContext = createContext();
const TOTAL_STEPS = 3; // 0: Info+Mapa | 1: Pago | 2: Confirmar

export function WizardProvider({ children }) {

  const [step, setStep] = useState(0);

  /* 🧠 DATA CENTRAL DEL WIZARD
     Aquí vive TODO lo que se guarda en BD.
  */
  const [data, setData] = useState({

    /* 📍 Paso 0 — Identidad + Ubicación */
    name: "",
    country: "Colombia",
    department: "",
    departmentId: null,
    city: "",
    address: "",

    // 🔥 GEOCOORDENADAS (clave para mapa)
    latitude: null,
    longitude: null,
    place_id: null,
    formatted_address: "",

    /* 💳 Paso 1 — Configuración de Pagos */
    paymentMethod: null,
    paymentData: {},

    /* ⚙️ Funcionalidades */
    features: {
      services: true,
      gallery: true,
      cart: true,
      appointments: true,
    },

    /* 🎨 Paso 2 — Diseño */
    template: "default",
    primaryColor: "#111827",
    secondaryColor: "#facc15",
    fontFamily: "Roboto",
  });

  // -------------------------------
  // ✏️ UPDATE GLOBAL
  // -------------------------------
  const updateData = (newData) => {
    setData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  // -------------------------------
  // ✅ VALIDACIÓN POR PASO
  // -------------------------------
  const isStepValid = () => {

    if (step === 0) {
      return (
        data.name &&
        data.country &&
        data.department &&
        data.city &&
        data.address &&
        data.latitude &&
        data.longitude
      );
    }

    if (step === 1) {
      // Requiere método de pago seleccionado
      return !!data.paymentMethod;
    }

    return true;
  };

  // -------------------------------
  // ➡️ NEXT
  // -------------------------------
  const nextStep = () => {
    if (!isStepValid()) return;
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };

  // -------------------------------
  // ⬅️ PREV
  // -------------------------------
  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  // -------------------------------
  // 🔁 RESET
  // -------------------------------
  const resetWizard = () => {
    setStep(0);

    setData({
      name: "",
      country: "Colombia",
      department: "",
      departmentId: null,
      city: "",
      address: "",
      latitude: null,
      longitude: null,
      place_id: null,
      formatted_address: "",
      paymentMethod: null,
      paymentData: {},
      features: {
        services: true,
        gallery: true,
        cart: true,
        appointments: true,
      },
      template: "default",
      primaryColor: "#111827",
      secondaryColor: "#facc15",
      fontFamily: "Roboto",
    });
  };

  return (
    <WizardContext.Provider
      value={{
        step,
        data,
        updateData,
        nextStep,
        prevStep,
        resetWizard,
        TOTAL_STEPS,
        isStepValid,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export const useWizard = () => useContext(WizardContext);