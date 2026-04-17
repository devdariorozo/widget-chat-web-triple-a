// ! ================================================================================================================================================
// !                                                      CONTROLADORES PARA MENSAJE
// ! ================================================================================================================================================
// @author Ramón Dario Rozo Torres
// @lastModified Ramón Dario Rozo Torres
// @version 1.0.0
// v1/controllers/widget/mensaje.controller.js

// ! REQUIRES
const moment = require('moment');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, './../../.env') });
const { decrypt } = require('../../utils/cryptoData.js');
const model = require('../../models/widget/mensaje.model.js');
const dataEstatica = require('../../seeds/dataEstatica.js');
const modelChat = require('../../models/widget/chat.model.js');
const modelArbolPrincipal = require('../../models/widget/arbol/arbolPrincipal.model.js');
const modelArbolTramite = require('../../models/widget/arbol/arbolTramite.model.js');
const serviceSoulChat = require('../../services/serviceSoulChat.service.js');
const logger = require('../../logger');
const { getOrigen, getDestino, getContextoRecurso } = require('../../logger/context');

// ! CONTROLADORES
// * CREAR
const crear = async (req, res) => {
    try {
        logger.info({
            contexto: 'controller',
            recurso: 'mensaje.crear',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            body: req.body
        }, 'Controller mensaje.controller.js → crear');
        // todo: Validar los datos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn({
                contexto: 'controller',
                recurso: 'mensaje.crear',
                origen: getOrigen(req),
                destino: getDestino(req),
                contextoRecurso: getContextoRecurso(req),
                codigoRespuesta: 400,
                rta: errors.array()[0].msg,
                erroresValidacion: errors.array()
            }, 'Error de validación en mensaje.crear');
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Widget Chat Web Triple A',
                message: errors.array()[0].msg
            });
        }

        // todo: Obtener los datos de la petición
        const {
            idChatWeb,
            mensaje
        } = req.body;

        // todo: Validar si el chat existe
        const verificarChat = await modelChat.filtrar(idChatWeb);
        if (verificarChat.length > 0) {
            // todo: Preparamos los datos por defecto
            let idChat = verificarChat[0].ID_CHAT;
            let remitente = idChatWeb;
            let estadoMensaje = dataEstatica.configuracion.estadoMensaje.recibido;
            let tipoMensaje = dataEstatica.configuracion.tipoMensaje.texto;
            let contenido = mensaje;
            let enlaces = '-';
            let lectura = dataEstatica.configuracion.lecturaMensaje.noLeido;
            let descripcion = 'Se crea el mensaje con éxito.';
            let estadoRegistro = dataEstatica.configuracion.estadoRegistro.activo;
            let responsable = dataEstatica.configuracion.responsable;

            // todo: Crear el registro
            const result = await model.crear(idChat, remitente, estadoMensaje, tipoMensaje, contenido, enlaces, lectura, descripcion, estadoRegistro, responsable);

            // todo: Enviar respuesta
            if (result) {

                // todo: Navegar arbol chat bot
                const resultArbol = await modelArbolPrincipal.arbolPrincipal(remitente, contenido);
                
                // Si resultArbol es false (mensaje duplicado), aún consideramos exitoso el envío
                // Si resultArbol es undefined, hay un problema
                if (resultArbol !== undefined) {
                    // todo: Enviar respuesta
                    logger.info({
                        contexto: 'controller',
                        recurso: 'mensaje.crear',
                        origen: getOrigen(req),
                        destino: getDestino(req),
                        contextoRecurso: getContextoRecurso(req),
                        codigoRespuesta: 200,
                        rta: 'El mensaje se ha creado correctamente en el sistema.',
                        idChat,
                        remitente
                    }, 'Mensaje creado exitosamente');
                    return res.json({
                        status: 200,
                        type: 'success',
                        title: 'Widget Chat Web Triple A',
                        message: 'El mensaje se ha creado correctamente en el sistema.',
                    });
                }
            }
        } else {
            // todo: Enviar respuesta
            logger.warn({
                contexto: 'controller',
                recurso: 'mensaje.crear',
                origen: getOrigen(req),
                destino: getDestino(req),
                contextoRecurso: getContextoRecurso(req),
                codigoRespuesta: 400,
                rta: 'El chat no existe en el sistema.',
                idChatWeb
            }, 'Intento de crear mensaje sin chat existente');
            res.json({
                status: 400,
                type: 'warning',
                title: 'Widget Chat Web Triple A',
                message: 'El chat no existe en el sistema.'
            });
        }
    } catch (error) {
        logger.error({
            contexto: 'controller',
            recurso: 'mensaje.crear',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack
        }, 'Error en v1/controllers/widget/mensaje.controller.js → crear');
        res.status(500).json({
            status: 500,
            type: 'error',
            title: 'Widget Chat Web Triple A',
            message: 'No se pudo crear el mensaje, por favor intenta de nuevo o comunícate con nosotros.',
            error: error.message
        });
    }
};

