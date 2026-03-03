import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthRedirect from "./pages/AuthRedirect";
import PrivateRoute from "./auth/PrivateRoute";

import Landing from "./pages/Landing";
import BarberPublicPage from "./pages/public/BarberPublicPage";
import CheckoutPage from "./pages/public/CheckoutPage";
import BookAppointment from "./pages/public/BookAppointment";

import { BarberProvider } from "./context/BarberContext";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";
import BarberLayout from "./layouts/BarberLayout";

// Barber pages
import Builder from "./pages/barber/Builder";
import MyBarbershops from "./pages/barber/MyBarbershops";
import CreateBarbershopWizard from "./pages/barber/CreateBarbershopWizard";
import BarberHome from "./pages/barber/BarberHome";
import Preview from "./pages/barber/Preview";

import BarberWorkspaceLayout from "./pages/barber/BarberWorkspaceLayout";
import Dashboard from "./pages/barber/Dashboard";
import Schedule from "./pages/barber/Schedule";
import Appointments from "./pages/barber/Appointments";

const App = () => {
  return (
    <>
      {/* 🔔 TOAST GLOBAL */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3500,
          style: {
            background: "#0f141a",
            color: "#fff",
            border: "1px solid #1f2937",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#facc15",
              secondary: "#000",
            },
          },
        }}
      />

      <Routes>

        {/* ========================================================
            LANDING
        ======================================================== */}
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<AuthRedirect />} />

        {/* ========================================================
            AUTH
        ======================================================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ========================================================
            PUBLIC BARBER SITE (ENVUELTO EN PROVIDER)
        ======================================================== */}
        <Route
          path="/b/:slug"
          element={
            <BarberProvider>
              <BarberPublicPage />
            </BarberProvider>
          }
        />

        <Route
          path="/b/:slug/book"
          element={
            <BarberProvider>
              <BookAppointment />
            </BarberProvider>
          }
        />

        {/* Checkout no necesita contexto Barber */}
        <Route path="/checkout/:id" element={<CheckoutPage />} />

        {/* ========================================================
            ADMIN
        ======================================================== */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute role={1}>
              <AdminLayout />
            </PrivateRoute>
          }
        />

        {/* ========================================================
            BARBER (ÁREA PRIVADA)
        ======================================================== */}
        <Route
          path="/barber/*"
          element={
            <PrivateRoute role={2}>
              <BarberLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<BarberHome />} />
          <Route path="my" element={<MyBarbershops />} />
          <Route path="create" element={<CreateBarbershopWizard />} />
          <Route path="builder/:barbershopId" element={<Builder />} />
          <Route path="preview/:siteId" element={<Preview />} />

          {/* 🔥 WORKSPACE DEL BARBERO */}
          <Route
            path="dashboard/:barbershopId"
            element={<BarberWorkspaceLayout />}
          >
            <Route index element={<Dashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="stats" element={<div>Estadísticas próximamente</div>} />
            <Route path="settings" element={<div>Configuración próximamente</div>} />
          </Route>
        </Route>

        {/* ========================================================
            CLIENT
        ======================================================== */}
        <Route
          path="/client/*"
          element={
            <PrivateRoute role={3}>
              <ClientLayout />
            </PrivateRoute>
          }
        />

        {/* ========================================================
            404
        ======================================================== */}
        <Route path="*" element={<Landing />} />

      </Routes>
    </>
  );
};

export default App;