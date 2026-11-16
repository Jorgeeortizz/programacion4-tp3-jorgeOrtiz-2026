import express from "express";
import { db } from "./db.js";

import { validarFiltrosVehiculos } from "./validaciones/validarFiltros.js";
import { validarVehiculo } from "./validaciones/validarParametros.js";
import {
  validarId,
  verificarValidaciones,
} from "./validaciones/validaciones.js";
/*import {
  
  validarFiltrosVehiculos,
 
  validarId,
  validarVehiculo,
  verificarValidaciones,
} from "./validaciones.js"; */

const router = express.Router();

// GET para entregar listado de vehículos
router.get(
  "/",
  //validarAutenticacion,
  validarFiltrosVehiculos,
  verificarValidaciones,
  async (req, res) => {
    const filtros = [];
    const parametros = [];

    const {
      marca,
      modelo,
      patente,
      añoMin,
      añoMax,
      capacidadMin,
      capacidadMax,
    } = req.query;

    if (marca) {
      filtros.push("v.marca LIKE ?");
      parametros.push(`%${marca}%`);
    }

    if (modelo) {
      filtros.push("v.modelo LIKE ?");
      parametros.push(`%${modelo}%`);
    }

    if (patente) {
      filtros.push("v.patente LIKE ?");
      parametros.push(`%${patente}%`);
    }

    if (añoMin !== undefined) {
      filtros.push("v.año >= ?");
      parametros.push(Number(añoMin));
    }

    if (añoMax !== undefined) {
      filtros.push("v.año <= ?");
      parametros.push(Number(añoMax));
    }

    if (capacidadMin !== undefined) {
      filtros.push("v.capacidadCarga >= ?");
      parametros.push(Number(capacidadMin));
    }

    if (capacidadMax !== undefined) {
      filtros.push("v.capacidadCarga <= ?");
      parametros.push(Number(capacidadMax));
    }

    let sql =
      "SELECT v.id, v.marca, v.modelo, v.patente, v.año, v.capacidadCarga " +
      "FROM tablavehiculos v";

    if (filtros.length > 0) {
      sql += " WHERE " + filtros.join(" AND ");
    }



    console.log("FILTROS:", filtros);
console.log("PARAMETROS:", parametros);
console.log("SQL FINAL:", sql);



    const [vehiculos] = await db.execute(sql, parametros);

console.log("Año mínimo:", añoMin);
console.log("Año máximo:", añoMax);
console.log("Capacidad mínima:", capacidadMin);
console.log("Capacidad máxima:", capacidadMax);

    res.send(vehiculos);
  }
);


// GET para entregar detalle de vehículo
router.get(
  "/:id",
  //validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    const sql =
      "SELECT v.id, v.marca, v.modelo, v.patente, v.año, v.capacidadCarga " +
      "FROM tablavehiculos v " +
      "WHERE v.id = ?";

    const [vehiculos] = await db.execute(sql, [id]);

    if (vehiculos.length === 0) {
      return res.status(404).send("Vehículo no encontrado");
    }

    res.send(vehiculos[0]);
  },
);

// POST para crear vehículo
router.post(
  "/",
  //validarAutenticacion,
  validarVehiculo,
  verificarValidaciones,
  async (req, res) => {
    const { marca, modelo, patente, año, capacidadCarga } = req.body;

    const [result] = await db.execute(
      "INSERT INTO tablavehiculos (marca, modelo, patente, año, capacidadCarga) VALUES (?, ?, ?, ?, ?)",
      [marca, modelo, patente, año, capacidadCarga],
    );

    res.status(201).send({
      id: result.insertId,
      marca,
      modelo,
      patente,
      año,
      capacidadCarga,
    });
  },
);


// PUT para modificar vehículo
router.put(
  "/:id",
  //validarAutenticacion,
  validarId,
  validarVehiculo,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    const { marca, modelo, patente, año, capacidadCarga } = req.body;

    const [result] = await db.execute(
      "UPDATE tablavehiculos SET marca = ?, modelo = ?, patente = ?, año = ?, capacidadCarga = ? WHERE id = ?",
      [marca, modelo, patente, año, capacidadCarga, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Vehículo no encontrado");
    }

    res.send({
      id,
      marca,
      modelo,
      patente,
      año,
      capacidadCarga,
    });
  },
);

// DELETE para eliminar vehículo
router.delete(
  "/:id",
  //validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    const [result] = await db.execute(
      "DELETE FROM tablavehiculos WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Vehículo no encontrado");
    }

    res.send("Vehículo eliminado correctamente");
  },
);

export default router;