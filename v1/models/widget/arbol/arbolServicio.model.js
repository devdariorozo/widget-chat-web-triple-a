// ! ================================================================================================================================================
// !                                                      MODELOS PARA ARBOL CHAT BOT - Servicio
// ! ================================================================================================================================================
// @autor Ramón Dario Rozo Torres
// @última­Modificación Ramón Dario Rozo Torres
// @versión 1.0.0
// v1/models/widget/arbol/arbolServicio.model.js

// ! REQUIRES
require('dotenv').config({ path: './../../../.env' });
const modelChat = require('../chat.model.js');
const dataEstatica = require('../../../seeds/dataEstatica.js');
const serviceSoulChat = require('../../../services/serviceSoulChat.service.js');
const logger = require('../../../logger/index.js');

const getArbolPrincipal = () => require('./arbolPrincipal.model.js');

// ! VARIABLES GLOBALES
let chatData = {
    controlApi: '-',
    controlPeticiones: '-',
    resultadoApi: '-',
    numeroPoliza: '-',
    nombresApellidos: '-',
    tipoDocumento: '-',
    numeroDocumento: '-',
    numeroContacto: '-',
    correoElectronico: '-',
    relacionPedido: '-',
    autorizacionDatosPersonales: '-',
    adjuntos: '-',
    rutaAdjuntos: '-',
    descripcion: '-',
    estadoRegistro: '-',
    responsable: '-',
};



const SUBMENUS_CONFIG = {
    // ===== PRESUPUESTAR CONTRATACION SERVICIO =====
    presupestar_contratacion_servicio: {
        pasoArbol: "Procesar Submenu Servicio presupestar_contratacion_servicio",
        tipo: 'avanzar',
        descripcion: 'Usuario en: Presupuestar la contratación de un nuevo servicio',
        mensajeAvance: dataEstatica.mensajes.presupuestarContratacionServicio,
        siguiente:'cerrar_chat'
    },

    // ===== CONTRATACION INMEDIATA =====
    contratacion_inmediata: {
        pasoArbol: "Procesar Submenu Servicio contratacion_inmediata",
        tipo: 'avanzar',
        descripcion: 'Usuario en: Contratación inmediata de un nuevo servicio',
        mensajeAvance: dataEstatica.mensajes.contratacionInmediata,
        siguiente:'cerrar_chat'
    },
}

// ! MODELOS
// * ARBOL CHAT BOT - Servicio
const arbolServicio = async (idChat, remitente, arbolChat, contenido, chatData, contextoArbol = 'arbolServicio') => {

    try {

        // todo: Primera vez que entra al árbol
        if (arbolChat === "Solicitar Arbol Servicio") {
            return await solicitarMenuArbolServicio(idChat, remitente, chatData, contextoArbol)
        }

        // INTERCEPTAR DESPUÉS DE IA Y VOLVER AL MENÚ 
        if (arbolChat === "Regresar Al Menu Principal Despues IA") {
            logger.info({
                contexto: 'model',
                recurso: 'arbolPrincipal.arbolPrincipal',
                idChat,
                remitente,
                contenido
            }, '🔄 Usuario respondió después de IA, regresando al menú principal');

            return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
        }

        // todo: Menú principal
        if (
            arbolChat === "Solicitar Menu Arbol Servicio" ||
            arbolChat === dataEstatica.arbol.alertaNoEntiendo
        ) {
            return await procesarMenuArbolServicio(idChat, remitente, contenido, chatData, contextoArbol)
        }

        // todo: Manejo de errores en submenús
        if (arbolChat.startsWith("Alerta No Entiendo - Submenu Servicio ")) {
            const submenuId = arbolChat.replace("Alerta No Entiendo - Submenu Servicio ", "")
            return await procesarRespuestaSubmenu(
                idChat, remitente, contenido, chatData, submenuId, contextoArbol
            )
        }

        // todo: Procesando respuesta de submenú
        if (arbolChat.startsWith("Procesar Submenu Servicio ")) {
            const submenuId = arbolChat.replace("Procesar Submenu Servicio ", "")
            return await procesarRespuestaSubmenu(idChat, remitente, contenido, chatData, submenuId, contextoArbol)
        }

        // todo: Interacción con IA
        if (arbolChat === "Interaccion AI Soul" || arbolChat === dataEstatica.arbol.alertaNoEntiendo) {
            return await getArbolPrincipal().procesarMensajeAISoul(idChat, remitente, contenido, chatData, contextoArbol)
        }

        logger.warn(
            {
                contexto: "model",
                recurso: "arbolServicio.arbolServicio",
                arbolChat,
                idChat,
                remitente,
            },
            "No se encontró condición válida para arbolChat en Servicio",
        )
        return true;
    } catch (error) {
        const api = 'Chat Web Triple A ';
        const procesoApi = 'Arbol Servicio';
        logger.error({
            contexto: 'model',
            recurso: 'arbolServicio.arbolServicio',
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            api,
            procesoApi
        }, 'Error en v1/models/widget/arbol/arbolServicio.model.js → arbolServicio');
        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente, contextoArbol);
    }
};



