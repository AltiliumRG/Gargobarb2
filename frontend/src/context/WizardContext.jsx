// frontend/src/context/WizardContext.jsx

import { createContext, useContext, useState } from "react";

const WizardContext = createContext();

const TOTAL_STEPS = 4;

export function WizardProvider({ children }) {
  const [step, setStep] = useState(0);

  const [data, setData] = useState({
    // Paso 1
    name: "",
    address: "",
    city: "",

    // Paso 2
    features: {
      services: true,
      gallery: true,
      cart: false,
      appointments: true,
    },

    // Paso 3
    template: "default",
    primaryColor: "#111827",
    secondaryColor: "#facc15",
    fontFamily: "Roboto",
  });

  // -------------------------------
  // ✏️ Actualizar datos
  // -------------------------------
  const updateData = (newData) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  // -------------------------------
  // ✅ Validaciones por paso
  // -------------------------------
  const isStepValid = () => {
    if (step === 0) {
      return data.name && data.address && data.city;
    }
    return true;
  };

  // -------------------------------
  // ➡️ Siguiente paso
  // -------------------------------
  const nextStep = () => {
    if (!isStepValid()) return;
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };

  // -------------------------------
  // ⬅️ Paso anterior
  // -------------------------------
  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  // -------------------------------
  // 🔁 Reset wizard
  // -------------------------------
  const resetWizard = () => {
    setStep(0);
    setData({
      name: "",
      address: "",
      city: "",
      features: {
        services: true,
        gallery: true,
        cart: false,
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
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export const useWizard = () => useContext(WizardContext);
