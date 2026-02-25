import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthRedirect from "./pages/AuthRedirect";
import PrivateRoute from "./auth/PrivateRoute";
import BarberPublicPage from "./pages/public/BarberPublicPage";

import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";
import BarberLayout from "./layouts/BarberLayout";

import Builder from "./pages/barber/Builder";
import MyBarbershops from "./pages/barber/MyBarbershops";
import CreateBarbershopWizard from "./pages/barber/CreateBarbershopWizard";
import BarberHome from "./pages/barber/BarberHome";
import Preview from "./pages/barber/Preview";
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
import Dashboard from "./pages/barber/Dashboard";
=======
>>>>>>> origin/David
>>>>>>> Stashed changes
import Landing from "./pages/Landing";
import { Toaster } from "react-hot-toast";

// import SiteEditor from "./pages/barber/site/SiteEditor";
<<<<<<< Updated upstream

=======
<<<<<<< HEAD
//APP
=======

>>>>>>> origin/David
>>>>>>> Stashed changes
const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* ENTRADA */}
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<AuthRedirect />} />

        {/* PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/b/:slug" element={<BarberPublicPage />} />

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
          <Route index element={<BarberHome />} />
          <Route path="my" element={<MyBarbershops />} />
          <Route path="create" element={<CreateBarbershopWizard />} />
          <Route path="builder/:barbershopId" element={<Builder />} />
          <Route path="preview/:siteId" element={<Preview />} />
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
          <Route path="dashboard/:barbershopId" element={<Dashboard />} />
=======
>>>>>>> origin/David
>>>>>>> Stashed changes
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
    </>
  );
};

export default App;
