
import { useState } from "react";
import { Link } from "react-router-dom";

const NOMBRE = /^[\p{L} '-]{1,50}$/u;

const VACIO = {
  nombre: "",
  apellido: "",
  documento: "",
  licencia: "",
  altaLicencia: "",
  vencimientoLicencia: "",
};

export function ConductorForm({ inicial = VACIO, onGuardar, textoBoton }) {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const nuevos = {};

    if (!datos.nombre.trim()) {
      nuevos.nombre = "El nombre es obligatorio";
    } else if (!NOMBRE.test(datos.nombre.trim())) {
      nuevos.nombre = "Solo letras, hasta 50 caracteres";
    }

    if (!datos.apellido.trim()) {
      nuevos.apellido = "El apellido es obligatorio";
    } else if (!NOMBRE.test(datos.apellido.trim())) {
      nuevos.apellido = "Solo letras, hasta 50 caracteres";
    }

    if (!datos.documento.trim()) {
      nuevos.documento = "El número de documento es obligatorio";
    } else if (!/^\d{7,8}$/.test(datos.documento.trim())) {
      nuevos.documento = "Debe tener 7 u 8 dígitos, sin puntos";
    }

    if (!datos.licencia.trim()) {
      nuevos.licencia = "El número de licencia es obligatorio";
    } else if (!/^[A-Za-z0-9]{5,20}$/.test(datos.licencia.trim())) {
      nuevos.licencia = "Debe ser alfanumérico (5 a 20 caracteres)";
    }

    if (!datos.altaLicencia) {
      nuevos.altaLicencia = "La fecha de alta es obligatoria";
    }

    if (!datos.vencimientoLicencia) {
      nuevos.vencimientoLicencia =
        "La fecha de vencimiento es obligatoria";
    } else if (
      datos.altaLicencia &&
      datos.vencimientoLicencia <= datos.altaLicencia
    ) {
      nuevos.vencimientoLicencia =
        "El vencimiento debe ser posterior a la fecha de alta";
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
        nombre: datos.nombre.trim(),
        apellido: datos.apellido.trim(),
        documento: datos.documento.trim(),
        licencia: datos.licencia.trim(),
        altaLicencia: datos.altaLicencia,
        vencimientoLicencia: datos.vencimientoLicencia,
      });

      if (!res.ok) {
        setErrorServidor(res.mensaje);
      }
    } catch (err) {
      setErrorServidor(err.message || "No se pudo guardar el conductor");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="nombre">Nombre:</label>
      <input
        id="nombre"
        name="nombre"
        value={datos.nombre}
        onChange={cambiar}
      />
      {errores.nombre && <p className="error">{errores.nombre}</p>}

      <label htmlFor="apellido">Apellido:</label>
      <input
        id="apellido"
        name="apellido"
        value={datos.apellido}
        onChange={cambiar}
      />
      {errores.apellido && <p className="error">{errores.apellido}</p>}

      <label htmlFor="documento">Número de documento:</label>
      <input
        id="documento"
        name="documento"
        value={datos.documento}
        onChange={cambiar}
      />
      {errores.documento && (
        <p className="error">{errores.documento}</p>
      )}

      <label htmlFor="licencia">Número de licencia:</label>
      <input
        id="licencia"
        name="licencia"
        value={datos.licencia}
        onChange={cambiar}
      />
      {errores.licencia && (
        <p className="error">{errores.licencia}</p>
      )}

      <label htmlFor="altaLicencia">Fecha de alta de la licencia:</label>
      <input
        id="altaLicencia"
        name="altaLicencia"
        type="date"
        value={datos.altaLicencia}
        onChange={cambiar}
      />
      {errores.altaLicencia && (
        <p className="error">{errores.altaLicencia}</p>
      )}

      <label htmlFor="vencimientoLicencia">
        Fecha de vencimiento de la licencia:
      </label>
      <input
        id="vencimientoLicencia"
        name="vencimientoLicencia"
        type="date"
        value={datos.vencimientoLicencia}
        onChange={cambiar}
      />
      {errores.vencimientoLicencia && (
        <p className="error">{errores.vencimientoLicencia}</p>
      )}

      {errorServidor && <p className="error">{errorServidor}</p>}

      <div className="acciones">
        <button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : textoBoton}
        </button>

        <Link className="enlace-boton" to="/conductores">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
