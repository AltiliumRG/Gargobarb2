import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthRedirect from "./pages/AuthRedirect";
import PrivateRoute from "./auth/PrivateRoute";

import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";
import BarberLayout from "./layouts/BarberLayout";

import Builder from "./pages/barber/Builder";
import MyBarbershops from "./pages/barber/MyBarbershops";
import CreateBarbershopWizard from "./pages/barber/CreateBarbershopWizard";

// import SiteEditor from "./pages/barber/site/SiteEditor";

const App = () => {
  return (
    <Routes>
      {/* ENTRADA */}
      <Route path="/" element={<AuthRedirect />} />

      {/* PÚBLICAS */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ADMIN */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute role={1}>
            <AdminLayout />
          </PrivateRoute>
        }
      />

      {/* BARBERO */}
      <Route
        path="/barber/*"
        element={
          <PrivateRoute role={2}>
            <BarberLayout />
          </PrivateRoute>
        }
      >
        <Route path="mis-barberias" element={<MyBarbershops />} />
        <Route path="crear" element={<CreateBarbershopWizard />} />
        <Route path="builder/:barbershopId" element={<Builder />} />
        {/* <Route path="site/editor/:barbershopId" element={<SiteEditor />} /> */}
        
      </Route>

      {/* CLIENTE */}
      <Route
        path="/client/*"
        element={
          <PrivateRoute role={3}>
            <ClientLayout />
          </PrivateRoute>
        }
      />
    </Routes>
    
  );
};

export default App;