// todo: Solicitar Menu Arbol Servicio
const solicitarMenuArbolServicio = async (idChat, remitente, chatData) => {
    const solicitarMenuArbolServicio = "Solicitar Menu Arbol Servicio"
    chatData.descripcion = 'Se solicita el menu de Servicio.'

    await modelChat.actualizar(idChat, solicitarMenuArbolServicio, chatData)

    return await getArbolPrincipal().crearMensaje(
        idChat,
        remitente,
        dataEstatica.configuracion.estadoMensaje.enviado,
        dataEstatica.configuracion.tipoMensaje.texto,
        dataEstatica.mensajes.solicitarMenuArbolServicio,
        chatData.descripcion,
    )
}

// todo: Procesar Menu Arbol Trámite
const procesarMenuArbolServicio = async (idChat, remitente, contenido, chatData) => {
    try {
        const contenidoNormalized = String(contenido).trim();

        const menuOpciones = {
            '1': 'presupestar_contratacion_servicio',
            '2': 'contratacion_inmediata',
        };

        // Si es una opción válida del menú
        if (menuOpciones[contenidoNormalized]) {
            return await mostrarSubmenu(idChat, remitente, menuOpciones[contenidoNormalized], chatData);
        }

        // Permitir REGRESAR
        if (contenidoNormalized === 'REGRESAR') {
            chatData.descripcion = 'Usuario escribió REGRESAR';
            return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
        }

        // Opción no válida
        const resultado = await getArbolPrincipal().manejarNoEntiendo(
            idChat, remitente,
            "Alerta No Entiendo - Solicitar Menu Arbol Servicio",
            dataEstatica.mensajes.alertaNoEntiendo
        );

        if (resultado) {
            return await solicitarMenuArbolServicio(idChat, remitente, chatData);
        }
        return false;

    } catch (error) {
        logger.error({
            contexto: 'model', recurso: 'arbolServicio.procesarMenuArbolServicio',
            errorMensaje: error.message, errorStack: error.stack, idChat, remitente
        },
            'Error en procesarMenuArbolServicio');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Procesar Menu Servicio';
        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente);
    }
};





