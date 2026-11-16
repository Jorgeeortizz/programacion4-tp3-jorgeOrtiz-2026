import express from "express";
import cors from "cors";
import {conectarDB} from "./db.js";
import { validarAutenticacion } from "./validaciones/validaciones.js";
import authRouter, { authConfig } from "./auth.js";
import conductoresRouter from "./conductores.js"
import vehiculosRouter from "./vehiculos.js";
import viajesRouter from "./viajes.js"
import passport from "passport";
//import usuariosRouter from "./usuarios.js";

await conectarDB();
authConfig();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());



app.use(passport.initialize());

app.get("/", (req, res) => {
  
  res.send("primera prueba funcionando");
});


app.use("/vehiculos",validarAutenticacion, vehiculosRouter);
app.use("/conductores",validarAutenticacion, conductoresRouter);
app.use("/viajes", validarAutenticacion,viajesRouter);
app.use("/auth", authRouter);
//app.use("/usuarios", validarAutenticacion, usuariosRouter);

app.listen(port, ()=>{
    console.log(`puerto ${port} funcionando`)
})