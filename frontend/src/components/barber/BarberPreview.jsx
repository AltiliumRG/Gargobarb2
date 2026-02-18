export default function BarberPreview({ data }) {
  return (
    <div
      className="p-6 rounded shadow"
      style={{
        backgroundColor: data.primaryColor,
        color: data.textColor,
        fontFamily: data.font,
      }}
    >
      <h1 className="text-3xl font-bold">{data.name}</h1>
      <p className="mt-2">{data.description}</p>
      <p className="mt-4 font-semibold">📍 {data.address}</p>
    </div>
  );
}
