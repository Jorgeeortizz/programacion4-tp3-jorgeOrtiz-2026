import express from "express";
import cors from "cors";
import {conectarDB} from "./db.js";

import vehiculosRouter from "./vehiculos.js";

conectarDB();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  // Responder con string
  res.send("primera prueba funcionando");
});


app.use("/vehiculos", vehiculosRouter);

app.listen(port, ()=>{
    console.log(`puerto ${port} funcionando`)
})