// todo: Mostrar Submenu - GENÉRICO Y ESCALABLE
const mostrarSubmenu = async (idChat, remitente, submenuId, chatData, contextoArbol = 'arbolServicio') => {
    // Si el siguiente paso es pasar a agente (Interaccion AI Soul)
    if (submenuId === 'Interaccion AI Soul') {
        chatData.descripcion = 'Usuario completó inputs - Pasando a agente';
        chatData.adjuntos = 'No';
        chatData.rutaAdjuntos = '-';

        // Crear mensaje de tipo Paso Agente antes de pasar a agente
        await getArbolPrincipal().crearMensaje(
            idChat, remitente,
            dataEstatica.configuracion.estadoMensaje.enviado,
            dataEstatica.configuracion.tipoMensaje.pasoAgente,
            dataEstatica.mensajes.mensajeAsesor,
            chatData.descripcion
        );

        const pasoArbol = "Interaccion AI Soul";
        await modelChat.actualizar(idChat, pasoArbol, chatData);

        // Construir mensaje contextual dinámico:
        // 1. Prioridad: usar mensajeContextoIA guardado (si existe)
        // 2. Fallback: construir mensaje según datos ingresados
        let mensajeContexto = null;
        
        if (chatData.mensajeContextoIAPendiente && chatData.mensajeContextoIAPendiente !== '-') {
            // Usar el mensajeContextoIA guardado del submenu anterior
            mensajeContexto = chatData.mensajeContextoIAPendiente;
            logger.info({
                contexto: 'model',
                recurso: 'arbolServicio.mostrarSubmenu',
                idChat,
                remitente,
                mensajeContextoIA: mensajeContexto
            }, '✅ Usando mensajeContextoIA guardado para solicitud dinámica del cliente');
            
            // Limpiar el mensajeContextoIA pendiente después de usarlo
            chatData.mensajeContextoIAPendiente = '-';
        } else {
            // Fallback: construir mensaje genérico según datos ingresados
            mensajeContexto = 'Necesito ayuda con la contratación de un nuevo servicio.';
            if (chatData.nombresApellidos && chatData.nombresApellidos !== '-') {
                mensajeContexto += ` Mis datos son: ${chatData.nombresApellidos}.`;
            }
        }

        return await getArbolPrincipal().procesarMensajeAISoul(
            idChat,
            remitente,
            mensajeContexto,
            chatData,
            contextoArbol
        );
    }

    const submenu = SUBMENUS_CONFIG[submenuId];

    if (!submenu) {
        logger.warn({
            contexto: 'model', recurso: 'arbolServicio.mostrarSubmenu',
            submenuId, idChat, remitente
        }, `Submenú no encontrado: ${submenuId}`);
        return false;
    }

    if (submenu.tipo === 'avanzar') {
        chatData.descripcion = submenu.descripcion;
        await modelChat.actualizar(idChat, submenu.pasoArbol, chatData);

        await getArbolPrincipal().crearMensaje(
            idChat, remitente,
            dataEstatica.configuracion.estadoMensaje.enviado,
            dataEstatica.configuracion.tipoMensaje.texto,
            submenu.mensajeAvance,
            chatData.descripcion
        );

        if (submenu.siguiente === 'cerrar_chat') {
            return await getArbolPrincipal().cerrarChatConDespedida(idChat, remitente, chatData, 'arbolEspAseo');
        } else if (submenu.siguiente === 'menu_principal') {
            return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
        } else if (submenu.siguiente) {
            return await mostrarSubmenu(idChat, remitente, submenu.siguiente, chatData);
        }

        return true;
    }


    chatData.descripcion = submenu.descripcion;
    await modelChat.actualizar(idChat, submenu.pasoArbol, chatData);

    await getArbolPrincipal().crearMensaje(
        idChat, remitente,
        dataEstatica.configuracion.estadoMensaje.enviado,
        dataEstatica.configuracion.tipoMensaje.texto,
        submenu.mensaje,
        chatData.descripcion
    );


    // ===== AVANCE AUTOMÁTICO =====
    // Si el submenú tiene avanceAutomatico, ir al siguiente sin esperar respuesta
    if (submenu.avanceAutomatico) {
        logger.info({
            contexto: 'model',
            recurso: 'arbolServicio.mostrarSubmenu',
            submenuActual: submenuId,
            siguienteAutomatico: submenu.avanceAutomatico
        }, '⚡ Avance automático detectado');

        return await mostrarSubmenu(idChat, remitente, submenu.avanceAutomatico, chatData);
    }

    return true;
};



