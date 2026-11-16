
import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones/validaciones.js";
import {validarRegistro,validarLogin} from "./validaciones/validarParametros.js";


import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();


//config passport y estrategia
export function authConfig() {

  if (!process.env.JWT_SECRET) {
    throw new Error("Falta configurar JWT_SECRET en el archivo .env");
  }

  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use("jwt",
    new Strategy(jwtOptions, async (payload, done) => {
      try {

        // validar token
        if (!Number.isInteger(payload.id)) {
          return done(null, false);
        }

       
        const [usuarios] = await db.execute(
          "SELECT id, nombre, email FROM tablausuarios WHERE id = ?",
          [payload.id]
        );

        if (usuarios.length === 0) {
          return done(null, false);
        }

        // Usuario autenticado
        return done(null, usuarios[0]);

      } catch (error) {
        return done(error, false);
      }
    })
  );
}


router.post(
  "/register",
  validarRegistro,
  verificarValidaciones,
  async (req, res) => {

    try {
      const { nombre, email, password } = req.body;

      // Encriptacion
      const passwordEncriptada = await bcrypt.hash(password, 12);

      
      const [resultado] = await db.execute(
        `INSERT INTO tablausuarios (nombre, email, password)
         VALUES (?, ?, ?)`,
        [nombre, email, passwordEncriptada]
      );

      res.status(201).json({
        mensaje: "Usuario registrado correctamente",
        usuario: {
          id: resultado.insertId,
          nombre,
          email,
        },
      });

    } catch (error) {

      // Email duplicado
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          mensaje: "El email ya se encuentra registrado",
        });
      }

      console.error(error);

      res.status(500).json({
        mensaje: "Error interno al registrar el usuario",
      });
    }
  }
);



router.post(
  "/login",
  validarLogin,
  verificarValidaciones,
  async (req, res) => {

    try {
      const { email, password } = req.body;

      // Buscar usuario
      const [usuarios] = await db.execute(
        `SELECT id, nombre, email, password
         FROM tablausuarios
         WHERE email = ?`,
        [email]
      );

      if (usuarios.length === 0) {
        return res.status(401).json({
          mensaje: "Email o contraseña incorrectos",
        });
      }

      const usuario = usuarios[0];

      // Comparar contraseña 
      const passwordValida = await bcrypt.compare(
        password,
        usuario.password
      );

      if (!passwordValida) {
        return res.status(401).json({
          mensaje: "Email o contraseña incorrectos",
        });
      }

      // Generar token 
      const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: "4h" }
      );

      res.status(200).json({
        mensaje: "Inicio de sesion correcto",
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
        },
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        mensaje: "Error interno al iniciar sesion",
      });
    }
  }
);


export default router;


