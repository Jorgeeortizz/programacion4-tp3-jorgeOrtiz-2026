
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./index.css";

import { AuthProvider } from "./Auth";
import { Layout } from "./Layout";
import { AuthLayout } from "./AuthLayout";

import { Home } from "./Home";
import { Login } from "./Login";

import { Vehiculos } from "./Vehiculos";
import { VehiculoCrear } from "./VehiculoCrear";
import { VehiculoDetalles } from "./VehiculoDetalles";

import { Conductores } from "./Conductores";
import { ConductorCrear } from "./ConductorCrear";
import { ConductorDetalles } from "./ConductorDetalles";

import { Viajes } from "./Viajes";
import { ViajeCrear } from "./ViajeCrear";
import { ViajeDetalles } from "./ViajeDetalles";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Rutas públicas */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />

            {/* Rutas protegidas */}
            <Route element={<AuthLayout />}>
              {/* Vehículos */}
              <Route path="vehiculos" element={<Vehiculos />} />
              <Route path="vehiculos/crear" element={<VehiculoCrear />} />
              <Route path="vehiculos/:id" element={<VehiculoDetalles />} />

              {/* Conductores */}
              <Route path="conductores" element={<Conductores />} />
              <Route path="conductores/crear" element={<ConductorCrear />} />
              <Route path="conductores/:id" element={<ConductorDetalles />} />

              {/* Viajes */}
              <Route path="viajes" element={<Viajes />} />
              <Route path="viajes/crear" element={<ViajeCrear />} />
              <Route path="viajes/:id" element={<ViajeDetalles />} />
            </Route>

            {/* Rutas inexistentes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
