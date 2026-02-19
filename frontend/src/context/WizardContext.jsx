// frontend/src/context/WizardContext.jsx

import { createContext, useContext, useState } from "react";

const WizardContext = createContext();

const TOTAL_STEPS = 4;

export function WizardProvider({ children }) {
  const [step, setStep] = useState(0);

  /* 🧠 ESTRUCTURA DE DATOS DEL WIZARD
     Este objeto centraliza toda la información recolectada durante los pasos.
     Relacionado con:
     - StepBasicInfo (Paso 0)
     - StepFeatures (Paso 1)
     - StepDesign (Paso 2)
  */
  const [data, setData] = useState({
    // Paso 0: Identidad y Ubicación
    name: "",
    country: "Colombia",
    department: "",
    city: "",
    address: "",

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
      // ✅ Validamos que los campos obligatorios de la ubicación estén llenos
      return data.name && data.country && data.department && data.city && data.address;
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
      country: "Colombia",
      department: "",
      city: "",
      address: "",
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
