import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBarbershops } from "../../api/barber.api";

export default function MyBarbershops() {
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyBarbershops().then((res) => setShops(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis Barberías</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shops.map((shop) => (
          <div key={shop.id} className="border p-4 rounded">
            <h2 className="font-semibold">{shop.name}</h2>
            <p className="text-sm text-gray-500">
              {shop.address} - {shop.city}
            </p>

            <button
              onClick={() => navigate(`/barber/builder/${shop.id}`)}
              className="mt-3 bg-yellow-500 px-3 py-1 rounded"
            >
              Editar página
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
