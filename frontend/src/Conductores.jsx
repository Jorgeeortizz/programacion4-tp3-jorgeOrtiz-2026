
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./Auth";
import { leerError } from "./errores";
import { formatearFecha, hoy } from "./fechas";



export function Conductores() {
  const { fetchAuth } = useAuth();

  const [conductores, setConductores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    let cancelado = false;

    setCargando(true);

    fetchAuth("/conductores")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await leerError(response));
        }

        return response.json();
      })
      .then((datos) => {
        if (cancelado) return;

        setConductores(datos);
        setError(null);
      })
      .catch((err) => {
        if (cancelado) return;

        setError(
          err instanceof TypeError
            ? "No se pudo conectar con el servidor"
            : err.message
        );
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [fetchAuth, recarga]);

  const eliminar = async (conductor) => {
    if (
      !window.confirm(
        `¿Eliminar al conductor ${conductor.apellido}, ${conductor.nombre}?`
      )
    ) {
      return;
    }

    try {
  const response = await fetchAuth(
    `/conductores/${conductor.id}`,
    { method: "DELETE" }
  );

      if (!response.ok) {
        setError(await leerError(response));
        return;
      }

      setError(null);
      setRecarga((r) => r + 1);

    } catch (err) {
      setError(
        err instanceof TypeError
          ? "No se pudo conectar con el servidor"
          : err.message
      );
    }
  };

  const fechaHoy = hoy();

  return (
    <>
      <div className="cabecera">
        <h2>Conductores</h2>

        <Link className="enlace-boton" to="/conductores/crear">
          Nuevo conductor
        </Link>
      </div>

      {error && <p className="error">{error}</p>}

      {cargando && <p>Cargando...</p>}

      {!cargando && conductores.length === 0 && !error && (
        <p>No hay conductores registrados.</p>
      )}

      {conductores.length > 0 && (
        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Apellido y nombre</th>
                <th>Documento</th>
                <th>Licencia</th>
                <th>Alta licencia</th>
                <th>Vencimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {conductores.map((c) => {
                const vencimiento = c.vencimientoLicencia?.slice(0, 10);
                const vencida =
                  vencimiento && vencimiento < fechaHoy;

                return (
                  <tr key={c.id}>
                    <td>
                      {c.apellido}, {c.nombre}
                    </td>

                    <td>{c.documento}</td>

                    <td>{c.licencia}</td>

                    <td>
                      {formatearFecha(c.altaLicencia)}
                    </td>

                    <td className={vencida ? "vencida" : ""}>
                      {formatearFecha(c.vencimientoLicencia)}
                      {vencida && " (vencida)"}
                    </td>

                    <td>
                      <div className="acciones">
                        <Link
                          className="enlace-boton"
                          to={`/conductores/${c.id}`}
                        >
                          Modificar
                        </Link>

                        <button
                          className="boton-peligro"
                          onClick={() => eliminar(c)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
