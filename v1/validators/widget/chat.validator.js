// ! ================================================================================================================================================
// !                                                             VALIDADOR DE CHAT WEB
// ! ================================================================================================================================================
// @author Ramón Dario Rozo Torres
// @lastModified Ramón Dario Rozo Torres
// @version 1.0.0
// v1/validators/widget/chatWeb.validator.js

// ! REQUIRES
const { body, query } = require('express-validator');

// ! VALIDADORES
// * CREAR
const crear = [
    // todo: Validar campo 'idChatWeb'
    body('idChatWeb')
        .trim()
        .notEmpty().withMessage('El campo "idChatWeb" no puede estar vacío...'),
];

// * FORMULARIO INICIAL
const formularioInicial = [
    // todo: Validar campo 'idChatWeb'
    body('idChatWeb')
        .trim()
        .notEmpty().withMessage('El campo "idChatWeb" no puede estar vacío...'),


    body('camposFormulario.numeroPoliza')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 50 }).withMessage('El número de póliza no debe exceder los 50 caracteres...')
        .matches(/^[A-Za-z0-9\-]+$/).withMessage('El número de póliza solo puede contener letras, números y guiones...'),    

    // El campo nombresApellidos debe cumplir con las reglas del frontend (solo letras esp, espacios, min 2 palabras, entre 3 y 88 caracteres, no vacío)
    body('camposFormulario.nombresApellidos')
        .trim()
        .optional()
        .custom((value, { req }) => {
            if (!value) return true; // Si no se envió, valida con nombres/apellidos abajo
            // Solo letras (incluyendo español) y espacios
            if (!/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/.test(value)) {
                throw new Error('Nombres y apellidos solo puede contener letras y espacios...');
            }
            const nombre = value.trim();
            if (nombre.length === 0) {
                throw new Error('Por favor complete el campo nombres y apellidos...');
            }
            const partes = nombre.split(/\s+/);
            if (partes.length < 2 || nombre.length < 3 || nombre.length > 88) {
                throw new Error('Ingrese sus nombres y apellidos correctamente (al menos dos palabras, entre 3 y 88 caracteres)...');
            }
            return true;
        }),

    // Si no envía nombresApellidos, debe enviar ambos campos separados
    body().custom((value, { req }) => {
        const campos = req.body.camposFormulario || {};
        const nombresApellidos = (campos.nombresApellidos || '').toString().trim();
        const nombres = (campos.nombres || '').toString().trim();
        const apellidos = (campos.apellidos || '').toString().trim();

        if (nombresApellidos) return true; // Validado arriba

        // Si usará nombres/apellidos separados:
        // Solo letras y espacios (esp), mismos requisitos por campo,
        // min/max longitud total y que ambos existan y no sean vacíos
        if (!nombres || !apellidos) {
            throw new Error('Debe enviar el campo "nombresApellidos" o ambos campos "nombres" y "apellidos".');
        }
        const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/;
        if (!soloLetras.test(nombres)) {
            throw new Error('El campo "nombres" solo puede contener letras y espacios...');
        }
        if (!soloLetras.test(apellidos)) {
            throw new Error('El campo "apellidos" solo puede contener letras y espacios...');
        }
        const nombreCompleto = `${nombres} ${apellidos}`.trim();
        if (nombreCompleto.length < 3 || nombreCompleto.length > 88) {
            throw new Error('Nombres y apellidos combinados deben tener entre 3 y 88 caracteres...');
        }
        return true;
    }),


    // validar tipo de documento
    body('camposFormulario.tipoDocumento')
        .trim()
        .notEmpty().withMessage('El campo "Tipo de Documento" no puede estar vacío...')
        .isIn([
            'CC',
            'CE',
            'PEP',
            'PPT',
            'Pasaporte'
        ]).withMessage('El tipo de documento seleccionado no es válido...'),

    body('camposFormulario.numeroDocumento')
        .trim()
        .notEmpty().withMessage('El campo "Número de Documento" no puede estar vacío...')
        .isLength({ min: 5, max: 20 }).withMessage('El número de documento debe tener entre 5 y 20 caracteres...'),

    body('camposFormulario.numeroContacto')
        .trim()
        .notEmpty().withMessage('El campo "Número Celular" no puede estar vacío...'),

    body('camposFormulario.correoElectronico')
        .trim()
        .notEmpty().withMessage('El campo "Correo Electrónico" no puede estar vacío...'),

    body('camposFormulario.autorizacionDatosPersonales')
        .trim()
        .notEmpty().withMessage('El campo "Autorización de Datos Personales" no puede estar vacío...'),
];

