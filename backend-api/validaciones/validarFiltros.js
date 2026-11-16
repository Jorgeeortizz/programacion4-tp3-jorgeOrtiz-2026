import {  query } from "express-validator";
//import passport from "passport";


// filtros de vehiculos
export const validarFiltrosVehiculos = [

   query("marca")
    .optional()
    .isString()
    .withMessage("La marca debe ser un texto")
    .trim()
    .isLength({ min: 1, max: 45 })
    .withMessage("La marca debe tener entre 1 y 45 caracteres"),

  query("modelo")
    .optional()
    .isString()
    .withMessage("El modelo debe ser un texto")
    .trim()
    .isLength({ min: 1, max: 45 })
    .withMessage("El modelo debe tener entre 1 y 45 caracteres"),

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
    .isLength({ min: 1, max: 45 })
    .withMessage("El nombre debe tener entre 1 y 45 caracteres"),

  query("apellido")
    .optional()
    .isString()
    .withMessage("El apellido debe ser un texto")
    .trim()
    .isLength({ min: 1, max: 45 })
    .withMessage("El apellido debe tener entre 1 y 45 caracteres"),

   
    

  query("vencimientoMin")
    .optional()
    .isISO8601()
    .withMessage("La fecha mínima de vencimiento debe tener un formato válido"),

  query("vencimientoMax")
    .optional()
    .isISO8601()
    .withMessage("La fecha máxima de vencimiento debe tener un formato válido"),

  query("vencimientoMax").custom((value, { req }) => {
    if (
      value !== undefined &&
      req.query.vencimientoMin !== undefined &&
      new Date(value) < new Date(req.query.vencimientoMin)
    ) {
      throw new Error(
        "vencimientoMax no puede ser anterior a vencimientoMin"
      );
    }

    

    return true;
  }),
];


export const validarFiltrosViajes = [
  query("vehiculo_id").optional().isInt({ min: 1 }).withMessage("vehiculo_id inválido"),
  query("conductor_id").optional().isInt({ min: 1 }).withMessage("conductor_id inválido"),
  query("desde").optional().isISO8601().withMessage("'desde' inválido"),
  query("hasta").optional().isISO8601().withMessage("'hasta' inválido"),
];


export const validarFiltrosKilometros = [
  query("vehiculo_id").optional().isInt({ min: 1 }).withMessage("vehiculo_id inválido"),
  query("conductor_id").optional().isInt({ min: 1 }).withMessage("conductor_id inválido"),
  query().custom((_valor, { req }) => {
    if (!req.query.vehiculo_id && !req.query.conductor_id) {
      throw new Error("Indicá vehiculo_id o conductor_id");
    }
    return true;
  }),
];