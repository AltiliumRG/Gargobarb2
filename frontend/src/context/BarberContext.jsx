import { createContext, useContext, useState, useEffect } from "react";
import { getServicesByBarbershop } from "../api/services.api";
import { getProductsByBarbershop } from "../api/products.api";

const BarberContext = createContext();

export const BarberProvider = ({ children }) => {
  const [activeBarbershop, setActiveBarbershop] = useState(null);
  const [loadingBarbershop, setLoadingBarbershop] = useState(true);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!activeBarbershop?.id) return;

      try {
        const [servRes, prodRes] = await Promise.all([
          getServicesByBarbershop(activeBarbershop.id),
          getProductsByBarbershop(activeBarbershop.id)
        ]);

        setServices(servRes.data || []);
        setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      } catch (err) {
        console.error("Error cargando servicios/productos:", err);
      }
    };

    fetchData();
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