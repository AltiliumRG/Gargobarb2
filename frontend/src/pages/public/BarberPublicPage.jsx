import { useParams } from "react-router-dom";
import barberPublicApi from "../../api/barberPublic.api";
import { useEffect, useState } from "react";

export default function BarberPublicPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    barberPublicApi.getBySlug(slug).then(res => setData(res.data));
  }, [slug]);

  if (!data) return <div>Cargando...</div>;

  return (
    <div
      style={{
        background: data.design.colors.background,
        color: data.design.colors.text,
        fontFamily: data.design.font,
      }}
      className="min-h-screen p-8"
    >
      <h1 className="text-4xl font-bold">{data.name}</h1>
      <p>{data.address}</p>
    </div>
  );
}
