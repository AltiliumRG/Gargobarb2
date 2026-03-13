import { createContext, useContext, useState, useEffect } from "react";

const BarberContext = createContext();

export const BarberProvider = ({ children }) => {
  const [activeBarbershop, setActiveBarbershop] = useState(null);
  const [loadingBarbershop, setLoadingBarbershop] = useState(true);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      if (!activeBarbershop?.id) return;

      try {
        const res = await fetch(
          `http://localhost:4000/api/services/barbershop/${activeBarbershop.id}`
        );

        const data = await res.json();

        setServices(data);
      } catch (err) {
        console.error("Error cargando servicios:", err);
      }
    };

    fetchServices();
  }, [activeBarbershop]);

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