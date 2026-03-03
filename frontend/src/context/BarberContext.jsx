import { createContext, useContext, useState } from "react";

const BarberContext = createContext();

export const BarberProvider = ({ children }) => {
  const [activeBarbershop, setActiveBarbershop] = useState(null);
  const [loadingBarbershop, setLoadingBarbershop] = useState(true);

  // 🔥 Trigger para refrescar servicios
  const [services, setServices] = useState([]);

  const refreshServices = () => {
    setServicesVersion((prev) => prev + 1);
  };

  return (
    <BarberContext.Provider
      value={{
        activeBarbershop,
        setActiveBarbershop,
        loadingBarbershop,
        setLoadingBarbershop,
        services,
        setServices
      }}
    >
      {children}
    </BarberContext.Provider>
  );
};

export const useBarber = () => {
  const context = useContext(BarberContext);
  if (!context) {
    throw new Error("useBarber debe usarse dentro de BarberProvider");
  }
  return context;
};