// * CREAR MENSJAJE DESDE SOUL CHAT
const crearSoulChat = async (req, res) => {
    try {
        logger.info({
            contexto: 'controller',
            recurso: 'mensaje.crearSoulChat',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            body: req.body
        }, 'Controller mensaje.controller.js → crearSoulChat');
        // todo: Validar los datos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn({
                contexto: 'controller',
                recurso: 'mensaje.crearSoulChat',
                origen: getOrigen(req),
                destino: getDestino(req),
                contextoRecurso: getContextoRecurso(req),
                codigoRespuesta: 400,
                rta: errors.array()[0].msg,
                erroresValidacion: errors.array()
            }, 'Error de validación en mensaje.crearSoulChat');
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Widget Chat Web Triple A',
                message: errors.array()[0].msg
            });
        }

        // todo: Obtener los datos de la petición
        const {
            idChat,
            remitente,
            estado,
            tipo,
            contenido,
            adjuntos
        } = req.body;

        // todo: Data por defecto
        const lectura = dataEstatica.configuracion.lecturaMensaje.noLeido;
        const descripcion = 'Se crea el mensaje solicitado por soul chat con éxito.';
        const registro = dataEstatica.configuracion.estadoRegistro.activo;
        const responsable = dataEstatica.configuracion.responsable;

        // Por defecto, el contenido es el que viene de SoulChat
        let contenidoFinal = contenido;

        // ! Manejo de adjuntos
        // - enlacesChatFinal: todas las rutas consolidadas (received + send) para tbl_chat
        // - enlacesMensajeFinal: solo las rutas de carpeta send (lo que nosotros enviamos al cliente) para tbl_mensaje
        let enlacesChatFinal = '-';
        let enlacesMensajeFinal = '-';
        // Soportar tanto single file (req.file) como array (req.files)
        const archivos = (Array.isArray(req.files) && req.files.length > 0)
            ? req.files
            : (req.file ? [req.file] : []);
        const tieneArchivos = archivos && archivos.length > 0;

        if (tieneArchivos) {
            // Validar extensiones de archivos
            const allowedExtensions = ['pdf', 'xls', 'xlsx', 'jpg', 'png', 'doc', 'docx'];
            const invalidFiles = archivos.filter(file => {
                const fileExtension = file.originalname.split('.').pop().toLowerCase();
                return !allowedExtensions.includes(fileExtension);
            });

            if (invalidFiles.length > 0) {
                logger.warn({
                    contexto: 'controller',
                    recurso: 'mensaje.crearSoulChat',
                    origen: getOrigen(req),
                    destino: getDestino(req),
                    contextoRecurso: getContextoRecurso(req),
                    codigoRespuesta: 400,
                    rta: 'Algunos archivos tienen extensiones no permitidas.'
                }, 'Adjuntos SoulChat con extensiones inválidas');
                return res.status(400).json({
                    status: 400,
                    type: 'warning',
                    title: 'Widget Chat Web Triple A',
                    message: 'Algunos archivos tienen extensiones no permitidas.'
                });
            }

            // Crear estructura de carpetas: uploads/files/{idChat}-{remitente}/send/
            const nombreCarpetaChat = `${idChat}-${remitente}`;
            const chatDir = path.join(__dirname, '../../uploads/files', nombreCarpetaChat);
            const receivedDir = path.join(chatDir, 'received');
            const sendDir = path.join(chatDir, 'send');
            
            // Crear carpetas si no existen
            if (!fs.existsSync(chatDir)) {
                fs.mkdirSync(chatDir, { recursive: true });
            }
            if (!fs.existsSync(receivedDir)) {
                fs.mkdirSync(receivedDir, { recursive: true });
                // Crear .gitkeep en received
                const gitkeepReceived = path.join(receivedDir, '.gitkeep');
                if (!fs.existsSync(gitkeepReceived)) {
                    fs.writeFileSync(gitkeepReceived, '');
                }
            }
            if (!fs.existsSync(sendDir)) {
                fs.mkdirSync(sendDir, { recursive: true });
                // Crear .gitkeep en send
                const gitkeepSend = path.join(sendDir, '.gitkeep');
                if (!fs.existsSync(gitkeepSend)) {
                    fs.writeFileSync(gitkeepSend, '');
                }
            }

            // Mover archivos a la carpeta send (archivos de SoulChat)
            const nuevosEnlaces = archivos.map(file => {
                const filePath = path.join(sendDir, file.originalname);
                fs.renameSync(file.path, filePath);
                return `/files/${nombreCarpetaChat}/send/${file.originalname}`;
            }).join('|');

            // Obtener enlaces existentes
            const chatEnlaces = await modelChat.filtrarEnlaces(idChat);
            const enlacesExistentes = chatEnlaces && chatEnlaces.RUTA_ADJUNTOS && chatEnlaces.RUTA_ADJUNTOS !== '-' ? chatEnlaces.RUTA_ADJUNTOS : '';

            // Concatenar enlaces para el chat (received + send)
            enlacesChatFinal = enlacesExistentes ? `${enlacesExistentes}|${nuevosEnlaces}` : nuevosEnlaces;

            // Actualizar el campo cht_ruta_adjuntos y cht_adjuntos en tbl_chat
            await modelArbolPrincipal.actualizarRutaAdjuntos(idChat, enlacesChatFinal);

            // IMPORTANTE: Para el mensaje que ve el usuario, solo usamos los adjuntos del mensaje actual (nuevosEnlaces)
            // No todos los adjuntos send acumulados, solo los que se acaban de recibir en este mensaje específico
            const enlacesParaMensaje = nuevosEnlaces.split('|').filter(e => e.trim());
            enlacesMensajeFinal = enlacesParaMensaje.length > 0 ? enlacesParaMensaje.join('|') : '-';

            // Construir mensaje HTML con SOLO los adjuntos del mensaje actual (nuevosEnlaces)
            // IGNORAR el contenido que viene de SoulChat si hay archivos, ya que puede contener referencias a todos los adjuntos acumulados
            const APP_URL = process.env.APP_URL || '';
            const enlacesArray = enlacesParaMensaje;

            // Asegurarse de que solo se muestren los adjuntos send del mensaje actual
            // Filtrar explícitamente para asegurar que solo sean send y del mensaje actual
            const enlacesSendActuales = enlacesArray.filter(enlace => {
                const enlaceNormalizado = enlace.trim();
                return enlaceNormalizado.includes('/send/') && !enlaceNormalizado.includes('/received/');
            });

            let mensajeConArchivos = '<p class="mensajeAdjuntosChatbot">📎 <b>He adjuntado los siguientes archivos:</b><br/><br/>';
            enlacesSendActuales.forEach(enlace => {
                const nombreArchivo = enlace.split('/').pop();
                const rutaCompleta = `${APP_URL}/uploads${enlace}`;
                mensajeConArchivos += `📄 <a href="${rutaCompleta}" target="_blank">${nombreArchivo}</a><br/>`;
            });
            mensajeConArchivos += '</p>';

            // Actualizar enlacesMensajeFinal para que solo contenga los send del mensaje actual
            enlacesMensajeFinal = enlacesSendActuales.length > 0 ? enlacesSendActuales.join('|') : '-';
            
            // IMPORTANTE: Cuando hay archivos nuevos, SIEMPRE usar el mensaje construido con solo los adjuntos del mensaje actual
            // IGNORAR completamente el contenido que viene de SoulChat, ya que puede contener referencias a todos los adjuntos acumulados
            contenidoFinal = mensajeConArchivos;
            
            logger.info({
                contexto: 'controller',
                recurso: 'mensaje.crearSoulChat',
                idChat,
                remitente,
                accion: 'construyendo_mensaje_adjuntos',
                adjuntosNuevos: enlacesSendActuales.length,
                enlacesSendActuales: enlacesSendActuales,
                contenidoOriginalIgnorado: contenido ? 'Si' : 'No'
            }, '📎 Construyendo mensaje con solo adjuntos del mensaje actual (send)');
        }

        // Si no hubo adjuntos en este mensaje, mantener enlacesMensajeFinal en '-'
        if (!tieneArchivos) {
            enlacesMensajeFinal = '-';
        }

        // todo: Crear el registro
        const result = await model.crearSoulChat(
            idChat,
            remitente,
            estado,
            tipo,
            contenidoFinal,
            enlacesMensajeFinal,
            lectura,
            descripcion,
            registro,
            responsable
        );
        
        // todo: Enviar respuesta
        if (result) {
            // todo: Enviar respuesta
            logger.info({
                contexto: 'controller',
                recurso: 'mensaje.crearSoulChat',
                origen: getOrigen(req),
                destino: getDestino(req),
                contextoRecurso: getContextoRecurso(req),
                codigoRespuesta: 200,
                rta: 'El mensaje se ha creado correctamente en el sistema.',
                idChat,
                remitente
            }, 'Mensaje Soul Chat creado exitosamente');
            return res.json({
                status: 200,
                type: 'success',
                title: 'Widget Chat Web Triple A',
                message: 'El mensaje se ha creado correctamente en el sistema.',
            });
        }
    } catch (error) {
        logger.error({
            contexto: 'controller',
            recurso: 'mensaje.crearSoulChat',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack
        }, 'Error en v1/controllers/widget/mensaje.controller.js → crearSoulChat');
        res.status(500).json({
            status: 500,
            type: 'error',
            title: 'Widget Chat Web Triple A',
            message: 'No se pudo crear el mensaje, por favor intenta de nuevo o comunícate con nosotros.',
            error: error.message
        });
    }
};

