import { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

/* ======================== */
const defaultStats = {
  totalRevenue: 0,
  totalAppointments: 0,
  totalClients: 0,
  totalServices: 0,
  revenueByDay: [],
  servicesTop: [],
  cartTopProducts: [],
  statusDistribution: [],
  busyHours: [],
  cancelRate: 0,
};

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

export default function Stats() {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d");
  const [view, setView] = useState("services"); // 🔥 toggle

  const dashboardRef = useRef();

  /* ================= FETCH ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/stats/barber?range=${range}`);
        setStats({ ...defaultStats, ...res.data });
      } catch {
        setStats(defaultStats);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [range]);

  /* ================= EXPORT ================= */
  const downloadImage = async () => {
    const canvas = await html2canvas(dashboardRef.current);
    const link = document.createElement("a");
    link.download = "dashboard.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      view === "services" ? stats.servicesTop : stats.cartTopProducts
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    XLSX.writeFile(wb, "stats.xlsx");
  };

  const downloadPDF = async () => {
    const canvas = await html2canvas(dashboardRef.current);
    const pdf = new jsPDF("landscape");
    pdf.addImage(canvas.toDataURL(), "PNG", 10, 10, 280, 150);
    pdf.save("dashboard.pdf");
  };

  if (loading) return <div className="p-10 text-white">Cargando...</div>;

  return (
    <div className="p-8 text-white space-y-8 bg-gradient-to-br from-[#0b0f1a] to-[#111827] min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between flex-wrap gap-4">
        <h1 className="text-4xl font-bold text-yellow-400">
          Dashboard PRO 🚀
        </h1>

        <div className="flex gap-2">
          {["1d", "7d", "30d"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-xl ${
                range === r ? "bg-yellow-400 text-black" : "bg-white/10"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Btn onClick={downloadImage} text="📸" />
          <Btn onClick={downloadExcel} text="Excel" />
          <Btn onClick={downloadPDF} text="PDF" />
        </div>
      </div>

      {/* TOGGLE 🔥 */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("services")}
          className={`px-4 py-2 rounded-xl ${
            view === "services" ? "bg-yellow-400 text-black" : "bg-white/10"
          }`}
        >
          Servicios
        </button>

        <button
          onClick={() => setView("cart")}
          className={`px-4 py-2 rounded-xl ${
            view === "cart" ? "bg-yellow-400 text-black" : "bg-white/10"
          }`}
        >
          Carrito 🛒
        </button>
      </div>

      <div ref={dashboardRef} className="space-y-8">

        {/* KPIs */}
        <div className="grid md:grid-cols-5 gap-6">
          <Card title="Ingresos" value={`$${stats.totalRevenue}`} />
          <Card title="Citas" value={stats.totalAppointments} />
          <Card title="Clientes" value={stats.totalClients} />
          <Card title="Servicios" value={stats.totalServices} />
          <Card title="Cancelación %" value={`${stats.cancelRate}%`} />
        </div>

        {/* GRAFICAS */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* INGRESOS */}
          <Glass title="Ingresos">
            {stats.revenueByDay.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={stats.revenueByDay}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#facc15" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#888" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis stroke="#888" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.1)", borderRadius: "10px", color: "#facc15" }} itemStyle={{ color: "#facc15" }} />
                  <Area type="monotone" dataKey="total" stroke="#facc15" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Empty text="Sin ingresos aún" />
            )}
          </Glass>

          {/* SERVICIOS / CARRITO 🔥 */}
          <Glass title={view === "services" ? "Servicios" : "Productos vendidos"}>
            {(view === "services"
              ? stats.servicesTop
              : stats.cartTopProducts
            )?.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={
                    view === "services"
                      ? stats.servicesTop
                      : stats.cartTopProducts
                  }
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="name" stroke="#888" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis stroke="#888" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: "rgba(250, 204, 21, 0.1)" }} contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.1)", borderRadius: "10px" }} />
                  <Bar dataKey="count" fill="#facc15" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty text="No hay datos aún" />
            )}
          </Glass>

          {/* PIE */}
          <Glass title="Estados">
            {stats.statusDistribution.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
                  <Pie data={stats.statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5}>
                    {stats.statusDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty text="Sin estados" />
            )}
          </Glass>

          {/* HORAS */}
          <Glass title="Horas pico">
            {stats.busyHours.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.busyHours}>
                  <XAxis dataKey="hour" stroke="#888" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#22c55e" }} />
                  <YAxis stroke="#888" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: "rgba(34, 197, 94, 0.1)" }} contentStyle={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.1)", borderRadius: "10px", color: "#22c55e" }} />
                  <Bar dataKey="count" fill="#22c55e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty text="Sin actividad" />
            )}
          </Glass>

        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTES ================= */

function Btn({ onClick, text }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-yellow-400 hover:text-black"
    >
      {text}
    </button>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
      <p className="text-sm opacity-60">{title}</p>
      <h2 className="text-2xl font-bold text-yellow-400">{value}</h2>
    </div>
  );
}

function Glass({ title, children }) {
  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
      <h2 className="text-yellow-400 mb-2">{title}</h2>
      {children}
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="h-[250px] flex items-center justify-center text-gray-500">
      {text}
    </div>
  );
}