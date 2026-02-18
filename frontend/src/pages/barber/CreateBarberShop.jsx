import { useState } from "react";
import { createBarbershop } from "../../api/barber.api";
import { useNavigate } from "react-router-dom";

export default function CreateBarberShop() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    if (!name || !address || !city) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await createBarbershop({
        name,
        address,
        city,
      });

      navigate(`/barber/design/${res.data.data.id}`);
    } catch (error) {
      console.error(error.response?.data || error);
      alert(error.response?.data?.error || "Error al crear barbería");
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Crear barbería</h2>

      <input
        className="w-full p-3 bg-gray-800 rounded mb-3"
        placeholder="Nombre de la barbería"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full p-3 bg-gray-800 rounded mb-3"
        placeholder="Dirección"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        className="w-full p-3 bg-gray-800 rounded mb-4"
        placeholder="Ciudad"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-yellow-500 text-black px-4 py-2 rounded"
      >
        Crear
      </button>
    </div>
  );
}