// * CREAR MENSJAJE DESDE SOUL CHAT - PASO WIDGET ARBOL ENCUESTA
const encuestaSoulChat = async (req, res) => {
    try {
        logger.info({
            contexto: 'controller',
            recurso: 'mensaje.encuestaSoulChat',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            body: req.body
        }, 'Controller mensaje.controller.js → encuestaSoulChat');
        // todo: Validar los datos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn({
                contexto: 'controller',
                recurso: 'mensaje.encuestaSoulChat',
                origen: getOrigen(req),
                destino: getDestino(req),
                contextoRecurso: getContextoRecurso(req),
                codigoRespuesta: 400,
                rta: errors.array()[0].msg,
                erroresValidacion: errors.array()
            }, 'Error de validación en mensaje.encuestaSoulChat');
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Widget Chat Web Triple A',
                message: errors.array()[0].msg
            });
        }

        // todo: Obtener los datos de la petición
        const {
            idChat,
            remitente,
            estado,
            tipo,
            contenido,
            enlaces
        } = req.body;

        // todo: Data por defecto
        const solicitoInicioEncuestaArbol = dataEstatica.arbol.solicitoInicioEncuesta;
        const mensajeSolicitoInicioEncuesta = dataEstatica.mensajes.solicitoInicioEncuesta;
        const lectura = dataEstatica.configuracion.lecturaMensaje.noLeido;
        const descripcion = 'Se crea el mensaje solicitado por soul chat - Se solicita inicio de encuesta.';
        const registro = dataEstatica.configuracion.estadoRegistro.activo;
        const responsable = dataEstatica.configuracion.responsable;

        // todo: Actualizar el chat
        const updateChat = await modelChat.encuestaSoulChat(idChat, solicitoInicioEncuestaArbol, descripcion);
        if (updateChat) {

            // todo: Crear el registro - Solicitando inicio de encuesta
            const resultMensajeSolicitoInicioEncuesta = await model.encuestaSoulChat(idChat, remitente, estado, tipo, mensajeSolicitoInicioEncuesta, enlaces, lectura, descripcion, registro, responsable);
            
            // todo: Si el mensaje solicitando inicio de encuesta se creó correctamente, se envía la respuesta
            if (resultMensajeSolicitoInicioEncuesta) {
                // todo: Enviar respuesta
                logger.info({
                    contexto: 'controller',
                    recurso: 'mensaje.encuestaSoulChat',
                    origen: getOrigen(req),
                    destino: getDestino(req),
                    contextoRecurso: getContextoRecurso(req),
                    codigoRespuesta: 200,
                    rta: 'El mensaje se ha creado correctamente en el sistema.',
                    idChat,
                    remitente
                }, 'Mensaje Soul Chat - paso a widget árbol encuesta - creado exitosamente');
                return res.json({
                    status: 200,
                    type: 'success',
                    title: 'Widget Chat Web Triple A',
                    message: 'El mensaje se ha creado correctamente en el sistema.',
                });
            }
        }
    } catch (error) {
        logger.error({
            contexto: 'controller',
            recurso: 'mensaje.encuestaSoulChat',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack
        }, 'Error en v1/controllers/widget/mensaje.controller.js → encuestaSoulChat');
        res.status(500).json({
            status: 500,
            type: 'error',
            title: 'Widget Chat Web Triple A',
            message: 'No se pudo crear el mensaje, por favor intenta de nuevo o comunícate con nosotros.',
            error: error.message
        });
    }
};

