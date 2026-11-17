import { createContext, useCallback, useContext, useState } from "react";

// URL base del backend: se define una sola vez
const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = "token";
const USUARIO_KEY = "usuario";

// Contexto: un "canal" para compartir datos de autenticación con toda la app
const AuthContext = createContext(null);

// Hook personalizado: atajo para leer el contexto desde cualquier componente
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // Al iniciar, se recupera la sesión guardada (si existe) para no perderla al recargar
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem(USUARIO_KEY);
    return guardado ? JSON.parse(guardado) : null;
  });
  const [error, setError] = useState(null);

  const nombre = usuario?.nombre ?? null;

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const datos = await response.json();

      if (!response.ok) {
        throw new Error(datos.mensaje || "No se pudo iniciar sesión");
      }

      // Respuesta esperada: { mensaje, token, usuario: { id, nombre, email } }
      localStorage.setItem(TOKEN_KEY, datos.token);
      localStorage.setItem(USUARIO_KEY, JSON.stringify(datos.usuario));
      setToken(datos.token);
      setUsuario(datos.usuario);
      return { success: true };
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "No se pudo conectar con el servidor"
          : err.message,
      );
      return { success: false };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    setToken(null);
    setUsuario(null);
    setError(null);
  }, []);

  // fetch que agrega el token. Recibe una ruta, por ejemplo "/vehiculos".
  // Si el servidor responde 401 (token vencido o inválido), se cierra la sesión.
  const fetchAuth = useCallback(
    async (ruta, options = {}) => {
      if (!token) {
        throw new Error("No está iniciada la sesión");
      }

      const response = await fetch(`${API_URL}${ruta}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        logout();
      }
      return response;
    },
    [token, logout],
  );

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        nombre,
        error,
        isAuthenticated: !!token,
        login,
        logout,
        fetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
