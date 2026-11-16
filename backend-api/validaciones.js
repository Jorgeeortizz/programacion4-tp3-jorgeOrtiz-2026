import { body, param, query, validationResult } from "express-validator";
import passport from "passport";

// Validacion de autenticacion
export const validarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

// Validacion de filtros de vehiculos
export const validarFiltrosVehiculos = [
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

// Validacion de filtros de conductores
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

// Validacion de ID
export const validarId = param("id").isInt({ min: 1 });

// Validacion de vehiculo
export const validarVehiculo = [
  body("marca")
    .isString()
    .withMessage("La marca debe ser un texto")
    .trim()
    .notEmpty()
    .withMessage("La marca es obligatoria")
    .isLength({ max: 50 })
    .withMessage("La marca no puede superar los 50 caracteres"),

  body("modelo")
    .isString()
    .withMessage("El modelo debe ser un texto")
    .trim()
    .notEmpty()
    .withMessage("El modelo es obligatorio")
    .isLength({ max: 50 })
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
    .isString()
    .withMessage("El nombre debe ser un texto")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ max: 50 })
    .withMessage("El nombre no puede superar los 50 caracteres"),

  body("apellido")
    .isString()
    .withMessage("El apellido debe ser un texto")
    .trim()
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .isLength({ max: 50 })
    .withMessage("El apellido no puede superar los 50 caracteres"),

  body("numeroDocumento")
    .isInt({ min: 1 })
    .withMessage("El numero de documento debe ser un entero positivo"),

  body("numeroLicencia")
    .isString()
    .withMessage("El numero de licencia debe ser un texto")
    .trim()
    .notEmpty()
    .withMessage("El numero de licencia es obligatorio")
    .isLength({ max: 30 })
    .withMessage("El numero de licencia no puede superar los 30 caracteres"),

  body("fechaAltaLicencia")
    .isISO8601()
    .withMessage("La fecha de alta de licencia debe tener un formato de fecha valido"),

  body("fechaVencimientoLicencia")
    .isISO8601()
    .withMessage("La fecha de vencimiento de licencia debe tener un formato de fecha valido"),
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


// Validacion de usuario
export const validarUsuario = [
  body("nombre")
    .isString()
    .withMessage("El nombre debe ser un texto")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ max: 50 })
    .withMessage("El nombre no puede superar los 50 caracteres"),

  body("email")
    .isEmail()
    .withMessage("Debe ingresar un email valido")
    .normalizeEmail(),

  body("contrasena")
    .isString()
    .withMessage("La contraseña debe ser un texto")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
];

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