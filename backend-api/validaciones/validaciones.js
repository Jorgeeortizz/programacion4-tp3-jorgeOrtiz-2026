import { param, validationResult } from "express-validator";
//import passport from "passport";

// Validacion de autenticacion
/*
export const validarAutenticacion = passport.authenticate("jwt", {
  session: false,
}); 
*/


// Validacion de ID
export const validarId = param("id").isInt({ min: 1 });


// Middleware para verificar validaciones
export const verificarValidaciones = (req, res, next) => {
  const resultadoValidacion = validationResult(req);

  if (!resultadoValidacion.isEmpty()) {
    return res.status(400).json({
      mensaje: "Parametros no validos",
      errores: resultadoValidacion.array(),
    });
  }

  next();
};