// * LISTAR NO LEÍDOS
const listarNoLeido = async (req, res) => {
    try {
        logger.info({
            contexto: 'controller',
            recurso: 'mensaje.listarNoLeido',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            query: req.query
        }, 'Controller mensaje.controller.js → listarNoLeido');
        // todo: Validar los datos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn({
                contexto: 'controller',
                recurso: 'mensaje.listarNoLeido',
                origen: getOrigen(req),
                destino: getDestino(req),
                contextoRecurso: getContextoRecurso(req),
                codigoRespuesta: 400,
                rta: errors.array()[0].msg,
                erroresValidacion: errors.array()
            }, 'Error de validación en mensaje.listarNoLeido');
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Widget Chat Web Triple A',
                message: errors.array()[0].msg
            });
        }

        // todo: Obtener los datos de la petición
        const {
            idChatWeb
        } = req.query;

        // todo: Valores por defecto
        let lectura = dataEstatica.configuracion.lecturaMensaje.noLeido;

        // todo: Listar los mensajes
        const result = await model.listarNoLeido(idChatWeb, lectura);

        if (result) {
            // todo: Enviar respuesta
            logger.info({
                contexto: 'controller',
                recurso: 'mensaje.listarNoLeido',
                origen: getOrigen(req),
                destino: getDestino(req),
                contextoRecurso: getContextoRecurso(req),
                codigoRespuesta: 200,
                rta: 'Los mensajes se han listado correctamente en el sistema.',
                totalMensajes: result.length,
                idChatWeb
            }, 'Mensajes no leídos listados exitosamente');
            res.json({
                status: 200,
                type: 'success',
                title: 'Widget Chat Web Triple A',
                message: 'Los mensajes se han listado correctamente en el sistema.',
                data: result
            });
        }
    } catch (error) {
        logger.error({
            contexto: 'controller',
            recurso: 'mensaje.listarNoLeido',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack
        }, 'Error en v1/controllers/widget/mensaje.controller.js → listarNoLeido');
        res.status(500).json({
            status: 500,
            type: 'error',
            title: 'Widget Chat Web Triple A',
            message: 'No se pudo listar los mensajes, por favor intenta de nuevo o comunícate con nosotros.',
            error: error.message
        });
    }
};

// * LEER
const leer = async (req, res) => {
    try {
        logger.info({
            contexto: 'controller',
            recurso: 'mensaje.leer',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            body: req.body
        }, 'Controller mensaje.controller.js → leer');
        // todo: Validar los datos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn({
                contexto: 'controller',
                recurso: 'mensaje.leer',
                origen: getOrigen(req),
                destino: getDestino(req),
                contextoRecurso: getContextoRecurso(req),
                codigoRespuesta: 400,
                rta: errors.array()[0].msg,
                erroresValidacion: errors.array()
            }, 'Error de validación en mensaje.leer');
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Widget Chat Web Triple A',
                message: errors.array()[0].msg
            });
        }

        // todo: Obtener los datos de la petición
        const {
            idMensaje
        } = req.body;

        // todo: Valores por defecto
        let lectura = dataEstatica.configuracion.lecturaMensaje.leido;

        // todo: Leer el mensaje
        const result = await model.leer(idMensaje, lectura);

        if (result) {
        // todo: Enviar respuesta
        logger.info({
            contexto: 'controller',
            recurso: 'mensaje.leer',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            codigoRespuesta: 200,
            rta: 'El mensaje se ha leído correctamente en el sistema.',
            idMensaje
        }, 'Mensaje leído exitosamente');
        res.json({
            status: 200,
                type: 'success',
                title: 'Widget Chat Web Triple A',
                message: 'El mensaje se ha leído correctamente en el sistema.',
            });
        }
    } catch (error) {
        logger.error({
            contexto: 'controller',
            recurso: 'mensaje.leer',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack
        }, 'Error en v1/controllers/widget/mensaje.controller.js → leer');
        res.status(500).json({
            status: 500,
            type: 'error',
            title: 'Widget Chat Web Triple A',
            message: 'No se pudo leer el mensaje, por favor intenta de nuevo o comunícate con nosotros.',
            error: error.message
        });
    }
};

