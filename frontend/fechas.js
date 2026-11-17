
// "2030-03-15" -> "15/03/2030"
export function formatearFecha(fecha) {
  if (!fecha) return "";

  return fecha.split("-").reverse().join("/");
}

// Fecha actual en formato AAAA-MM-DD (hora local)
export function hoy() {
  const fecha = new Date();

  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${año}-${mes}-${dia}`;
}

// "2026-11-01 08:00:00" -> "01/11/2026 08:00"
export function formatearFechaHora(fechaHora) {
  if (!fechaHora) return "";

  const [fecha, hora] = fechaHora.replace("T", " ").split(" ");

  return `${formatearFecha(fecha)} ${hora.slice(0, 5)}`;
}

// "2026-11-01 08:00:00" -> "2026-11-01T08:00"
export function aInputFechaHora(fechaHora) {
  if (!fechaHora) return "";

  return fechaHora.slice(0, 16).replace(" ", "T");
}

// "2026-11-01T08:00" -> "2026-11-01 08:00:00"
export function aFechaHoraBackend(fechaHora) {
  if (!fechaHora) return "";

  return fechaHora.replace("T", " ") + ":00";
}
