import express from "express";
import { db } from "./db.js";

import { validarFiltrosConductores } from "./validaciones/validarFiltros.js";

import { validarConductor } from "./validaciones/validarParametros.js";

import {
  validarId,
  verificarValidaciones,
} from "./validaciones/validaciones.js";

const router = express.Router();


// GET para entregar listado de conductores
router.get(
  "/",
  //validarAutenticacion,
  validarFiltrosConductores,
  verificarValidaciones,
  async (req, res) => {
    const filtros = [];
    const parametros = [];

    const {
      nombre,
      apellido,
      vencimientoMin,
      vencimientoMax,
    } = req.query;

    if (nombre) {
      filtros.push("c.nombre LIKE ?");
      parametros.push(`%${nombre}%`);
    }

    if (apellido) {
      filtros.push("c.apellido LIKE ?");
      parametros.push(`%${apellido}%`);
    }

    if (vencimientoMin !== undefined) {
      filtros.push("c.vencimientoLicencia >= ?");
      parametros.push(vencimientoMin);
    }

    if (vencimientoMax !== undefined) {
      filtros.push("c.vencimientoLicencia <= ?");
      parametros.push(vencimientoMax);
    }

    let sql =
      "SELECT c.id, c.nombre, c.apellido, c.documento, c.licencia, c.altaLicencia, c.vencimientoLicencia " +
      "FROM tablaconductor c";

    if (filtros.length > 0) {
      sql += " WHERE " + filtros.join(" AND ");
      
    }

     sql += " ORDER BY c.apellido, c.nombre";

    const [conductores] = await db.execute(sql, parametros);

    res.send(conductores);
  }
);




router.get(
  "/:id",
  //validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    const sql =
      "SELECT c.id, c.nombre, c.apellido, c.documento, c.licencia, c.altaLicencia, c.vencimientoLicencia " +
      "FROM tablaconductor c " +
      "WHERE c.id = ?";

    const [conductores] = await db.execute(sql, [id]);

    if (conductores.length === 0) {
      return res.status(404).send("Conductor no encontrado");
    }

    res.send(conductores[0]);
  }
);





// crear conductor
router.post(
  "/",
  //validarAutenticacion,
  validarConductor,
  verificarValidaciones,
  async (req, res) => {
    const {
      nombre,
      apellido,
      documento,
      licencia,
      altaLicencia,
      vencimientoLicencia,
    } = req.body;

    const [result] = await db.execute(
      "INSERT INTO tablaconductor (nombre, apellido, documento, licencia, altaLicencia, vencimientoLicencia) VALUES (?, ?, ?, ?, ?, ?)",
      [
        nombre,
        apellido,
        documento,
        licencia,
        altaLicencia,
        vencimientoLicencia,
      ]
    );

    res.status(201).send({
      id: result.insertId,
      nombre,
      apellido,
      documento,
      licencia,
      altaLicencia,
      vencimientoLicencia,
    });
  }
);


//modificar 
router.put(
  "/:id",
  //validarAutenticacion,
  validarId,
  validarConductor,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    const {
      nombre,
      apellido,
      documento,
      licencia,
      altaLicencia,
      vencimientoLicencia,
    } = req.body;

    const [result] = await db.execute(
      "UPDATE tablaconductor SET nombre = ?, apellido = ?, documento = ?, licencia = ?, altaLicencia = ?, vencimientoLicencia = ? WHERE id = ?",
      [
        nombre,
        apellido,
        documento,
        licencia,
        altaLicencia,
        vencimientoLicencia,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Conductor no encontrado");
    }

    res.send({
      id,
      nombre,
      apellido,
      documento,
      licencia,
      altaLicencia,
      vencimientoLicencia,
    });
  }
);

// DELETE: eliminar conductor
router.delete(
  "/:id",
  //validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    const [result] = await db.execute(
      "DELETE FROM tablaconductor WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Conductor no encontrado");
    }

    res.send("Conductor eliminado correctamente");
  }
);



export default router;