// * ADJUNTAR ARCHIVOS
const adjuntarArchivos = async (req, res) => {
    try {
        logger.info({
            contexto: 'controller',
            recurso: 'mensaje.adjuntarArchivos',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            body: req.body
        }, 'Controller mensaje.controller.js → adjuntarArchivos');
        // Validar los datos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn({
                contexto: 'controller',
                recurso: 'mensaje.adjuntarArchivos',
                origen: getOrigen(req),
                destino: getDestino(req),
                contextoRecurso: getContextoRecurso(req),
                codigoRespuesta: 400,
                rta: errors.array()[0].msg,
                erroresValidacion: errors.array()
            }, 'Error de validación en mensaje.adjuntarArchivos');
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Widget Chat Web Triple A',
                message: errors.array()[0].msg
            });
        }

        // Obtener los datos de la petición
        const { idChatWeb, mensaje } = req.body;
        const archivos = req.files;

        if (!archivos || archivos.length === 0) {
            logger.warn({
                contexto: 'controller',
                recurso: 'mensaje.adjuntarArchivos',
                origen: getOrigen(req),
                destino: getDestino(req),
                contextoRecurso: getContextoRecurso(req),
                codigoRespuesta: 400,
                rta: 'No se han recibido archivos.'
            }, 'Adjuntar archivos - sin archivos recibidos');
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Widget Chat Web Triple A',
                message: 'No se han recibido archivos.'
            });
        }

        // Validar extensiones de archivos
        const allowedExtensions = ['pdf', 'xls', 'xlsx', 'jpg', 'png', 'doc', 'docx'];
        const invalidFiles = archivos.filter(file => {
            const fileExtension = file.originalname.split('.').pop().toLowerCase();
            return !allowedExtensions.includes(fileExtension);
        });

        if (invalidFiles.length > 0) {
            logger.warn({
                contexto: 'controller',
                recurso: 'mensaje.adjuntarArchivos',
                origen: getOrigen(req),
                destino: getDestino(req),
                contextoRecurso: getContextoRecurso(req),
                codigoRespuesta: 400,
                rta: 'Algunos archivos tienen extensiones no permitidas.'
            }, 'Adjuntar archivos - extensiones inválidas');
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Widget Chat Web Triple A',
                message: 'Algunos archivos tienen extensiones no permitidas.'
            });
        }

        // Validar si el chat existe
        const verificarChat = await modelChat.filtrar(idChatWeb);
        if (verificarChat.length > 0) {
            const idChat = verificarChat[0].ID_CHAT;
            const remitente = idChatWeb;
            const estadoMensaje = dataEstatica.configuracion.estadoMensaje.recibido; // No leído
            const tipoMensaje = dataEstatica.configuracion.tipoMensaje.adjuntos; // Adjuntos

            // Crear estructura de carpetas: uploads/files/{idChat}-{remitente}/received/
            const nombreCarpetaChat = `${idChat}-${remitente}`;
            const chatDir = path.join(__dirname, '../../uploads/files', nombreCarpetaChat);
            const receivedDir = path.join(chatDir, 'received');
            const sendDir = path.join(chatDir, 'send');
            
            // Crear carpetas si no existen
            if (!fs.existsSync(chatDir)) {
                fs.mkdirSync(chatDir, { recursive: true });
            }
            if (!fs.existsSync(receivedDir)) {
                fs.mkdirSync(receivedDir, { recursive: true });
                // Crear .gitkeep en received
                const gitkeepReceived = path.join(receivedDir, '.gitkeep');
                if (!fs.existsSync(gitkeepReceived)) {
                    fs.writeFileSync(gitkeepReceived, '');
                }
            }
            if (!fs.existsSync(sendDir)) {
                fs.mkdirSync(sendDir, { recursive: true });
                // Crear .gitkeep en send
                const gitkeepSend = path.join(sendDir, '.gitkeep');
                if (!fs.existsSync(gitkeepSend)) {
                    fs.writeFileSync(gitkeepSend, '');
                }
            }

            // Mover archivos a la carpeta received (archivos del cliente)
            const nuevosEnlaces = archivos.map(file => {
                const filePath = path.join(receivedDir, file.originalname);
                fs.renameSync(file.path, filePath);
                return `/files/${nombreCarpetaChat}/received/${file.originalname}`;
            }).join('|');

            // Obtener enlaces existentes
            const chatEnlaces = await modelChat.filtrarEnlaces(idChat);
            const enlacesExistentes = chatEnlaces.RUTA_ADJUNTOS && chatEnlaces.RUTA_ADJUNTOS !== '-' ? chatEnlaces.RUTA_ADJUNTOS : '';

            // Concatenar enlaces
            const enlaces = enlacesExistentes ? `${enlacesExistentes}|${nuevosEnlaces}` : nuevosEnlaces;

            // Obtener información del chat para verificar el estado del árbol
            const chatInfo = verificarChat[0];
            const arbolChat = chatInfo.ARBOL || '-';

            // IMPORTANTE: Construir mensaje del usuario mostrando SOLO los archivos adjuntos del mensaje actual (nuevosEnlaces)
            // No todos los adjuntos acumulados, solo los que el cliente acaba de adjuntar en este momento
            const APP_URL = process.env.APP_URL || '';
            // Usar solo los nuevos adjuntos recibidos en este mensaje, no todos los acumulados
            const enlacesNuevosArray = nuevosEnlaces.split('|').filter(e => e.trim());
            
            // Filtrar explícitamente para asegurar que solo sean received (del cliente)
            const enlacesReceivedActuales = enlacesNuevosArray.filter(enlace => {
                const enlaceNormalizado = enlace.trim();
                return enlaceNormalizado.includes('/received/') && !enlaceNormalizado.includes('/send/');
            });
            
            let mensajeConArchivos = '<p class="mensajeAdjuntosUsuario">📎 <b>He adjuntado los siguientes archivos:</b><br/><br/>';
            enlacesReceivedActuales.forEach(enlace => {
                const nombreArchivo = enlace.split('/').pop();
                const rutaCompleta = `${APP_URL}/uploads${enlace}`;
                mensajeConArchivos += `📄 <a href="${rutaCompleta}" target="_blank">${nombreArchivo}</a><br/>`;
            });
            mensajeConArchivos += '</p>';
            
            logger.info({
                contexto: 'controller',
                recurso: 'mensaje.adjuntarArchivos',
                idChat,
                remitente,
                accion: 'construyendo_mensaje_adjuntos_cliente',
                adjuntosNuevos: enlacesReceivedActuales.length,
                enlacesReceivedActuales: enlacesReceivedActuales,
                totalAdjuntosAcumulados: enlaces.split('|').filter(e => e.trim()).length
            }, '📎 Construyendo mensaje con solo adjuntos del mensaje actual (received)');

            const lectura = dataEstatica.configuracion.lecturaMensaje.noLeido;
            const descripcion = 'Archivos adjuntos subidos con éxito.';
            const estadoRegistro = dataEstatica.configuracion.estadoRegistro.activo;
            const responsable = dataEstatica.configuracion.responsable;

            // Crear el registro en tbl_mensaje con tipo "Texto" y mensaje que muestra los archivos
            // IMPORTANTE: Guardar en msg_enlaces solo los adjuntos del mensaje actual (nuevosEnlaces), no todos los acumulados
            // cht_ruta_adjuntos se actualiza con todos los acumulados, pero msg_enlaces solo tiene los del mensaje actual
            const tipoMensajeTexto = dataEstatica.configuracion.tipoMensaje.texto; // Cambiar a Texto
            const enlacesParaMensaje = nuevosEnlaces; // Solo los nuevos adjuntos del mensaje actual (received)
            const result = await model.crear(idChat, remitente, estadoMensaje, tipoMensajeTexto, mensajeConArchivos, enlacesParaMensaje, lectura, descripcion, estadoRegistro, responsable);

            // Actualizar el campo cht_ruta_adjuntos y cht_adjuntos en tbl_chat
            await modelArbolPrincipal.actualizarRutaAdjuntos(idChat, enlaces);

            // Obtener el estado actualizado del chat después de actualizar los adjuntos
            // Nota: filtrar busca por remitente (idChatWeb), no por idChat
            const chatActualizado = await modelChat.filtrar(remitente);
            const arbolChatActualizado = chatActualizado && chatActualizado.length > 0 
                ? chatActualizado[0].ARBOL || '-' 
                : arbolChat;

            // Log para debugging
            logger.info({
                contexto: 'controller',
                recurso: 'mensaje.adjuntarArchivos',
                idChat,
                remitente,
                arbolChatInicial: arbolChat,
                arbolChatActualizado,
                interaccionAISoul: dataEstatica.arbol.interaccionAISoul,
                esInteraccionAISoul: arbolChatActualizado === dataEstatica.arbol.interaccionAISoul || arbolChatActualizado === 'Interaccion AI Soul'
            }, '🔍 Verificando si el chat está en Interaccion AI Soul');

            // Si el chat ya está en "Interaccion AI Soul", enviar los adjuntos al servicio de SoulChat
            if (arbolChatActualizado === dataEstatica.arbol.interaccionAISoul || arbolChatActualizado === 'Interaccion AI Soul') {
                if (chatActualizado && chatActualizado.length > 0) {
                    const chatInfoActualizado = chatActualizado[0];
                    // IMPORTANTE: Cuando ya está en "Interaccion AI Soul", solo enviar los nuevos adjuntos del mensaje actual
                    // No todos los adjuntos acumulados, solo los que el cliente acaba de adjuntar
                    const chatData = {
                        controlApi: chatInfoActualizado.CONTROL_API || '-',
                        controlPeticiones: parseInt(chatInfoActualizado.CONTROL_PETICIONES) || 0,
                        resultadoApi: chatInfoActualizado.RESULTADO_API || '-',
                        conversacion: chatInfoActualizado.CONVERSACION || '-',
                        numeroPoliza: chatInfoActualizado.NUMERO_POLIZA || '-',
                        nombresApellidos: chatInfoActualizado.NOMBRES_APELLIDOS || '-',
                        tipoDocumento: chatInfoActualizado.TIPO_DOCUMENTO || '-',
                        numeroDocumento: chatInfoActualizado.NUMERO_DOCUMENTO || '-',
                        numeroContacto: chatInfoActualizado.NUMERO_CONTACTO || '-',
                        correoElectronico: chatInfoActualizado.CORREO_ELECTRONICO || '-',
                        relacionPedido: chatInfoActualizado.RELACION_PEDIDO || '-',
                        autorizacionDatosPersonales: chatInfoActualizado.AUTORIZACION_DATOS_PERSONALES || '-',
                        adjuntos: 'Si',
                        rutaAdjuntos: nuevosEnlaces, // Solo los nuevos adjuntos, no todos los acumulados
                        descripcion: chatInfoActualizado.DESCRIPCION || '-',
                        estadoRegistro: chatInfoActualizado.REGISTRO || '-',
                        responsable: chatInfoActualizado.RESPONSABLE || '-',
                    };

                    // Enviar adjuntos al servicio de SoulChat
                    try {
                        const mensajeAdjuntos = mensaje || 'He adjuntado documentos para revisión.';
                        logger.info({
                            contexto: 'controller',
                            recurso: 'mensaje.adjuntarArchivos',
                            idChat,
                            remitente,
                            accion: 'enviando_adjuntos_soulchat',
                            mensaje: mensajeAdjuntos,
                            tieneAdjuntos: chatData.adjuntos === 'Si',
                            rutaAdjuntos: chatData.rutaAdjuntos
                        }, '📤 Enviando adjuntos al servicio de SoulChat');
                        
                        await modelArbolPrincipal.procesarMensajeAISoul(
                            idChat,
                            remitente,
                            mensajeAdjuntos,
                            chatData,
                            'arbolPrincipal'
                        );
                        logger.info({
                            contexto: 'controller',
                            recurso: 'mensaje.adjuntarArchivos',
                            idChat,
                            remitente,
                            accion: 'adjuntos_enviados_soulchat'
                        }, '✅ Adjuntos enviados exitosamente al servicio de SoulChat');
                    } catch (error) {
                        logger.error({
                            contexto: 'controller',
                            recurso: 'mensaje.adjuntarArchivos',
                            errorMensaje: error.message,
                            errorStack: error.stack,
                            idChat,
                            remitente
                        }, '❌ Error al enviar adjuntos a SoulChat');
                        // Continuar aunque haya error en el envío a SoulChat
                    }
                } else {
                    logger.warn({
                        contexto: 'controller',
                        recurso: 'mensaje.adjuntarArchivos',
                        idChat,
                        remitente,
                        accion: 'chat_no_encontrado_para_soulchat'
                    }, '⚠️ No se encontró información del chat para enviar a SoulChat');
                }
            } else {
                logger.info({
                    contexto: 'controller',
                    recurso: 'mensaje.adjuntarArchivos',
                    idChat,
                    remitente,
                    arbolChatActualizado,
                    accion: 'no_en_interaccion_ai_soul'
                }, 'ℹ️ El chat no está en Interaccion AI Soul, no se enviará a SoulChat');
            }

            // Si estamos en el flujo de trámite esperando adjuntos, procesarlos automáticamente
            if (arbolChat.startsWith('Esperando Adjuntos Tramite ')) {
                // Extraer el submenuId del estado del árbol
                const submenuId = arbolChat.replace('Esperando Adjuntos Tramite ', '');
                
                // Obtener chatData para pasarlo al procesador
                const chatData = {
                    controlApi: chatInfo.CONTROL_API || '-',
                    controlPeticiones: parseInt(chatInfo.CONTROL_PETICIONES) || 0,
                    resultadoApi: chatInfo.RESULTADO_API || '-',
                    conversacion: chatInfo.CONVERSACION || '-',
                    numeroPoliza: chatInfo.NUMERO_POLIZA || '-',
                    nombresApellidos: chatInfo.NOMBRES_APELLIDOS || '-',
                    tipoDocumento: chatInfo.TIPO_DOCUMENTO || '-',
                    numeroDocumento: chatInfo.NUMERO_DOCUMENTO || '-',
                    numeroContacto: chatInfo.NUMERO_CONTACTO || '-',
                    correoElectronico: chatInfo.CORREO_ELECTRONICO || '-',
                    relacionPedido: chatInfo.RELACION_PEDIDO || '-',
                    autorizacionDatosPersonales: chatInfo.AUTORIZACION_DATOS_PERSONALES || '-',
                    adjuntos: 'Si',
                    rutaAdjuntos: enlaces,
                    descripcion: chatInfo.DESCRIPCION || '-',
                    estadoRegistro: chatInfo.REGISTRO || '-',
                    responsable: chatInfo.RESPONSABLE || '-',
                };

                // Procesar adjuntos automáticamente para continuar con el flujo
                // Llamar directamente a procesarAdjuntosEnviados
                try {
                    await modelArbolTramite.procesarAdjuntosEnviados(idChat, remitente, mensaje, chatData, 'arbolTramite');
                } catch (error) {
                    logger.error({
                        contexto: 'controller',
                        recurso: 'mensaje.adjuntarArchivos',
                        errorMensaje: error.message,
                        errorStack: error.stack,
                        idChat,
                        remitente
                    }, 'Error al procesar adjuntos automáticamente');
                    // Continuar aunque haya error en el procesamiento automático
                }
            }

            // Enviar respuesta
            if (result) {
                logger.info({
                    contexto: 'controller',
                    recurso: 'mensaje.adjuntarArchivos',
                    origen: getOrigen(req),
                    destino: getDestino(req),
                    contextoRecurso: getContextoRecurso(req),
                    codigoRespuesta: 200,
                    rta: 'Archivos y mensaje subidos exitosamente.',
                    idChat,
                    totalArchivos: archivos.length
                }, 'Archivos adjuntos procesados exitosamente');
                return res.json({
                    status: 200,
                    type: 'success',
                    title: 'Widget Chat Web Triple A',
                    message: 'Archivos y mensaje subidos exitosamente.',
                });
            }
        } else {
            logger.warn({
                contexto: 'controller',
                recurso: 'mensaje.adjuntarArchivos',
                origen: getOrigen(req),
                destino: getDestino(req),
                contextoRecurso: getContextoRecurso(req),
                codigoRespuesta: 400,
                rta: 'El chat no existe en el sistema.',
                idChatWeb
            }, 'Adjuntar archivos - chat no existe');
            res.json({
                status: 400,
                type: 'warning',
                title: 'Widget Chat Web Triple A',
                message: 'El chat no existe en el sistema.'
            });
        }
    } catch (error) {
        logger.error({
            contexto: 'controller',
            recurso: 'mensaje.adjuntarArchivos',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack
        }, 'Error en v1/controllers/widget/mensaje.controller.js → adjuntarArchivos');
        res.status(500).json({
            status: 500,
            type: 'error',
            title: 'Widget Chat Web Triple A',
            message: 'No se pudo adjuntar los archivos, por favor intenta de nuevo o comunícate con nosotros.',
            error: error.message
        });
    }
};

