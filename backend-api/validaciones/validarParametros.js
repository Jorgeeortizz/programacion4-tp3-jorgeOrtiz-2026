import { body } from "express-validator";
//import passport from "passport";



// Validacion de vehiculo
export const validarVehiculo = [
  body("marca")
    .isString()
    .withMessage("La marca debe ser un texto")
    .trim()
    .notEmpty()
    .withMessage("La marca es obligatoria")
    .isLength({ max: 45 })
    .withMessage("La marca no puede superar los 50 caracteres"),

  body("modelo")
    .isString()
    .withMessage("El modelo debe ser un texto")
    .trim()
    .notEmpty()
    .withMessage("El modelo es obligatorio")
    .isLength({ max: 45 })
    .withMessage("El modelo no puede superar los 50 caracteres"),

  body("patente")
    .isString()
    .withMessage("La patente debe ser un texto")
    .trim()
    .notEmpty()
    .withMessage("La patente es obligatoria")
    .isLength({ min: 1, max: 15 })
    .withMessage("La patente debe tener entre 1 y 15 caracteres"),

  body("año")
    .isInt({ min: 1900, max: 2100 })
    .withMessage("El año debe ser un numero entero valido"),

  body("capacidadCarga")
    .isFloat({ min: 0 })
    .withMessage("La capacidad de carga debe ser un numero igual o mayor a 0"),
];

// Validacion de conductor

export const validarConductor = [
  body("nombre")
    .trim()
    .matches(/^[\p{L} '-]{1,50}$/u)
    .withMessage("El nombre es obligatorio: solo letras, hasta 50 caracteres"),

  body("apellido")
    .trim()
    .matches(/^[\p{L} '-]{1,50}$/u)
    .withMessage("El apellido es obligatorio: solo letras, hasta 50 caracteres"),

  body("documento")
    .trim()
    .matches(/^\d{7,8}$/)
    .withMessage("El número de documento debe tener 7 u 8 dígitos"),

  body("licencia")
    .trim()
    .isAlphanumeric()
    .isLength({ min: 5, max: 20 })
    .withMessage("El número de licencia debe ser alfanumérico (5 a 20 caracteres)"),

  body("altaLicencia")
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage("La fecha de alta debe tener formato AAAA-MM-DD"),

  body("vencimientoLicencia")
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage("La fecha de vencimiento debe tener formato AAAA-MM-DD")
    .custom((vencimiento, { req }) => {
      return vencimiento > req.body.altaLicencia;
    })
    .withMessage("El vencimiento debe ser posterior a la fecha de alta"),
];


// Validacion de viaje
export const validarViaje = [
  body("vehiculo_id")
    .isInt({ min: 1 })
    .withMessage("vehiculo_id debe ser un numero entero positivo"),

  body("conductor_id")
    .isInt({ min: 1 })
    .withMessage("conductor_id debe ser un numero entero positivo"),

  body("fechaSalida")
    .isISO8601()
    .withMessage("La fecha de salida debe tener un formato valido"),

  body("fechaLlegada")
    .isISO8601()
    .withMessage("La fecha de llegada debe tener un formato valido")
    .custom((value, { req }) => {
      if (
        req.body.fechaSalida &&
        new Date(value) < new Date(req.body.fechaSalida)
      ) {
        throw new Error("La fecha de llegada no puede ser anterior a la fecha de salida");
      }
      return true;
    }),

  body("origen")
    .isString()
    .withMessage("El origen debe ser un texto")
    .trim()
    .notEmpty()
    .withMessage("El origen es obligatorio")
    .isLength({ max: 100 })
    .withMessage("El origen no puede superar los 100 caracteres"),

  body("destino")
    .isString()
    .withMessage("El destino debe ser un texto")
    .trim()
    .notEmpty()
    .withMessage("El destino es obligatorio")
    .isLength({ max: 100 })
    .withMessage("El destino no puede superar los 100 caracteres"),

  body("kilometros")
    .isFloat({ min: 0 })
    .withMessage("Los kilometros deben ser un numero igual o mayor a 0"),

  body("observaciones")
    .optional()
    .isString()
    .withMessage("Las observaciones deben ser un texto")
    .isLength({ max: 500 })
    .withMessage("Las observaciones no pueden superar los 500 caracteres"),
];


// Validacion de registro de usuario
export const validarRegistro = [
  body("nombre")
    .isString()
    .withMessage("El nombre debe ser un texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .bail()
    .isLength({ max: 45 })
    .withMessage("El nombre no puede superar los 50 caracteres"),

  body("email")
    .isEmail()
    .withMessage("Debe ingresar un email valido")
    .bail()
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("La contraseña debe ser un texto")
    .bail()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
];


// Validacion de inicio de sesion
export const validarLogin = [
  body("email")
    .isEmail()
    .withMessage("Debe ingresar un email valido")
    .bail()
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("La contraseña debe ser un texto")
    .bail()
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),
];