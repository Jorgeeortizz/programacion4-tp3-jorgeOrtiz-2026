
import { useState } from "react";
import { Link } from "react-router-dom";

const PATENTE = /^([A-Z]{3}\d{3}|[A-Z]{2}\d{3}[A-Z]{2})$/;

const VACIO = {
  marca: "",
  modelo: "",
  patente: "",
  año: "",
  capacidadCarga: ""
};

export function VehiculoForm({
  inicial = VACIO,
  onGuardar,
  textoBoton
}) {

  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Modificar los campos del formulario
  const cambiar = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    });
  };

  // Validaciones del formulario
  const validar = () => {

    const nuevos = {};
    const anioMax = new Date().getFullYear() + 1;

    if (!datos.marca.trim()) {
      nuevos.marca = "La marca es obligatoria";
    } else if (datos.marca.trim().length > 50) {
      nuevos.marca = "La marca admite hasta 50 caracteres";
    }

    if (!datos.modelo.trim()) {
      nuevos.modelo = "El modelo es obligatorio";
    } else if (datos.modelo.trim().length > 50) {
      nuevos.modelo = "El modelo admite hasta 50 caracteres";
    }

    if (!datos.patente.trim()) {
      nuevos.patente = "La patente es obligatoria";
    } else if (
      !PATENTE.test(datos.patente.trim().toUpperCase())
    ) {
      nuevos.patente = "Formato inválido (ejemplos: ABC123 o AB123CD)";
    }

    if (String(datos.año).trim() === "") {
      nuevos.año = "El año es obligatorio";
    } else if (
      !Number.isInteger(Number(datos.año)) ||
      Number(datos.año) < 1950 ||
      Number(datos.año) > anioMax
    ) {
      nuevos.año = `El año debe estar entre 1950 y ${anioMax}`;
    }

    if (String(datos.capacidadCarga).trim() === "") {
      nuevos.capacidadCarga = "La capacidad de carga es obligatoria";
    } else if (
      !Number.isFinite(Number(datos.capacidadCarga)) ||
      Number(datos.capacidadCarga) <= 0
    ) {
      nuevos.capacidadCarga = "La capacidad de carga debe ser mayor a 0";
    }

    return nuevos;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {

    e.preventDefault();

    setErrorServidor(null);

    const nuevos = validar();

    setErrores(nuevos);

    if (Object.keys(nuevos).length > 0) return;

    setGuardando(true);

    try {

      const res = await onGuardar({
        marca: datos.marca.trim(),
        modelo: datos.modelo.trim(),
        patente: datos.patente.trim().toUpperCase(),
        año: Number(datos.año),
        capacidadCarga: Number(datos.capacidadCarga)
      });

      if (!res.ok) {
        setErrorServidor(res.mensaje);
      }

    } catch {
      setErrorServidor("Ocurrió un error al guardar el vehículo");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>

      <label htmlFor="marca">Marca:</label>
      <input
        id="marca"
        name="marca"
        value={datos.marca}
        onChange={cambiar}
      />
      {errores.marca && <p className="error">{errores.marca}</p>}

      <label htmlFor="modelo">Modelo:</label>
      <input
        id="modelo"
        name="modelo"
        value={datos.modelo}
        onChange={cambiar}
      />
      {errores.modelo && <p className="error">{errores.modelo}</p>}

      <label htmlFor="patente">Patente:</label>
      <input
        id="patente"
        name="patente"
        value={datos.patente}
        onChange={cambiar}
      />
      {errores.patente && <p className="error">{errores.patente}</p>}

      <label htmlFor="año">Año:</label>
      <input
        id="año"
        name="año"
        type="number"
        value={datos.año}
        onChange={cambiar}
      />
      {errores.año && <p className="error">{errores.año}</p>}

      <label htmlFor="capacidadCarga">
        Capacidad de carga (kg):
      </label>
      <input
        id="capacidadCarga"
        name="capacidadCarga"
        type="number"
        step="0.01"
        value={datos.capacidadCarga}
        onChange={cambiar}
      />
      {errores.capacidadCarga && (
        <p className="error">{errores.capacidadCarga}</p>
      )}

      {errorServidor && (
        <p className="error">{errorServidor}</p>
      )}

      <div className="acciones">

        <button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : textoBoton}
        </button>

        <Link to="/vehiculos">
          <button type="button">Cancelar</button>
        </Link>

      </div>

    </form>
  );
}