// todo: Procesar Respuesta Submenú
const procesarRespuestaSubmenu = async (idChat, remitente, contenido, chatData, submenuId, contextoArbol) => {
    try {
        const contenidoNormalized = String(contenido).trim();
        const submenu = SUBMENUS_CONFIG[submenuId];

        if (!submenu) {
            logger.warn({
                contexto: 'model', recurso: 'arbolServicio.procesarRespuestaSubmenu',
                submenuId
            }, `Submenú no encontrado: ${submenuId}`);
            return false;
        }

        // ===== VERIFICAR SI ES PASAR_AGENTE (ANTES DE OPCIONES) =====
        if (submenu.tipo === 'pasar_agente') {
            chatData.descripcion = `Usuario requiere asesor - ${submenu.descripcion}`;
            chatData.adjuntos = 'No';
            chatData.rutaAdjuntos = '-';

            // Mostrar mensaje de conexión
            await getArbolPrincipal().crearMensaje(
                idChat, remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                submenu.mensaje || dataEstatica.mensajes.mensajeAsesor,
                chatData.descripcion
            );

            // Actualizar estado y pasar a IA/Agente
            const pasoArbol = "Interaccion AI Soul";
            await modelChat.actualizar(idChat, pasoArbol, chatData);

            // Construir mensaje contextual dinámico:
            // 1. Prioridad: usar mensajeContextoIA guardado (si existe)
            // 2. Fallback: usar mensajeContextoIA del submenu actual
            // 3. Último fallback: mensaje genérico
            let mensajeContexto = null;
            
            if (chatData.mensajeContextoIAPendiente && chatData.mensajeContextoIAPendiente !== '-') {
                // Usar el mensajeContextoIA guardado del submenu anterior
                mensajeContexto = chatData.mensajeContextoIAPendiente;
                logger.info({
                    contexto: 'model',
                    recurso: 'arbolServicio.procesarRespuestaSubmenu',
                    idChat,
                    remitente,
                    mensajeContextoIA: mensajeContexto
                }, '✅ Usando mensajeContextoIA guardado para solicitud dinámica del cliente');
                
                // Limpiar el mensajeContextoIA pendiente después de usarlo
                chatData.mensajeContextoIAPendiente = '-';
            } else {
                // Fallback: usar mensajeContextoIA del submenu actual o mensaje genérico
                mensajeContexto = submenu.mensajeContextoIA ||
                    `El usuario necesita asistencia. Contexto: ${submenu.descripcion}`;
            }

            return await getArbolPrincipal().procesarMensajeAISoul(
                idChat,
                remitente,
                mensajeContexto,
                chatData,
                contextoArbol
            );
        }

        // Obtener la opción seleccionada
        const opcion = submenu.opciones[contenidoNormalized];

        if (opcion) {


            // TIPO: AVANZAR (Mostrar mensaje y continuar)
            if (opcion.tipo === 'avanzar') {
                chatData.descripcion = `Usuario seleccionó opción ${contenidoNormalized}`;

                // Mostrar mensaje de avance si existe
                if (opcion.mensajeAvance) {
                    await getArbolPrincipal().crearMensaje(
                        idChat, remitente,
                        dataEstatica.configuracion.estadoMensaje.enviado,
                        dataEstatica.configuracion.tipoMensaje.texto,
                        opcion.mensajeAvance,
                        chatData.descripcion
                    );
                }

                // Ir al siguiente paso
                if (opcion.siguiente === 'menu_principal') {
                    return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
                } else {
                    return await mostrarSubmenu(idChat, remitente, opcion.siguiente, chatData);
                }
            }

            // TIPO: SIMPLE (Solo ir al siguiente submenu)
            if (opcion.siguiente) {
                if (opcion.siguiente === 'menu_principal') {
                    return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
                }
                return await mostrarSubmenu(idChat, remitente, opcion.siguiente, chatData);
            }

            return true;
        }

        // Opción no válida
        const resultado = await getArbolPrincipal().manejarNoEntiendo(
            idChat, remitente,
            `Alerta No Entiendo - Submenu ${submenuId}`,
            dataEstatica.mensajes.alertaNoEntiendo
        );

        if (resultado) {
            return await mostrarSubmenu(idChat, remitente, submenuId, chatData, contextoArbol);
        }
        return false;

    } catch (error) {
        logger.error({
            contexto: 'model', recurso: `${contextoArbol}.procesarRespuestaSubmenu`,
            errorMensaje: error.message, errorStack: error.stack, idChat, remitente, submenuId
        },
            'Error en procesarRespuestaSubmenu');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Procesar Respuesta Submenu';
        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente);
    }
};





// ! EXPORTACIONES
module.exports = {
    arbolServicio,
    solicitarMenuArbolServicio,
    procesarMenuArbolServicio,
};