// * LISTAR CONVERSACIÓN COMPLETA
const listarConversacion = async (req, res) => {
    try {
        logger.info({
            contexto: 'controller',
            recurso: 'mensaje.listarConversacion',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            query: req.query
        }, 'Controller mensaje.controller.js → listarConversacion');
        // todo: Validar los datos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn({
                contexto: 'controller',
                recurso: 'mensaje.listarConversacion',
                origen: getOrigen(req),
                destino: getDestino(req),
                contextoRecurso: getContextoRecurso(req),
                codigoRespuesta: 400,
                rta: errors.array()[0].msg,
                erroresValidacion: errors.array()
            }, 'Error de validación en mensaje.listarConversacion');
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Widget Chat Web Triple A',
                message: errors.array()[0].msg
            });
        }

        // todo: Obtener los datos de la petición
        const { idChatWeb } = req.query;

        // todo: Listar todos los mensajes de la conversación
        const result = await model.listarConversacion(idChatWeb);

        if (result) {
            // todo: Enviar respuesta
            logger.info({
                contexto: 'controller',
                recurso: 'mensaje.listarConversacion',
                origen: getOrigen(req),
                destino: getDestino(req),
                contextoRecurso: getContextoRecurso(req),
                codigoRespuesta: 200,
                rta: 'La conversación se ha listado correctamente en el sistema.',
                totalMensajes: result.length,
                idChatWeb
            }, 'Conversación listada exitosamente');
            res.json({
                status: 200,
                type: 'success',
                title: 'Widget Chat Web Triple A',
                message: 'La conversación se ha listado correctamente en el sistema.',
                data: result
            });
        }
    } catch (error) {
        logger.error({
            contexto: 'controller',
            recurso: 'mensaje.listarConversacion',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack
        }, 'Error en v1/controllers/widget/mensaje.controller.js → listarConversacion');
        res.status(500).json({
            status: 500,
            type: 'error',
            title: 'Widget Chat Web Triple A',
            message: 'No se pudo listar la conversación, por favor intenta de nuevo o comunícate con nosotros.',
            error: error.message
        });
    }
};