// * OPCIONES CONTROL API
const opcionesControlApi = [
    // todo: No se valida nada
];

// * MONITOR
const monitor = [
    // todo: Validar campo 'fechaInicial'
    body('fechaInicial')
        .trim()
        .notEmpty().withMessage('El campo "Fecha Inicial" no puede estar vacío...')
        .custom(value => {
            if (value !== '-' && !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
                throw new Error('El campo "Fecha Inicial" debe estar en el formato yyyy-mm-dd hh:mm:ss o ser "-".');
            }
            return true;
        }),

    // todo: Validar campo 'fechaFinal'
    body('fechaFinal')
        .trim()
        .notEmpty().withMessage('El campo "Fecha Final" no puede estar vacío...')
        .custom((value, { req }) => {
            if (value !== '-' && !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
                throw new Error('El campo "Fecha Final" debe estar en el formato yyyy-mm-dd hh:mm:ss o ser "-".');
            }
            if (value !== '-' && req.body.fechaInicial !== '-') {
                const fechaInicial = new Date(req.body.fechaInicial);
                const fechaFinal = new Date(value);
                if (fechaFinal < fechaInicial) {
                    throw new Error('La fecha final no puede ser menor que la fecha inicial.');
                }
            }
            return true;
        }),

    // todo: Validar campo 'opcionControlApi'
    body('opcionControlApi')
        .trim()
        .notEmpty().withMessage('El campo "Control Arbol" no puede estar vacío...')
        .isLength({ min: 1, max: 44 }).withMessage('El campo "Control Arbol" debe tener entre 1 y 44 caracteres.'),

    // todo Validar campo 'numeroLimite'
    body('numeroLimite')
        .trim()
        .optional()
        .isInt({ gt: 0 }).withMessage('El campo "Límite" debe ser un número mayor que cero.'),

    // todo Validar campo 'numeroDesplazamiento'
    body('numeroDesplazamiento')
        .trim()
        .optional()
        .isInt({ gte: 0 }).withMessage('El campo "Desplazamiento" debe ser un número mayor o igual a cero.')
];

// * LISTAR ARCHIVOS ADJUNTOS
const listarArchivosAdjuntos = [
    // todo: Validar campo 'idChat'
    query('idChat')
        .trim()
        .notEmpty().withMessage('El campo "idChat" no puede estar vacío...'),
];

// * FILTRAR
const filtrar = [
    // todo: Validar campo 'idChatWeb'
    query('idChatWeb')
        .trim()
        .notEmpty().withMessage('El campo "idChatWeb" no puede estar vacío...'),
];

// * CERRAR
const cerrar = [
    // todo: Validar campo 'idChatWeb'
    body('idChatWeb')
        .trim()
        .notEmpty().withMessage('El campo "idChatWeb" no puede estar vacío...'),
];

// * CERRAR CHAT DESDE SOUL CHAT
const cerrarSoulChat = [
    // todo: Validar campo 'idChat'
    body('idChat')
        .trim()
        .notEmpty().withMessage('El campo "idChat" no puede estar vacío...')
        .isInt({ gt: 0 }).withMessage('El campo "idChat" debe ser un número entero mayor que cero.'),

    // todo: Validar campo 'remitente'
    body('remitente')
        .trim()
        .notEmpty().withMessage('El campo "remitente" no puede estar vacío...')
];

// ! EXPORTACIONES
module.exports = {
    crear,
    formularioInicial,
    opcionesControlApi,
    monitor,
    listarArchivosAdjuntos,
    filtrar,
    cerrar,
    cerrarSoulChat,
};
