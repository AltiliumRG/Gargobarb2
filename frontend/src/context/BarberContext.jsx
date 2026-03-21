import { createContext, useContext, useState, useEffect } from "react";
import { getServicesByBarbershop } from "../api/services.api";

const BarberContext = createContext();

export const BarberProvider = ({ children }) => {
  const [activeBarbershop, setActiveBarbershop] = useState(null);
  const [loadingBarbershop, setLoadingBarbershop] = useState(true);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      if (!activeBarbershop?.id) return;

      try {
        const res = await getServicesByBarbershop(activeBarbershop.id);
        setServices(res.data);
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
        setServices,
        products,
        setProducts
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