import express from "express";
import { db } from "./db.js";

import { validarFiltrosViajes, validarFiltrosKilometros } from "./validaciones/validarFiltros.js";

import { validarViaje } from "./validaciones/validarParametros.js";



import { validarId, verificarValidaciones} from "./validaciones/validaciones.js";

const router = express.Router();

const sql_Viajes = "SELECT vjs.id, vjs.vehiculo_id, vjs.conductor_id, vjs.fechaSalida, vjs.fechaLlegada, " +
  "vjs.origen, vjs.destino, vjs.kilometros, vjs.observaciones, " +
  "v.patente, v.marca, v.modelo, " +
  "c.nombre AS conductor_nombre, c.apellido AS conductor_apellido " +
  "FROM tablaviajes vjs " +
  "JOIN tablavehiculos v ON v.id = vjs.vehiculo_id " +
  "JOIN tablaconductor c ON c.id = vjs.conductor_id";

//verificar vehiculo, conductor, licencia vigente 
async function Referencias (vehiculo_id, conductor_id, fechaSalida) {
  const [vehiculos] = await db.execute(
    "SELECT id FROM tablavehiculos WHERE id = ?",
    [vehiculo_id],
  );

  if (vehiculos.length === 0) {
    return "El vehículo indicado no existe";
  }

  const [conductores] = await db.execute(
    "SELECT vencimientoLicencia FROM tablaconductor WHERE id = ?",
    [conductor_id],
  );

  if (conductores.length === 0) {
    return "El conductor indicado no existe";
  }

  const vencimiento = new Date(conductores[0].vencimientoLicencia);

  if (vencimiento < new Date(fechaSalida)) {
    return "Licencia Vencida";
  }

  return null;
}

//lista viajes

router.get("/", //validarAutenticacion,
    validarFiltrosViajes, verificarValidaciones, async(req, res ) =>{

    const filtros=[];
    const parametros= [];

        const {vehiculo_id, conductor_id, desde, hasta} = req.query;


        if (vehiculo_id) {
        filtros.push("vjs.vehiculo_id = ?");
        parametros.push(Number(vehiculo_id));
        }
        
        if (conductor_id) {
            
        filtros.push("vjs.conductor_id = ?");
        parametros.push(Number(conductor_id));
                }


        if (desde) {

        filtros.push("vjs.fechaSalida >= ?");
        parametros.push(desde);
        }

            
        if (hasta) {
        filtros.push("vjs.fechaSalida <= ?");
        parametros.push(hasta);
             }      
             

    let sql = sql_Viajes;
            

if (filtros.length > 0) {
      sql += " WHERE " + filtros.join(" AND ");
    }

sql += " ORDER BY vjs.fechaSalida DESC";

    const [viajes] = await db.execute(sql, parametros);

    res.json(viajes);    


});


// kilómetros por vehículo o conductor.
// colocar antes que id 
router.get("/kilometros",//validarAutenticacion,
  validarFiltrosKilometros,verificarValidaciones,async (req, res) => {
    const filtros = [];
    const parametros = [];

    const { vehiculo_id, conductor_id } = req.query;

    if (vehiculo_id) {
      filtros.push("vehiculo_id = ?");
      parametros.push(Number(vehiculo_id));
    }

    if (conductor_id) {
      filtros.push("conductor_id = ?");
      parametros.push(Number(conductor_id));
    }

    const sql =
      "SELECT COALESCE(SUM(kilometros), 0) AS total_kilometros, COUNT(*) AS cantidad_viajes " +
      "FROM tablaviajes WHERE " +
      filtros.join(" AND ");

    const [filas] = await db.execute(sql, parametros);

    res.json({
      total_kilometros: Number(filas[0].total_kilometros),
      cantidad_viajes: filas[0].cantidad_viajes,
    });
  }, );



// viaje id
router.get("/:id",//validarAutenticacion,
  validarId,verificarValidaciones,async (req, res) => {
    
    const id = Number(req.params.id);

    const [viajes] = await db.execute(sql_Viajes + " WHERE vjs.id = ?", [id]);

    if (viajes.length === 0) {
      return res.status(404).json({ error: "Viaje no encontrado" });
    }

    res.json(viajes[0]);
  },);  


// agregar viaje
router.post("/",// validarAutenticacion,
validarViaje,verificarValidaciones,async (req, res) => {
    
    const { vehiculo_id,conductor_id,fechaSalida,fechaLlegada,origen,destino,kilometros,observaciones, } = req.body;

    const error = await Referencias(
      vehiculo_id,conductor_id,fechaSalida, fechaLlegada);

    if (error) {
      return res.status(400).json({ error });
    }

    const [result] = await db.execute(
      "INSERT INTO tablaviajes " +
        "(vehiculo_id, conductor_id, fechaSalida, fechaLlegada, origen, destino, kilometros, observaciones) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",

      [vehiculo_id,conductor_id,fechaSalida,fechaLlegada,origen,destino,kilometros,observaciones ?? null,],

    );

    res.status(201).json({id: result.insertId,vehiculo_id,conductor_id,fechaSalida,fechaLlegada,origen,destino,kilometros,observaciones: observaciones ?? null });

  },);



  // modificar  viajeS
router.put("/:id",//validarAutenticacion,
  validarId, validarViaje, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    const {vehiculo_id,conductor_id,fechaSalida,fechaLlegada,origen,destino,kilometros,observaciones,} = req.body;

    const error = await Referencias(vehiculo_id,conductor_id,fechaSalida);

    if (error) {
      return res.status(400).json({ error });
    }

    const [result] = await db.execute(
      "UPDATE tablaviajes SET vehiculo_id = ?, conductor_id = ?, fechaSalida = ?, fechaLlegada = ?, " +
        "origen = ?, destino = ?, kilometros = ?, observaciones = ? WHERE id = ?",
      [vehiculo_id,conductor_id,fechaSalida,fechaLlegada,origen,destino,kilometros,observaciones ?? null,id,],
    
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Viaje no encontrado" });
    }

    res.json({id,vehiculo_id,conductor_id,fechaSalida,fechaLlegada,origen,destino,kilometros,observaciones: observaciones ?? null,});
}, );




//eliminar
router.delete("/:id",//validarAutenticacion,
  validarId,verificarValidaciones, async (req, res) => {

    const id = Number(req.params.id);

    const [result] = await db.execute("DELETE FROM tablaviajes WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Viaje no encontrado" });
    }

    res.json({ mensaje: "Viaje eliminado correctamente" });
  },
);

  
  

export default router;