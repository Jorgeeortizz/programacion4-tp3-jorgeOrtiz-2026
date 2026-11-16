import {  query } from "express-validator";
//import passport from "passport";


// filtros de vehiculos
export const validarFiltrosVehiculos = [

   query("marca")
    .optional()
    .isString()
    .withMessage("La marca debe ser un texto")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("La marca debe tener entre 1 y 50 caracteres"),

  query("modelo")
    .optional()
    .isString()
    .withMessage("El modelo debe ser un texto")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("El modelo debe tener entre 1 y 50 caracteres"),

  query("patente")
    .optional()
    .isString()
    .withMessage("La patente debe ser un texto")
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage("La patente debe tener entre 1 y 15 caracteres"),


  query("añoMin")
    .optional()
    .isInt({ min: 1900, max: 2100 })
    .withMessage("El año minimo debe ser un entero valido"),

  query("añoMax")
    .optional()
    .isInt({ min: 1900, max: 2100 })
    .withMessage("El año maximo debe ser un entero valido"),

  query("añoMax").custom((value, { req }) => {
    if (
      value !== undefined &&
      req.query.añoMin !== undefined &&
      Number(value) < Number(req.query.añoMin)
    ) {
      throw new Error("El año maximo no puede ser menor al año minimo");
    }
    return true;
  }),

  query("capacidadMin")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La capacidad minima debe ser un numero igual o mayor a 0"),

  query("capacidadMax")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La capacidad maxima debe ser un numero igual o mayor a 0"),

  query("capacidadMax").custom((value, { req }) => {
    if (
      value !== undefined &&
      req.query.capacidadMin !== undefined &&
      Number(value) < Number(req.query.capacidadMin)
    ) {
      throw new Error("La capacidad maxima no puede ser menor a la capacidad minima");
    }
    return true;
  }),
];



// filtros de conductores
export const validarFiltrosConductores = [
  query("nombre")
    .optional()
    .isString()
    .withMessage("El nombre debe ser un texto")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("El nombre debe tener entre 1 y 50 caracteres"),

  query("apellido")
    .optional()
    .isString()
    .withMessage("El apellido debe ser un texto")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("El apellido debe tener entre 1 y 50 caracteres"),

  query("viajesMin")
    .optional()
    .isInt({ min: 0 })
    .withMessage("La cantidad minima de viajes debe ser un numero entero igual o mayor a 0"),

  query("viajesMax")
    .optional()
    .isInt({ min: 0 })
    .withMessage("La cantidad maxima de viajes debe ser un numero entero igual o mayor a 0"),

  query("viajesMax").custom((value, { req }) => {
    if (
      value !== undefined &&
      req.query.viajesMin !== undefined &&
      Number(value) < Number(req.query.viajesMin)
    ) {
      throw new Error("viajesMax no puede ser menor que viajesMin");
    }
    return true;
  }),
];