// * VIGILAR INACTIVIDAD DEL CHAT
const vigilaInactividadChat = async (req, res) => {
    try {
        logger.info({
            contexto: 'controller',
            recurso: 'mensaje.vigilaInactividadChat',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            body: req.body
        }, 'Controller mensaje.controller.js → vigilaInactividadChat');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn({
                contexto: 'controller',
                recurso: 'mensaje.vigilaInactividadChat',
                origen: getOrigen(req),
                destino: getDestino(req),
                contextoRecurso: getContextoRecurso(req),
                codigoRespuesta: 400,
                rta: errors.array()[0].msg,
                erroresValidacion: errors.array()
            }, 'Error de validación en mensaje.vigilaInactividadChat');
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Chat Web MinTic',
                message: errors.array()[0].msg
            });
        }

        const { idChatWeb, tiempoInactividad, dispararAlerta } = req.body;
        
        const chat = await modelChat.filtrar(idChatWeb);

        if (chat.length > 0 && chat[0].GESTION === 'Abierto') {
            const nombreCliente = chat[0].NOMBRE_COMPLETO || null;

            // Primer aviso a los 2 minutos
            if (dispararAlerta && tiempoInactividad === 2) {
                const descripcion = `Inactividad de 2 minutos.`;
                await modelArbolPrincipal.crearAlertaInactividad(idChatWeb, descripcion, nombreCliente);
            }
            // Segundo aviso a los 3 minutos
            else if (dispararAlerta && tiempoInactividad === 3) {
                const descripcion = `Inactividad de 3 minutos.`;
                await modelArbolPrincipal.crearAlertaInactividad(idChatWeb, descripcion, nombreCliente);
            }
            // Tercer aviso a los 4 minutos
            else if (dispararAlerta && tiempoInactividad === 4) {
                const descripcion = `Inactividad de 4 minutos.`;
                await modelArbolPrincipal.crearAlertaInactividad(idChatWeb, descripcion, nombreCliente);
            }
            // Cierre del chat a los 5 minutos
            else if (dispararAlerta && tiempoInactividad === 5) {
                // todo: Crear mensaje de cierre por inactividad
                await modelArbolPrincipal.crearMensajeCierreInactividad(idChatWeb);

                const descripcion = 'Chat cerrado por inactividad.';
                
                // todo: Cerrar el chat
                await modelChat.cerrar(
                    idChatWeb,
                    dataEstatica.configuracion.estadoChat.recibido,
                    dataEstatica.configuracion.estadoGestion.cerrado,
                    dataEstatica.arbol.cerradoPorInactividad,
                    dataEstatica.configuracion.controlApi.success,
                    descripcion,
                    dataEstatica.configuracion.estadoRegistro.activo,
                    dataEstatica.configuracion.responsable
                );
                    
                // todo: Consumir servicio de soul chat para notificar cierre de chat, cambiando el estado de START a CLOSE
                const estructuraMensaje = {
                    provider: "web",
                    canal: 3,
                    idChat: chat[0].ID_CHAT,
                    remitente: idChatWeb,
                    estado: "CLOSE",
                    mensaje: descripcion,
                    type: "TEXT",
                    responsable: dataEstatica.configuracion.responsable
                }
                    
                // Sistema de reintentos automáticos para notificar cierre de chat
                let intento = 1;
                const maxIntentos = 5;
                let response = null;
                let error = null;
                
                while (intento <= maxIntentos) {
                    try {                        
                        // Consumir servicio de Soul Chat
                        response = await serviceSoulChat.procesarMensajeSoulChat(estructuraMensaje);
                        
                        // Si la respuesta tiene status 200 o 202, éxito
                        if (response.status === 200 || response.status === 202) {
                            break; // Salir del bucle de reintentos
                        } else {
                            // Respuesta con error HTTP, incrementar contador y continuar con el siguiente intento
                            
                            // Si no es el último intento, esperar antes de reintentar
                            if (intento < maxIntentos) {
                                await new Promise(resolve => setTimeout(resolve, 30000)); // Esperar 30 segundos
                            }
                        }
                    } catch (apiError) {
                        // Error de conexión o timeout, incrementar contador y continuar
                        error = apiError;                        
                        // Si no es el último intento, esperar antes de reintentar
                        if (intento < maxIntentos) {
                            await new Promise(resolve => setTimeout(resolve, 30000)); // Esperar 30 segundos
                        }
                    }
                    
                    intento++;
                }
            }
        }

        const mensajesNoLeidos = await model.listarNoLeido(idChatWeb, dataEstatica.configuracion.lecturaMensaje.noLeido);

        logger.info({
            contexto: 'controller',
            recurso: 'mensaje.vigilaInactividadChat',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            codigoRespuesta: 200,
            rta: 'Proceso de vigilancia de inactividad completado.',
            idChatWeb
        }, 'Vigilancia de inactividad completada');
        res.json({
            status: 200,
            type: 'success',
            title: 'Chat Web MinTic',
            message: 'Proceso de vigilancia de inactividad completado.',
            data: mensajesNoLeidos
        });
    } catch (error) {
        logger.error({
            contexto: 'controller',
            recurso: 'mensaje.vigilaInactividadChat',
            origen: getOrigen(req),
            destino: getDestino(req),
            contextoRecurso: getContextoRecurso(req),
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack
        }, 'Error en v1/controllers/widget/mensaje.controller.js → vigilaInactividadChat');
        res.status(500).json({
            status: 500,
            type: 'error',
            title: 'Chat Web MinTic',
            message: 'Error al vigilar la inactividad del chat.',
            error: error.message
        });
    }
};

// ! EXPORTACIONES
module.exports = {
    crear,
    crearSoulChat,
    encuestaSoulChat,
    listarNoLeido,
    leer,
    adjuntarArchivos,
    listarConversacion,
    vigilaInactividadChat,
};