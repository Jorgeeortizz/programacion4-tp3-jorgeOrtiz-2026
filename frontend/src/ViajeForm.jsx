
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCargar } from "./useCargar";
import { aInputFechaHora, aFechaHoraBackend } from "./fechas";

const API = import.meta.env.VITE_API_URL;

const VACIO = {
  vehiculo_id: "",
  conductor_id: "",
  fechaSalida: "",
  fechaLlegada: "",
  origen: "",
  destino: "",
  kilometros: "",
  observaciones: "",
};

export function ViajeForm({ inicial = VACIO, onGuardar, textoBoton }) {
  const vehiculos = useCargar("/vehiculos");
  const conductores = useCargar("/conductores");

  const [datos, setDatos] = useState(() => ({
    ...VACIO,
    ...inicial,
    fechaSalida: inicial.fechaSalida
      ? aInputFechaHora(inicial.fechaSalida)
      : "",
    fechaLlegada: inicial.fechaLlegada
      ? aInputFechaHora(inicial.fechaLlegada)
      : "",
  }));

  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const cambiar = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  const validar = () => {
    const nuevos = {};

    if (!datos.vehiculo_id) {
      nuevos.vehiculo_id = "Elegí un vehículo";
    }

    if (!datos.conductor_id) {
      nuevos.conductor_id = "Elegí un conductor";
    }

    if (!datos.fechaSalida) {
      nuevos.fechaSalida = "La fecha y hora de salida son obligatorias";
    }

    if (!datos.fechaLlegada) {
      nuevos.fechaLlegada = "La fecha y hora de llegada son obligatorias";
    } else if (
      datos.fechaSalida &&
      datos.fechaLlegada < datos.fechaSalida
    ) {
      nuevos.fechaLlegada = "La llegada no puede ser anterior a la salida";
    }

    if (!datos.origen.trim()) {
      nuevos.origen = "El origen es obligatorio";
    } else if (datos.origen.trim().length > 100) {
      nuevos.origen = "El origen admite hasta 100 caracteres";
    }

    if (!datos.destino.trim()) {
      nuevos.destino = "El destino es obligatorio";
    } else if (datos.destino.trim().length > 100) {
      nuevos.destino = "El destino admite hasta 100 caracteres";
    }

    if (String(datos.kilometros).trim() === "") {
      nuevos.kilometros = "Los kilómetros son obligatorios";
    } else if (
      !Number.isFinite(Number(datos.kilometros)) ||
      Number(datos.kilometros) <= 0
    ) {
      nuevos.kilometros = "Los kilómetros deben ser mayores a 0";
    }

    if (datos.observaciones.trim().length > 1000) {
      nuevos.observaciones = "Las observaciones admiten hasta 1000 caracteres";
    }

    return nuevos;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor(null);

    const nuevos = validar();
    setErrores(nuevos);

    if (Object.keys(nuevos).length > 0) return;

    setGuardando(true);

    try {
      const res = await onGuardar({
        vehiculo_id: Number(datos.vehiculo_id),
        conductor_id: Number(datos.conductor_id),
        fechaSalida: aFechaHoraBackend(datos.fechaSalida),
        fechaLlegada: aFechaHoraBackend(datos.fechaLlegada),
        origen: datos.origen.trim(),
        destino: datos.destino.trim(),
        kilometros: Number(datos.kilometros),
        observaciones: datos.observaciones.trim() || null,
      });

      if (!res.ok) {
        setErrorServidor(res.mensaje);
      }
    } catch {
      setErrorServidor("No se pudo conectar con el servidor");
    } finally {
      setGuardando(false);
    }
  };

  if (vehiculos.cargando || conductores.cargando) {
    return <p>Cargando...</p>;
  }

  if (vehiculos.error || conductores.error) {
    return (
      <p className="error">
        {vehiculos.error || conductores.error}
      </p>
    );
  }

  if (
    vehiculos.datos.length === 0 ||
    conductores.datos.length === 0
  ) {
    return (
      <p>
        Para registrar un viaje primero tiene que haber al menos un{" "}
        <Link to="/vehiculos">vehículo</Link> y un{" "}
        <Link to="/conductores">conductor</Link>.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="vehiculo_id">Vehículo:</label>
      <select
        id="vehiculo_id"
        name="vehiculo_id"
        value={datos.vehiculo_id}
        onChange={cambiar}
      >
        <option value="">Seleccioná un vehículo...</option>

        {vehiculos.datos.map((v) => (
          <option key={v.id} value={v.id}>
            {v.patente} - {v.marca} {v.modelo}
          </option>
        ))}
      </select>

      {errores.vehiculo_id && (
        <p className="error">{errores.vehiculo_id}</p>
      )}

      <label htmlFor="conductor_id">Conductor:</label>
      <select
        id="conductor_id"
        name="conductor_id"
        value={datos.conductor_id}
        onChange={cambiar}
      >
        <option value="">Seleccioná un conductor...</option>

        {conductores.datos.map((c) => (
          <option key={c.id} value={c.id}>
            {c.apellido}, {c.nombre}
          </option>
        ))}
      </select>

      {errores.conductor_id && (
        <p className="error">{errores.conductor_id}</p>
      )}

      <label htmlFor="fechaSalida">Fecha y hora de salida:</label>
      <input
        id="fechaSalida"
        name="fechaSalida"
        type="datetime-local"
        value={datos.fechaSalida}
        onChange={cambiar}
      />

      {errores.fechaSalida && (
        <p className="error">{errores.fechaSalida}</p>
      )}

      <label htmlFor="fechaLlegada">Fecha y hora de llegada:</label>
      <input
        id="fechaLlegada"
        name="fechaLlegada"
        type="datetime-local"
        value={datos.fechaLlegada}
        onChange={cambiar}
      />

      {errores.fechaLlegada && (
        <p className="error">{errores.fechaLlegada}</p>
      )}

      <label htmlFor="origen">Origen:</label>
      <input
        id="origen"
        name="origen"
        value={datos.origen}
        onChange={cambiar}
      />

      {errores.origen && (
        <p className="error">{errores.origen}</p>
      )}

      <label htmlFor="destino">Destino:</label>
      <input
        id="destino"
        name="destino"
        value={datos.destino}
        onChange={cambiar}
      />

      {errores.destino && (
        <p className="error">{errores.destino}</p>
      )}

      <label htmlFor="kilometros">Kilómetros recorridos:</label>
      <input
        id="kilometros"
        name="kilometros"
        type="number"
        step="0.01"
        value={datos.kilometros}
        onChange={cambiar}
      />

      {errores.kilometros && (
        <p className="error">{errores.kilometros}</p>
      )}

      <label htmlFor="observaciones">Observaciones (opcional):</label>
      <textarea
        id="observaciones"
        name="observaciones"
        rows="3"
        value={datos.observaciones}
        onChange={cambiar}
      />

      {errores.observaciones && (
        <p className="error">{errores.observaciones}</p>
      )}

      {errorServidor && (
        <p className="error">{errorServidor}</p>
      )}

      <div className="acciones">
        <button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : textoBoton}
        </button>

        <Link to="/viajes">
          <button type="button">Cancelar</button>
        </Link>
      </div>
    </form>
  );
}
