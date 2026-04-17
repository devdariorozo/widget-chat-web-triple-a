// ! ================================================================================================================================================
// !                                                      MODELOS PARA ARBOL CHAT BOT - CONTROL DE SERVICIO
// ! ================================================================================================================================================
// @autor Ramón Dario Rozo Torres
// @última­Modificación Ramón Dario Rozo Torres
// @versión 1.0.0
// v1/models/widget/arbol/arbolControlServicio.model.js

// ! REQUIRES
require('dotenv').config({ path: './../../../.env' });
const modelChat = require('../chat.model.js');
const dataEstatica = require('../../../seeds/dataEstatica.js');
const logger = require('../../../logger/index.js');
const serviceTripleA = require('../../../services/serviceTripleA.service.js');

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
    mensajePersonalizadoEnCurso: '-',
    // inputsSecuencia: '-',
    // submenuPendiente: '-',
    // inputEnCurso: '-',
    esSecuenciaMultiple: 'false',
};




const SUBMENUS_CONFIG = {
    // ===== INTERRUPCIONES Y CIERRES =====
    interrupciones_cierres: {
        tipo: 'mensaje_estatico',
        pasoArbol: "Procesar Submenu Control Servicio interrupciones_cierres",
        descripcion: 'Usuario en: Interrupciones y cierres',
        mensaje: dataEstatica.mensajes.interrupcionesYCierres,
        siguiente: 'cerrar_chat',
    },

    // ===== SIN AGUA EN CASA =====
    sin_agua: {
        pasoArbol: "Procesar Submenu Control Servicio sin_agua",
        descripcion: 'Usuario en: Sin agua en casa - Verificar póliza',
        mensaje: dataEstatica.mensajes.verificarPoliza,
        opciones: {
            '1': {
                tipo: 'input_multiple',
                descripcion: 'Usuario tiene póliza - Sin agua',
                inputKey: ['numeroPoliza'],
                mensaje: dataEstatica.mensajes.numeroPolizaControlServicio,
                siguiente: 'endpoint_info_cliente_sin_agua'
            },
            '2': {
                tipo: 'input_multiple',
                descripcion: 'Usuario no tiene póliza - Sin agua',
                inputKey: ['nombresApellidos', 'direccion', 'descripcionProblema'],
                mensaje: dataEstatica.mensajes.sinPolizaAsesor,
                siguiente: 'Interaccion AI Soul'
            }
        }
    },

    // ===== ENDPOINT INFO CLIENTE SIN AGUA =====
    endpoint_info_cliente_sin_agua: {
        pasoArbol: "Procesar Submenu Control Servicio endpoint_info_cliente_sin_agua",
        descripcion: 'Usuario en: Endpoint información cliente IVR sin agua',
        tipo: 'endpoint',
        // TODO: ESPACIO PARA ENDPOINT - Información Cliente IVR
        avanceAutomatico: 'confirmar_informacion_sin_agua'
    },

    // ===== CONFIRMAR INFORMACIÓN SIN AGUA =====
    confirmar_informacion_sin_agua: {
        tipo: 'opciones',
        pasoArbol: "Procesar Submenu Control Servicio confirmar_informacion_sin_agua",
        descripcion: 'Usuario en: Confirmar información sin agua',
        mensaje: dataEstatica.mensajes.confirmarInformacion,
        opciones: {
            '1': {
                tipo: 'endpoint',
                descripcion: 'Usuario confirma - Procesar IVR sin agua',
                siguiente: 'endpoint_ivr_sin_agua'
            },
            '2': {
                tipo: 'input_multiple',
                descripcion: 'Usuario corrige - Volver a solicitar póliza',
                inputKey: ['numeroPoliza'],
                mensaje: dataEstatica.mensajes.numeroPolizaControlServicio,
                siguiente: 'endpoint_info_cliente_sin_agua'
            }
        }
    },

    // ===== SOLICITAR PÓLIZA SIN AGUA (Para corrección) =====
    sin_agua_solicitar_poliza: {
        pasoArbol: "Procesar Submenu Control Servicio sin_agua_solicitar_poliza",
        descripcion: 'Usuario en: Solicitar póliza sin agua (corrección)',
        tipo: 'input_multiple',
        inputKey: ['numeroPoliza'],
        mensaje: dataEstatica.mensajes.numeroPolizaControlServicio,
        siguiente: 'endpoint_info_cliente_sin_agua'
    },

    // ===== ENDPOINT IVR SIN AGUA =====
    endpoint_ivr_sin_agua: {
        pasoArbol: "Procesar Submenu Control Servicio endpoint_ivr_sin_agua",
        descripcion: 'Usuario en: Endpoint IVR sin agua en casa',
        tipo: 'endpoint',
        // TODO: ESPACIO PARA ENDPOINT - IVRSinAguaEnCasa
        avanceAutomatico: 'mensaje_final_control_servicio'
    },

    // ===== BAJA PRESIÓN SECTOR =====
    baja_presion_sector: {
        pasoArbol: "Procesar Submenu Control Servicio baja_presion_sector",
        descripcion: 'Usuario en: Baja presión sector - Verificar póliza',
        mensaje: dataEstatica.mensajes.verificarPoliza,
        opciones: {
            '1': {
                tipo: 'input_multiple',
                descripcion: 'Usuario tiene póliza - Baja presión',
                inputKey: ['numeroPoliza'],
                mensaje: dataEstatica.mensajes.numeroPolizaControlServicio,
                siguiente: 'endpoint_info_cliente_baja_presion'
            },
            '2': {
                tipo: 'input_multiple',
                descripcion: 'Usuario NO tiene póliza - Baja presión',
                inputKey: ['nombresApellidos', 'direccion', 'descripcionProblema'],
                mensaje: dataEstatica.mensajes.sinPolizaAsesor,
                siguiente: 'Interaccion AI Soul'
            }
        }
    },

    // ===== ENDPOINT INFO CLIENTE BAJA PRESIÓN =====
    endpoint_info_cliente_baja_presion: {
        pasoArbol: "Procesar Submenu Control Servicio endpoint_info_cliente_baja_presion",
        descripcion: 'Usuario en: Endpoint información cliente IVR baja presión',
        tipo: 'endpoint',
        // TODO: ESPACIO PARA ENDPOINT - Información Cliente IVR
        avanceAutomatico: 'confirmar_informacion_baja_presion'
    },

    // ===== CONFIRMAR INFORMACIÓN BAJA PRESIÓN =====
    confirmar_informacion_baja_presion: {
        pasoArbol: "Procesar Submenu Control Servicio confirmar_informacion_baja_presion",
        descripcion: 'Usuario en: Confirmar información baja presión',
        mensaje: dataEstatica.mensajes.confirmarInformacion,
        opciones: {
            '1': {
                tipo: 'endpoint',
                descripcion: 'Usuario confirma - Procesar IVR baja presión',
                siguiente: 'endpoint_ivr_baja_presion'
            },
            '2': {
                tipo: 'input_multiple',
                descripcion: 'Usuario corrige - Volver a ingresar póliza',
                inputKey: ['numeroPoliza'],
                mensaje: dataEstatica.mensajes.numeroPolizaControlServicio,
                siguiente: 'endpoint_info_cliente_baja_presion'
            }
        }
    },

    // ===== ENDPOINT IVR BAJA PRESIÓN =====
    endpoint_ivr_baja_presion: {
        pasoArbol: "Procesar Submenu Control Servicio endpoint_ivr_baja_presion",
        descripcion: 'Usuario en: Endpoint IVR baja presión sector',
        tipo: 'endpoint',
        // TODO: ESPACIO PARA ENDPOINT - IVRBajaPresionSector
        avanceAutomatico: 'mensaje_final_control_servicio'
    },

    // ===== FUGA DE AGUA =====
    fuga_agua: {
        pasoArbol: "Procesar Submenu Control Servicio fuga_agua",
        descripcion: 'Usuario en: Fuga de agua - Verificar póliza',
        mensaje: dataEstatica.mensajes.verificarPoliza,
        opciones: {
            '1': {
                tipo: 'input_multiple',
                descripcion: 'Usuario tiene póliza - Fuga agua',
                inputKey: ['numeroPoliza'],
                mensaje: dataEstatica.mensajes.numeroPolizaControlServicio,
                siguiente: 'endpoint_info_cliente_fuga_agua'
            },
            '2': {
                tipo: 'input_multiple',
                descripcion: 'Usuario NO tiene póliza - Fuga agua',
                inputKey: ['nombresApellidos', 'direccion', 'descripcionProblema'],
                mensaje: dataEstatica.mensajes.sinPolizaAsesor,
                siguiente: 'Interaccion AI Soul'
            }
        }
    },

    // ===== ENDPOINT INFO CLIENTE FUGA AGUA =====
    endpoint_info_cliente_fuga_agua: {
        pasoArbol: "Procesar Submenu Control Servicio endpoint_info_cliente_fuga_agua",
        descripcion: 'Usuario en: Endpoint información cliente IVR fuga agua',
        tipo: 'endpoint',
        // TODO: ESPACIO PARA ENDPOINT - Información Cliente IVR
        avanceAutomatico: 'confirmar_informacion_fuga_agua'
    },

    // ===== CONFIRMAR INFORMACIÓN FUGA AGUA =====
    confirmar_informacion_fuga_agua: {
        pasoArbol: "Procesar Submenu Control Servicio confirmar_informacion_fuga_agua",
        descripcion: 'Usuario en: Confirmar información fuga agua',
        mensaje: dataEstatica.mensajes.confirmarInformacion,
        opciones: {
            '1': {
                tipo: 'endpoint',
                descripcion: 'Usuario confirma - Procesar IVR fuga agua',
                siguiente: 'endpoint_ivr_fuga_agua'
            },
            '2': {
                tipo: 'input_multiple',
                descripcion: 'Usuario corrige - Volver a ingresar póliza',
                inputKey: ['numeroPoliza'],
                mensaje: dataEstatica.mensajes.numeroPolizaControlServicio,
                siguiente: 'endpoint_info_cliente_fuga_agua'
            }
        }
    },

    // ===== ENDPOINT IVR FUGA AGUA =====
    endpoint_ivr_fuga_agua: {
        pasoArbol: "Procesar Submenu Control Servicio endpoint_ivr_fuga_agua",
        descripcion: 'Usuario en: Endpoint IVR fuga agua',
        tipo: 'endpoint',
        // TODO: ESPACIO PARA ENDPOINT - IVRFugaAgua
        avanceAutomatico: 'mensaje_final_control_servicio'
    },

    // ===== FUGA DE ALCANTARILLADO =====
    fuga_alcantarillado: {
        pasoArbol: "Procesar Submenu Control Servicio fuga_alcantarillado",
        descripcion: 'Usuario en: Fuga alcantarillado - Verificar póliza',
        mensaje: dataEstatica.mensajes.verificarPoliza,
        opciones: {
            '1': {
                tipo: 'input_multiple',
                descripcion: 'Usuario tiene póliza - Fuga alcantarillado',
                inputKey: ['numeroPoliza'],
                mensaje: dataEstatica.mensajes.numeroPolizaControlServicio,
                siguiente: 'endpoint_info_cliente_fuga_alcantarillado'
            },
            '2': {
                tipo: 'input_multiple',
                descripcion: 'Usuario NO tiene póliza - Fuga alcantarillado',
                inputKey: ['nombresApellidos', 'direccion', 'descripcionProblema'],
                mensaje: dataEstatica.mensajes.sinPolizaAsesor,
                siguiente: 'Interaccion AI Soul'
            }
        }
    },

    // ===== ENDPOINT INFO CLIENTE FUGA ALCANTARILLADO =====
    endpoint_info_cliente_fuga_alcantarillado: {
        pasoArbol: "Procesar Submenu Control Servicio endpoint_info_cliente_fuga_alcantarillado",
        descripcion: 'Usuario en: Endpoint información cliente IVR fuga alcantarillado',
        tipo: 'endpoint',
        // TODO: ESPACIO PARA ENDPOINT - Información Cliente IVR
        avanceAutomatico: 'confirmar_informacion_fuga_alcantarillado'
    },

    // ===== CONFIRMAR INFORMACIÓN FUGA ALCANTARILLADO =====
    confirmar_informacion_fuga_alcantarillado: {
        pasoArbol: "Procesar Submenu Control Servicio confirmar_informacion_fuga_alcantarillado",
        descripcion: 'Usuario en: Confirmar información fuga alcantarillado',
        mensaje: dataEstatica.mensajes.confirmarInformacion,
        opciones: {
            '1': {
                tipo: 'endpoint',
                descripcion: 'Usuario confirma - Procesar IVR fuga alcantarillado',
                siguiente: 'endpoint_ivr_fuga_alcantarillado'
            },
            '2': {
                tipo: 'input_multiple',
                descripcion: 'Usuario corrige - Volver a ingresar póliza',
                inputKey: ['numeroPoliza'],
                mensaje: dataEstatica.mensajes.numeroPolizaControlServicio,
                siguiente: 'endpoint_info_cliente_fuga_alcantarillado'
            }
        }
    },

    // ===== ENDPOINT IVR FUGA ALCANTARILLADO =====
    endpoint_ivr_fuga_alcantarillado: {
        pasoArbol: "Procesar Submenu Control Servicio endpoint_ivr_fuga_alcantarillado",
        descripcion: 'Usuario en: Endpoint IVR fuga alcantarillado',
        tipo: 'endpoint',
        // TODO: ESPACIO PARA ENDPOINT - IVRFugaAlcantarillado
        avanceAutomatico: 'mensaje_final_control_servicio'
    },

    // ===== MENSAJE FINAL CONTROL SERVICIO =====
    mensaje_final_control_servicio: {
        tipo: 'mensaje_estatico',
        pasoArbol: "Procesar Submenu Control Servicio mensaje_final_control_servicio",
        descripcion: 'Usuario en: Mensaje final control servicio',
        mensaje: dataEstatica.mensajes.mensajeFinalArbolControlServicio,
        siguiente: 'cerrar_chat',
    },

    // ===== MENSAJE ASESOR =====
    mensaje_asesor: {
        tipo: 'mensaje_estatico',
        pasoArbol: "Procesar Submenu Control Servicio mensaje_asesor",
        descripcion: 'Usuario en: Mensaje asesor control servicio',
        // Usar el mensaje asesor genérico definido en dataEstatica
        mensaje: dataEstatica.mensajes.mensajeAsesor
    }
};



// ! MODELOS
// * ARBOL CHAT BOT - CONTROL DE SERVICIO
const arbolControlServicio = async (idChat, remitente, arbolChat, contenido, chatData, contextoArbol = 'arbolControlServicio') => {
    try {
        // Primera vez que entra al árbol
        if (arbolChat === "Solicitar Arbol Control Servicio") {
            return await solicitarMenuArbolControlServicio(idChat, remitente, chatData, contextoArbol);
        }

        // Interceptar después de IA y volver al menú
        if (arbolChat === "Regresar Al Menu Principal Despues IA") {
            return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
        }

        // Menú principal
        if (arbolChat === "Solicitar Menu Arbol Control Servicio" || arbolChat === dataEstatica.arbol.alertaNoEntiendo) {
            return await procesarMenuArbolControlServicio(idChat, remitente, contenido, chatData, contextoArbol);
        }

        // Manejo de errores en submenús
        if (arbolChat.startsWith("Alerta No Entiendo - Submenu Control Servicio ")) {
            const submenuId = arbolChat.replace("Alerta No Entiendo - Submenu Control Servicio ", "");
            return await procesarRespuestaSubmenu(idChat, remitente, contenido, chatData, submenuId, contextoArbol);
        }

        // Procesando respuesta de submenú
        if (arbolChat.startsWith("Procesar Submenu Control Servicio ")) {
            const submenuId = arbolChat.replace("Procesar Submenu Control Servicio ", "");
            logger.info({
                contexto: 'model',
                recurso: 'arbolControlServicio.arbolControlServicio',
                idChat,
                remitente,
                arbolChat,
                contenido,
                submenuId
            }, '🔄 Procesando respuesta de submenu');
            return await procesarRespuestaSubmenu(idChat, remitente, contenido, chatData, submenuId, contextoArbol);
        }

        // Procesando input del usuario
        if (arbolChat.startsWith("Solicitar Input Control Servicio ")) {
            return await procesarInputUsuario(idChat, remitente, contenido, chatData, contextoArbol);
        }

        // Interacción con IA
        if (arbolChat === "Interaccion AI Soul" || arbolChat === dataEstatica.arbol.alertaNoEntiendo) {
            return await procesarMensajeAISoulConAdjuntos(idChat, remitente, contenido, contextoArbol);
        }

        logger.warn({ contexto: "model", recurso: "arbolControlServicio.arbolControlServicio", arbolChat, idChat, remitente },
            "No se encontró condición válida para arbolChat en Control Servicio");
        return true;
    } catch (error) {
        const api = 'Chat Web Triple A';
        const procesoApi = 'Arbol Control Servicio';
        logger.error({
            contexto: 'model', recurso: 'arbolControlServicio.arbolControlServicio', codigoRespuesta: 500,
            errorMensaje: error.message, errorStack: error.stack, idChat, remitente, api, procesoApi
        },
            'Error en arbolControlServicio');
        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente, contextoArbol);
    }
};


// todo: Solicitar Menu Arbol Control Servicio
const solicitarMenuArbolControlServicio = async (idChat, remitente, chatData, contextoArbol = 'arbolControlServicio') => {
    const solicitarMenuArbolControlServicio = "Solicitar Menu Arbol Control Servicio"
    chatData.descripcion = 'Se solicita el menú de control de servicio.'

    await modelChat.actualizar(idChat, solicitarMenuArbolControlServicio, chatData)

    return await getArbolPrincipal().crearMensaje(
        idChat,
        remitente,
        dataEstatica.configuracion.estadoMensaje.enviado,
        dataEstatica.configuracion.tipoMensaje.texto,
        dataEstatica.mensajes.solicitarMenuArbolControlServicio,
        chatData.descripcion,
    )
}



// todo: Procesar Menu Arbol Control Servicio
const procesarMenuArbolControlServicio = async (idChat, remitente, contenido, chatData, contextoArbol = 'arbolControlServicio') => {
    try {
        const contenidoNormalized = String(contenido).trim();

        const menuOpciones = {
            '1': 'interrupciones_cierres',
            '2': 'sin_agua',
            '3': 'baja_presion_sector',
            '4': 'fuga_agua',
            '5': 'fuga_alcantarillado',
        };

        // Si es una opción válida del menú
        if (menuOpciones[contenidoNormalized]) {
            return await mostrarSubmenu(idChat, remitente, menuOpciones[contenidoNormalized], chatData, contextoArbol);
        }

        // Permitir REGRESAR (case-insensitive)
        if (contenidoNormalized.toUpperCase() === 'REGRESAR') {
            chatData.descripcion = 'Usuario escribió REGRESAR';
            return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
        }

        // Opción no válida
        const resultado = await getArbolPrincipal().manejarNoEntiendo(
            idChat,
            remitente,
            "Alerta No Entiendo - Solicitar Menu Arbol Control Servicio",
            dataEstatica.mensajes.alertaNoEntiendo
        );

        if (resultado) {
            return await solicitarMenuArbolControlServicio(idChat, remitente, chatData, contextoArbol);
        }
        return false;

    } catch (error) {
        logger.error({
            contexto: 'model',
            recurso: 'arbolControlServicio.procesarMenuArbolControlServicio',
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente
        }, 'Error en procesarMenuArbolControlServicio');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Procesar Menu Control Servicio';
        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente);
    }
};



// todo: Consumir Endpoint Información Cliente IVR
const consumirEndpointInfoCliente = async (idChat, remitente, chatData, contextoArbol = 'arbolControlServicio') => {
    try {
        // Control de intentos
        if (!chatData.controlPeticiones || chatData.controlPeticiones === '-') {
            chatData.controlPeticiones = 0;
        }

        if (chatData.controlPeticiones <= 5) {
            // Construir estructura del mensaje para la API
            const estructuraMensaje = {
                scriptName: 'ws_ivr_informacion_cliente',
                poliza: chatData.numeroPoliza
            };

            // Consumir servicio de Triple A
            const response = await serviceTripleA.procesarConsultaTripleA(estructuraMensaje);
            
            // SOLO incrementar contador si el servicio devuelve status diferente a 200
            if (response.status !== 200) {
                chatData.controlPeticiones = (parseInt(chatData.controlPeticiones) || 0) + 1;
                chatData.controlApi = dataEstatica.configuracion.controlApi.error;
                chatData.descripcion = `Endpoint información cliente IVR presentó error HTTP status ${response.status} (intento ${chatData.controlPeticiones}/6).`;
                
                logger.warn({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointInfoCliente`,
                    idChat,
                    remitente,
                    controlPeticiones: chatData.controlPeticiones,
                    status: response.status
                }, `⚠️ Error HTTP en endpoint información cliente IVR - Status: ${response.status}`);
                
                await modelChat.actualizar(idChat, "Endpoint Info Cliente IVR - Error HTTP", chatData);

                const api = 'Chat Web Triple A';
                const procesoApi = 'Endpoint Información Cliente IVR';
                return await getArbolPrincipal().errorAPI(api, procesoApi, response, idChat, remitente, contextoArbol);
            }

            // Si la respuesta tiene status 200, procesar la respuesta sin marcar errores
            // Serializar resultadoApi antes de guardarlo en la base de datos
            chatData.resultadoApi = typeof response.data === 'object' ? JSON.stringify(response.data) : response.data;
            chatData.controlApi = dataEstatica.configuracion.controlApi.success;
            chatData.controlPeticiones = 0; // Resetear contador en caso de éxito HTTP 200
            chatData.descripcion = 'Endpoint información cliente IVR ejecutado exitosamente.';

            // Verificar si hay resultados y dirección
            if (response.data && response.data.results && response.data.results[0] && response.data.results[0].direccion) {
                const direccion = response.data.results[0].direccion;
                chatData.direccion = direccion;

                // Mostrar mensaje con la dirección
                const mensajeDireccion = dataEstatica.mensajes.direccionAsociadaPoliza(direccion);
                await getArbolPrincipal().crearMensaje(
                    idChat,
                    remitente,
                    dataEstatica.configuracion.estadoMensaje.enviado,
                    dataEstatica.configuracion.tipoMensaje.texto,
                    mensajeDireccion,
                    chatData.descripcion
                );

                // NO actualizar el chat aquí, dejar que el avance automático actualice el estado correctamente
                // await modelChat.actualizar(idChat, "Endpoint Info Cliente IVR - Éxito", chatData);
                return true;
            } else {
                // No se encontró dirección en la respuesta
                chatData.descripcion = 'La respuesta del endpoint no contiene información de dirección válida.';
                await modelChat.actualizar(idChat, "Endpoint Info Cliente IVR - Sin dirección", chatData);
                
                const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>No pudimos obtener la información de tu servicio.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
                await getArbolPrincipal().crearMensaje(
                    idChat,
                    remitente,
                    dataEstatica.configuracion.estadoMensaje.enviado,
                    dataEstatica.configuracion.tipoMensaje.pasoAgente,
                    mensajeError,
                    chatData.descripcion
                );
                
                // Pasar a asesor
                return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'Necesito ayuda con mi servicio', contextoArbol);
            }
        } else {
            // Se superó el límite de intentos
            chatData.descripcion = 'Se superó el límite de intentos para el endpoint información cliente IVR.';
            await modelChat.actualizar(idChat, "Endpoint Info Cliente IVR - Límite intentos", chatData);
            
            const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>Estamos presentando dificultades técnicas.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
            await getArbolPrincipal().crearMensaje(
                idChat,
                remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                mensajeError,
                chatData.descripcion
            );
            
            // Pasar a asesor
            return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'Necesito ayuda con mi servicio', contextoArbol);
        }
    } catch (error) {
        // INCREMENTAR CONTADOR solo si el error tiene un status HTTP diferente a 200
        // Si es una excepción de red u otro tipo, también incrementar porque no se pudo consumir el servicio
        const errorStatus = error.response?.status;
        if (errorStatus && errorStatus !== 200) {
            chatData.controlPeticiones = (parseInt(chatData.controlPeticiones) || 0) + 1;
            chatData.controlApi = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error HTTP al consumir endpoint información cliente IVR - Status: ${errorStatus} (intento ${chatData.controlPeticiones}/6).`;
        } else {
            // Excepción de red u otro tipo - también incrementar porque no se pudo consumir
            chatData.controlPeticiones = (parseInt(chatData.controlPeticiones) || 0) + 1;
            chatData.controlApi = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error al consumir endpoint información cliente IVR - Excepción: ${error.message} (intento ${chatData.controlPeticiones}/6).`;
        }
        
        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointInfoCliente`,
            idChat,
            remitente,
            controlPeticiones: chatData.controlPeticiones,
            errorStatus: errorStatus || 'N/A',
            errorMensaje: error.message
        }, '❌ Error al consumir endpoint información cliente IVR');
        
        await modelChat.actualizar(idChat, "Endpoint Info Cliente IVR - Error", chatData);

        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointInfoCliente`,
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            controlPeticiones: chatData.controlPeticiones
        }, 'Error en consumirEndpointInfoCliente');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Endpoint Información Cliente IVR';
        const errorResult = await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente, contextoArbol);
        
        // Si se superó el límite de intentos, pasar a asesor
        if (chatData.controlPeticiones > 5) {
            const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>Estamos presentando dificultades técnicas.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
            await getArbolPrincipal().crearMensaje(
                idChat,
                remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                mensajeError,
                chatData.descripcion
            );
            return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'Necesito ayuda con mi servicio', contextoArbol);
        }
        
        return errorResult || false;
    }
};

// todo: Consumir Endpoint IVR Sin Agua
const consumirEndpointIVRSinAgua = async (idChat, remitente, chatData, contextoArbol = 'arbolControlServicio') => {
    try {
        // Control de intentos (usar un contador separado para este endpoint)
        // Inicializar como número, no como string
        if (chatData.controlPeticionesIVR === undefined || chatData.controlPeticionesIVR === null || chatData.controlPeticionesIVR === '-') {
            chatData.controlPeticionesIVR = 0;
        } else {
            // Asegurar que sea un número
            chatData.controlPeticionesIVR = parseInt(chatData.controlPeticionesIVR) || 0;
        }

        logger.info({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVRSinAgua`,
            idChat,
            remitente,
            controlPeticionesIVR: chatData.controlPeticionesIVR
        }, `🔄 Intentando consumir endpoint IVR Sin Agua (intento ${chatData.controlPeticionesIVR + 1})`);

        if (chatData.controlPeticionesIVR <= 5) {
            // Construir estructura del mensaje para la API
            const estructuraMensaje = {
                scriptName: 'ws_ivr_crear_solicitud',
                poliza: chatData.numeroPoliza,
                tpd_codigo: '1',
                tpq_codigo: '03',
                tel_ivr: '1'
            };

            // Consumir servicio de Triple A
            const response = await serviceTripleA.procesarConsultaTripleA(estructuraMensaje);
            
            // SOLO incrementar contador si el servicio devuelve status diferente a 200
            if (response.status !== 200) {
                chatData.controlPeticionesIVR = (parseInt(chatData.controlPeticionesIVR) || 0) + 1;
                chatData.controlApiIVR = dataEstatica.configuracion.controlApi.error;
                chatData.descripcion = `Endpoint IVR Sin Agua presentó error HTTP status ${response.status} (intento ${chatData.controlPeticionesIVR}/6).`;
                
                logger.warn({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointIVRSinAgua`,
                    idChat,
                    remitente,
                    controlPeticionesIVR: chatData.controlPeticionesIVR,
                    status: response.status
                }, `⚠️ Error HTTP en endpoint IVR Sin Agua - Status: ${response.status}`);
                
                await modelChat.actualizar(idChat, "Endpoint IVR Sin Agua - Error HTTP", chatData);

                const api = 'Chat Web Triple A';
                const procesoApi = 'Endpoint IVR Sin Agua';
                return await getArbolPrincipal().errorAPI(api, procesoApi, response, idChat, remitente, contextoArbol);
            }

            // Si la respuesta tiene status 200, procesar la respuesta sin marcar errores
            // Serializar resultadoApiIVR antes de guardarlo en la base de datos
            chatData.resultadoApiIVR = typeof response.data === 'object' ? JSON.stringify(response.data) : response.data;
            chatData.controlApiIVR = dataEstatica.configuracion.controlApi.success;
            chatData.controlPeticionesIVR = 0; // Resetear contador en caso de éxito HTTP 200
            chatData.descripcion = 'Endpoint IVR Sin Agua ejecutado exitosamente.';

                // Verificar si la respuesta es efectiva pero errónea
                if (response.data && response.data.results && response.data.results[0]) {
                    const resultado = response.data.results[0];
                    const msgsis = resultado.msgsis || '';
                    
                    logger.info({
                        contexto: 'model',
                        recurso: `${contextoArbol}.consumirEndpointIVRSinAgua`,
                        idChat,
                        remitente,
                        resultado: resultado,
                        tieneCodigo: !!resultado.codigo,
                        codigo: resultado.codigo
                    }, '📋 Procesando resultado del endpoint IVR Sin Agua');
                    
                    // Validar respuesta efectiva pero errónea
                    if (msgsis.includes('NO SE PUDO REALIZAR')) {
                        // Respuesta errónea, pasar a asesor
                        chatData.descripcion = 'La solicitud no pudo ser realizada según respuesta del endpoint.';
                        await modelChat.actualizar(idChat, "Endpoint IVR Sin Agua - Solicitud no realizada", chatData);
                        
                        const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>No pudimos registrar tu solicitud.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
                        await getArbolPrincipal().crearMensaje(
                            idChat,
                            remitente,
                            dataEstatica.configuracion.estadoMensaje.enviado,
                            dataEstatica.configuracion.tipoMensaje.pasoAgente,
                            mensajeError,
                            chatData.descripcion
                        );
                        
                        // Pasar a asesor
                        return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'No se pudo registrar mi solicitud', contextoArbol);
                    } else if (msgsis.includes('USUARIO YA TIENE REGISTRADA UNA SOLICITUD')) {
                        // Usuario ya tiene una solicitud registrada - Caso válido
                        chatData.descripcion = 'Usuario ya tiene una solicitud registrada en el sistema.';
                        await modelChat.actualizar(idChat, "Endpoint IVR Sin Agua - Solicitud ya registrada", chatData);
                        
                        const mensajeInfo = `<p class='polizaYaRegistrada'> ℹ️ <b>Ya tienes una solicitud registrada en nuestro sistema.</b><br/><br/>
 
📋Si necesitas más información o seguimiento, te conectaré con un agente. 👤</p>`;
                        await getArbolPrincipal().crearMensaje(
                            idChat,
                            remitente,
                            dataEstatica.configuracion.estadoMensaje.enviado,
                            dataEstatica.configuracion.tipoMensaje.pasoAgente,
                            mensajeInfo,
                            chatData.descripcion
                        );
                        
                        // Pasar a asesor para seguimiento
                        return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'Necesito información sobre mi solicitud registrada', contextoArbol);
                    } else {
                        // Solicitud exitosa - El código siempre debe estar presente en respuestas exitosas
                        if (!resultado.codigo || resultado.codigo.trim() === '') {
                            logger.error({
                                contexto: 'model',
                                recurso: `${contextoArbol}.consumirEndpointIVRSinAgua`,
                                idChat,
                                remitente,
                                resultado: resultado
                            }, '❌ Respuesta exitosa pero sin código de reporte');
                            
                            chatData.descripcion = 'La respuesta del endpoint no contiene código de reporte.';
                            await modelChat.actualizar(idChat, "Endpoint IVR Sin Agua - Sin código", chatData);
                            
                            const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>No pudimos obtener el número de reporte.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
                            await getArbolPrincipal().crearMensaje(
                                idChat,
                                remitente,
                                dataEstatica.configuracion.estadoMensaje.enviado,
                                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                                mensajeError,
                                chatData.descripcion
                            );
                            
                            return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'No se obtuvo número de reporte', contextoArbol);
                        }
                        
                        const codigo = resultado.codigo;
                        chatData.numeroReporte = codigo;
                        
                        const mensajeExito = dataEstatica.mensajes.mensajeExitoIVR(codigo);
                        await getArbolPrincipal().crearMensaje(
                            idChat,
                            remitente,
                            dataEstatica.configuracion.estadoMensaje.enviado,
                            dataEstatica.configuracion.tipoMensaje.texto,
                            mensajeExito,
                            chatData.descripcion
                        );

                        // Actualizar el chat
                        await modelChat.actualizar(idChat, "Endpoint IVR Sin Agua - Éxito", chatData);
                        return true;
                    }
                } else {
                    // Respuesta sin estructura esperada
                    chatData.descripcion = 'La respuesta del endpoint no tiene la estructura esperada.';
                    await modelChat.actualizar(idChat, "Endpoint IVR Sin Agua - Respuesta inválida", chatData);
                    
                    const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>No pudimos registrar tu solicitud.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
                    await getArbolPrincipal().crearMensaje(
                        idChat,
                        remitente,
                        dataEstatica.configuracion.estadoMensaje.enviado,
                        dataEstatica.configuracion.tipoMensaje.pasoAgente,
                        mensajeError,
                        chatData.descripcion
                    );
                    
                    // Pasar a asesor
                    return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'No se pudo registrar mi solicitud', contextoArbol);
                }
        } else {
            // Se superó el límite de intentos
            chatData.descripcion = 'Se superó el límite de intentos para el endpoint IVR Sin Agua.';
            await modelChat.actualizar(idChat, "Endpoint IVR Sin Agua - Límite intentos", chatData);
            
            const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>Estamos presentando dificultades técnicas.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
            await getArbolPrincipal().crearMensaje(
                idChat,
                remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                mensajeError,
                chatData.descripcion
            );
            
            // Pasar a asesor
            return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'Necesito ayuda con mi servicio', contextoArbol);
        }
    } catch (error) {
        // INCREMENTAR CONTADOR solo si el error tiene un status HTTP diferente a 200
        // Si es una excepción de red u otro tipo, también incrementar porque no se pudo consumir el servicio
        const errorStatus = error.response?.status;
        if (errorStatus && errorStatus !== 200) {
            chatData.controlPeticionesIVR = (parseInt(chatData.controlPeticionesIVR) || 0) + 1;
            chatData.controlApiIVR = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error HTTP al consumir endpoint IVR Sin Agua - Status: ${errorStatus} (intento ${chatData.controlPeticionesIVR}/6).`;
        } else {
            // Excepción de red u otro tipo - también incrementar porque no se pudo consumir
            chatData.controlPeticionesIVR = (parseInt(chatData.controlPeticionesIVR) || 0) + 1;
            chatData.controlApiIVR = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error al consumir endpoint IVR Sin Agua - Excepción: ${error.message} (intento ${chatData.controlPeticionesIVR}/6).`;
        }
        
        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVRSinAgua`,
            idChat,
            remitente,
            controlPeticionesIVR: chatData.controlPeticionesIVR,
            errorStatus: errorStatus || 'N/A',
            errorMensaje: error.message
        }, '❌ Error al consumir endpoint IVR Sin Agua');
        
        await modelChat.actualizar(idChat, "Endpoint IVR Sin Agua - Error", chatData);

        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVRSinAgua`,
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            controlPeticionesIVR: chatData.controlPeticionesIVR
        }, 'Error en consumirEndpointIVRSinAgua');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Endpoint IVR Sin Agua';
        const errorResult = await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente, contextoArbol);
        
        // Si se superó el límite de intentos, pasar a asesor
        if (chatData.controlPeticionesIVR > 5) {
            const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>Estamos presentando dificultades técnicas.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
            await getArbolPrincipal().crearMensaje(
                idChat,
                remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                mensajeError,
                chatData.descripcion
            );
            return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'Necesito ayuda con mi servicio', contextoArbol);
        }
        
        return errorResult || false;
    }
};

// todo: Consumir Endpoint IVR Baja Presión Sector
const consumirEndpointIVRBajaPresion = async (idChat, remitente, chatData, contextoArbol = 'arbolControlServicio') => {
    try {
        // Control de intentos (usar un contador separado para este endpoint)
        if (!chatData.controlPeticionesIVRBajaPresion || chatData.controlPeticionesIVRBajaPresion === '-') {
            chatData.controlPeticionesIVRBajaPresion = 0;
        }

        if (chatData.controlPeticionesIVRBajaPresion <= 5) {
            // Construir estructura del mensaje para la API
            const estructuraMensaje = {
                scriptName: 'ws_ivr_crear_solicitud',
                poliza: chatData.numeroPoliza,
                tpd_codigo: '103',
                tpq_codigo: '04A',
                tel_ivr: '1'
            };

            // Consumir servicio de Triple A
            const response = await serviceTripleA.procesarConsultaTripleA(estructuraMensaje);
            
            // SOLO incrementar contador si el servicio devuelve status diferente a 200
            if (response.status !== 200) {
                chatData.controlPeticionesIVRBajaPresion = (parseInt(chatData.controlPeticionesIVRBajaPresion) || 0) + 1;
                chatData.controlApiIVRBajaPresion = dataEstatica.configuracion.controlApi.error;
                chatData.descripcion = `Endpoint IVR Baja Presión presentó error HTTP status ${response.status} (intento ${chatData.controlPeticionesIVRBajaPresion}/6).`;
                
                logger.warn({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointIVRBajaPresion`,
                    idChat,
                    remitente,
                    controlPeticionesIVRBajaPresion: chatData.controlPeticionesIVRBajaPresion,
                    status: response.status
                }, `⚠️ Error HTTP en endpoint IVR Baja Presión - Status: ${response.status}`);
                
                await modelChat.actualizar(idChat, "Endpoint IVR Baja Presión - Error HTTP", chatData);

                const api = 'Chat Web Triple A';
                const procesoApi = 'Endpoint IVR Baja Presión Sector';
                return await getArbolPrincipal().errorAPI(api, procesoApi, response, idChat, remitente, contextoArbol);
            }

            // Si la respuesta tiene status 200, procesar la respuesta sin marcar errores
            // Serializar resultadoApiIVRBajaPresion antes de guardarlo en la base de datos
            chatData.resultadoApiIVRBajaPresion = typeof response.data === 'object' ? JSON.stringify(response.data) : response.data;
            chatData.controlApiIVRBajaPresion = dataEstatica.configuracion.controlApi.success;
            chatData.controlPeticionesIVRBajaPresion = 0; // Resetear contador en caso de éxito HTTP 200
            chatData.descripcion = 'Endpoint IVR Baja Presión Sector ejecutado exitosamente.';

                // Verificar si la respuesta es efectiva pero errónea
                if (response.data && response.data.results && response.data.results[0]) {
                    const resultado = response.data.results[0];
                    const msgsis = resultado.msgsis || '';
                    
                    logger.info({
                        contexto: 'model',
                        recurso: `${contextoArbol}.consumirEndpointIVRBajaPresion`,
                        idChat,
                        remitente,
                        resultado: resultado,
                        tieneCodigo: !!resultado.codigo,
                        codigo: resultado.codigo
                    }, '📋 Procesando resultado del endpoint IVR Baja Presión');
                    
                    // Validar respuesta efectiva pero errónea
                    if (msgsis.includes('NO SE PUDO REALIZAR')) {
                        // Respuesta errónea, pasar a asesor
                        chatData.descripcion = 'La solicitud no pudo ser realizada según respuesta del endpoint.';
                        await modelChat.actualizar(idChat, "Endpoint IVR Baja Presión - Solicitud no realizada", chatData);
                        
                        const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>No pudimos registrar tu solicitud.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
                        await getArbolPrincipal().crearMensaje(
                            idChat,
                            remitente,
                            dataEstatica.configuracion.estadoMensaje.enviado,
                            dataEstatica.configuracion.tipoMensaje.pasoAgente,
                            mensajeError,
                            chatData.descripcion
                        );
                        
                        // Pasar a asesor
                        return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'No se pudo registrar mi solicitud', contextoArbol);
                    } else if (msgsis.includes('USUARIO YA TIENE REGISTRADA UNA SOLICITUD')) {
                        // Usuario ya tiene una solicitud registrada - Caso válido
                        chatData.descripcion = 'Usuario ya tiene una solicitud registrada en el sistema.';
                        await modelChat.actualizar(idChat, "Endpoint IVR Baja Presión - Solicitud ya registrada", chatData);
                        
                        const mensajeInfo = `<p class='polizaYaRegistrada'> ℹ️ <b>Ya tienes una solicitud registrada en nuestro sistema.</b><br/><br/>
 
📋Si necesitas más información o seguimiento, te conectaré con un agente. 👤</p>`;
                        await getArbolPrincipal().crearMensaje(
                            idChat,
                            remitente,
                            dataEstatica.configuracion.estadoMensaje.enviado,
                            dataEstatica.configuracion.tipoMensaje.pasoAgente,
                            mensajeInfo,
                            chatData.descripcion
                        );
                        
                        // Pasar a asesor para seguimiento
                        return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'Necesito información sobre mi solicitud registrada', contextoArbol);
                    } else {
                        // Solicitud exitosa - El código siempre debe estar presente en respuestas exitosas
                        if (!resultado.codigo || resultado.codigo.trim() === '') {
                            logger.error({
                                contexto: 'model',
                                recurso: `${contextoArbol}.consumirEndpointIVRBajaPresion`,
                                idChat,
                                remitente,
                                resultado: resultado
                            }, '❌ Respuesta exitosa pero sin código de reporte');
                            
                            chatData.descripcion = 'La respuesta del endpoint no contiene código de reporte.';
                            await modelChat.actualizar(idChat, "Endpoint IVR Baja Presión - Sin código", chatData);
                            
                            const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>No pudimos obtener el número de reporte.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
                            await getArbolPrincipal().crearMensaje(
                                idChat,
                                remitente,
                                dataEstatica.configuracion.estadoMensaje.enviado,
                                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                                mensajeError,
                                chatData.descripcion
                            );
                            
                            return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'No se obtuvo número de reporte', contextoArbol);
                        }
                        
                        const codigo = resultado.codigo;
                        chatData.numeroReporte = codigo;
                        
                        const mensajeExito = dataEstatica.mensajes.mensajeExitoIVR(codigo);
                        await getArbolPrincipal().crearMensaje(
                            idChat,
                            remitente,
                            dataEstatica.configuracion.estadoMensaje.enviado,
                            dataEstatica.configuracion.tipoMensaje.texto,
                            mensajeExito,
                            chatData.descripcion
                        );

                        // Actualizar el chat
                        await modelChat.actualizar(idChat, "Endpoint IVR Baja Presión - Éxito", chatData);
                        return true;
                    }
                } else {
                    // Respuesta sin estructura esperada
                    chatData.descripcion = 'La respuesta del endpoint no tiene la estructura esperada.';
                    await modelChat.actualizar(idChat, "Endpoint IVR Baja Presión - Respuesta inválida", chatData);
                    
                    const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>No pudimos registrar tu solicitud.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
                    await getArbolPrincipal().crearMensaje(
                        idChat,
                        remitente,
                        dataEstatica.configuracion.estadoMensaje.enviado,
                        dataEstatica.configuracion.tipoMensaje.texto,
                        mensajeError,
                        chatData.descripcion
                    );
                    
                    // Pasar a asesor
                    return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'No se pudo registrar mi solicitud', contextoArbol);
                }
        } else {
            // Se superó el límite de intentos
            chatData.descripcion = 'Se superó el límite de intentos para el endpoint IVR Baja Presión.';
            await modelChat.actualizar(idChat, "Endpoint IVR Baja Presión - Límite intentos", chatData);
            
            const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>Estamos presentando dificultades técnicas.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
            await getArbolPrincipal().crearMensaje(
                idChat,
                remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                mensajeError,
                chatData.descripcion
            );
            
            // Pasar a asesor
            return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'Necesito ayuda con mi servicio', contextoArbol);
        }
    } catch (error) {
        // INCREMENTAR CONTADOR solo si el error tiene un status HTTP diferente a 200
        // Si es una excepción de red u otro tipo, también incrementar porque no se pudo consumir el servicio
        const errorStatus = error.response?.status;
        if (errorStatus && errorStatus !== 200) {
            chatData.controlPeticionesIVRBajaPresion = (parseInt(chatData.controlPeticionesIVRBajaPresion) || 0) + 1;
            chatData.controlApiIVRBajaPresion = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error HTTP al consumir endpoint IVR Baja Presión - Status: ${errorStatus} (intento ${chatData.controlPeticionesIVRBajaPresion}/6).`;
        } else {
            // Excepción de red u otro tipo - también incrementar porque no se pudo consumir
            chatData.controlPeticionesIVRBajaPresion = (parseInt(chatData.controlPeticionesIVRBajaPresion) || 0) + 1;
            chatData.controlApiIVRBajaPresion = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error al consumir endpoint IVR Baja Presión - Excepción: ${error.message} (intento ${chatData.controlPeticionesIVRBajaPresion}/6).`;
        }
        
        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVRBajaPresion`,
            idChat,
            remitente,
            controlPeticionesIVRBajaPresion: chatData.controlPeticionesIVRBajaPresion,
            errorStatus: errorStatus || 'N/A',
            errorMensaje: error.message
        }, '❌ Error al consumir endpoint IVR Baja Presión');
        
        await modelChat.actualizar(idChat, "Endpoint IVR Baja Presión - Error", chatData);

        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVRBajaPresion`,
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            controlPeticionesIVRBajaPresion: chatData.controlPeticionesIVRBajaPresion
        }, 'Error en consumirEndpointIVRBajaPresion');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Endpoint IVR Baja Presión Sector';
        const errorResult = await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente, contextoArbol);
        
        // Si se superó el límite de intentos, pasar a asesor
        if (chatData.controlPeticionesIVRBajaPresion > 5) {
            const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>Estamos presentando dificultades técnicas.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
            await getArbolPrincipal().crearMensaje(
                idChat,
                remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                mensajeError,
                chatData.descripcion
            );
            return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'Necesito ayuda con mi servicio', contextoArbol);
        }
        
        return errorResult || false;
    }
};

// todo: Consumir Endpoint IVR Fuga Agua
const consumirEndpointIVRFugaAgua = async (idChat, remitente, chatData, contextoArbol = 'arbolControlServicio') => {
    try {
        // Control de intentos (usar un contador separado para este endpoint)
        if (!chatData.controlPeticionesIVRFugaAgua || chatData.controlPeticionesIVRFugaAgua === '-') {
            chatData.controlPeticionesIVRFugaAgua = 0;
        }

        if (chatData.controlPeticionesIVRFugaAgua <= 5) {
            // Construir estructura del mensaje para la API
            const estructuraMensaje = {
                scriptName: 'ws_ivr_crear_solicitud',
                poliza: chatData.numeroPoliza,
                tpd_codigo: '1',
                tpq_codigo: '01',
                tel_ivr: '1'
            };

            // Consumir servicio de Triple A
            const response = await serviceTripleA.procesarConsultaTripleA(estructuraMensaje);
            
            // SOLO incrementar contador si el servicio devuelve status diferente a 200
            if (response.status !== 200) {
                chatData.controlPeticionesIVRFugaAgua = (parseInt(chatData.controlPeticionesIVRFugaAgua) || 0) + 1;
                chatData.controlApiIVRFugaAgua = dataEstatica.configuracion.controlApi.error;
                chatData.descripcion = `Endpoint IVR Fuga Agua presentó error HTTP status ${response.status} (intento ${chatData.controlPeticionesIVRFugaAgua}/6).`;
                
                logger.warn({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointIVRFugaAgua`,
                    idChat,
                    remitente,
                    controlPeticionesIVRFugaAgua: chatData.controlPeticionesIVRFugaAgua,
                    status: response.status
                }, `⚠️ Error HTTP en endpoint IVR Fuga Agua - Status: ${response.status}`);
                
                await modelChat.actualizar(idChat, "Endpoint IVR Fuga Agua - Error HTTP", chatData);

                const api = 'Chat Web Triple A';
                const procesoApi = 'Endpoint IVR Fuga Agua';
                return await getArbolPrincipal().errorAPI(api, procesoApi, response, idChat, remitente, contextoArbol);
            }

            // Si la respuesta tiene status 200, procesar la respuesta sin marcar errores
            // Serializar resultadoApiIVRFugaAgua antes de guardarlo en la base de datos
            chatData.resultadoApiIVRFugaAgua = typeof response.data === 'object' ? JSON.stringify(response.data) : response.data;
            chatData.controlApiIVRFugaAgua = dataEstatica.configuracion.controlApi.success;
            chatData.controlPeticionesIVRFugaAgua = 0; // Resetear contador en caso de éxito HTTP 200
            chatData.descripcion = 'Endpoint IVR Fuga Agua ejecutado exitosamente.';

                // Verificar si la respuesta es efectiva pero errónea
                if (response.data && response.data.results && response.data.results[0]) {
                    const resultado = response.data.results[0];
                    const msgsis = resultado.msgsis || '';
                    
                    logger.info({
                        contexto: 'model',
                        recurso: `${contextoArbol}.consumirEndpointIVRFugaAgua`,
                        idChat,
                        remitente,
                        resultado: resultado,
                        tieneCodigo: !!resultado.codigo,
                        codigo: resultado.codigo
                    }, '📋 Procesando resultado del endpoint IVR Fuga Agua');
                    
                    // Validar respuesta efectiva pero errónea
                    if (msgsis.includes('NO SE PUDO REALIZAR')) {
                        // Respuesta errónea, pasar a asesor
                        chatData.descripcion = 'La solicitud no pudo ser realizada según respuesta del endpoint.';
                        await modelChat.actualizar(idChat, "Endpoint IVR Fuga Agua - Solicitud no realizada", chatData);
                        
                        const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>No pudimos registrar tu solicitud.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
                        await getArbolPrincipal().crearMensaje(
                            idChat,
                            remitente,
                            dataEstatica.configuracion.estadoMensaje.enviado,
                            dataEstatica.configuracion.tipoMensaje.pasoAgente,
                            mensajeError,
                            chatData.descripcion
                        );
                        
                        // Pasar a asesor
                        return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'No se pudo registrar mi solicitud', contextoArbol);
                    } else if (msgsis.includes('USUARIO YA TIENE REGISTRADA UNA SOLICITUD')) {
                        // Usuario ya tiene una solicitud registrada - Caso válido
                        chatData.descripcion = 'Usuario ya tiene una solicitud registrada en el sistema.';
                        await modelChat.actualizar(idChat, "Endpoint IVR Fuga Agua - Solicitud ya registrada", chatData);
                        
                        const mensajeInfo = `<p class='polizaYaRegistrada'> ℹ️ <b>Ya tienes una solicitud registrada en nuestro sistema.</b><br/><br/>
 
📋Si necesitas más información o seguimiento, te conectaré con un agente. 👤</p>`;
                        await getArbolPrincipal().crearMensaje(
                            idChat,
                            remitente,
                            dataEstatica.configuracion.estadoMensaje.enviado,
                            dataEstatica.configuracion.tipoMensaje.pasoAgente,
                            mensajeInfo,
                            chatData.descripcion
                        );
                        
                        // Pasar a asesor para seguimiento
                        return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'Necesito información sobre mi solicitud registrada', contextoArbol);
                    } else {
                        // Solicitud exitosa - El código siempre debe estar presente en respuestas exitosas
                        if (!resultado.codigo || resultado.codigo.trim() === '') {
                            logger.error({
                                contexto: 'model',
                                recurso: `${contextoArbol}.consumirEndpointIVRFugaAgua`,
                                idChat,
                                remitente,
                                resultado: resultado
                            }, '❌ Respuesta exitosa pero sin código de reporte');
                            
                            chatData.descripcion = 'La respuesta del endpoint no contiene código de reporte.';
                            await modelChat.actualizar(idChat, "Endpoint IVR Fuga Agua - Sin código", chatData);
                            
                            const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>No pudimos obtener el número de reporte.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
                            await getArbolPrincipal().crearMensaje(
                                idChat,
                                remitente,
                                dataEstatica.configuracion.estadoMensaje.enviado,
                                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                                mensajeError,
                                chatData.descripcion
                            );
                            
                            return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'No se obtuvo número de reporte', contextoArbol);
                        }
                        
                        const codigo = resultado.codigo;
                        chatData.numeroReporte = codigo;
                        
                        const mensajeExito = dataEstatica.mensajes.mensajeExitoIVR(codigo);
                        await getArbolPrincipal().crearMensaje(
                            idChat,
                            remitente,
                            dataEstatica.configuracion.estadoMensaje.enviado,
                            dataEstatica.configuracion.tipoMensaje.texto,
                            mensajeExito,
                            chatData.descripcion
                        );

                        // Actualizar el chat
                        await modelChat.actualizar(idChat, "Endpoint IVR Fuga Agua - Éxito", chatData);
                        return true;
                    }
                } else {
                    // Respuesta sin estructura esperada
                    chatData.descripcion = 'La respuesta del endpoint no tiene la estructura esperada.';
                    await modelChat.actualizar(idChat, "Endpoint IVR Fuga Agua - Respuesta inválida", chatData);
                    
                    const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>No pudimos registrar tu solicitud.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
                    await getArbolPrincipal().crearMensaje(
                        idChat,
                        remitente,
                        dataEstatica.configuracion.estadoMensaje.enviado,
                        dataEstatica.configuracion.tipoMensaje.texto,
                        mensajeError,
                        chatData.descripcion
                    );
                    
                    // Pasar a asesor
                    return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'No se pudo registrar mi solicitud', contextoArbol);
                }
        } else {
            // Se superó el límite de intentos
            chatData.descripcion = 'Se superó el límite de intentos para el endpoint IVR Fuga Agua.';
            await modelChat.actualizar(idChat, "Endpoint IVR Fuga Agua - Límite intentos", chatData);
            
            const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>Estamos presentando dificultades técnicas.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
            await getArbolPrincipal().crearMensaje(
                idChat,
                remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                mensajeError,
                chatData.descripcion
            );
            
            // Pasar a asesor
            return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'Necesito ayuda con mi servicio', contextoArbol);
        }
    } catch (error) {
        // INCREMENTAR CONTADOR solo si el error tiene un status HTTP diferente a 200
        // Si es una excepción de red u otro tipo, también incrementar porque no se pudo consumir el servicio
        const errorStatus = error.response?.status;
        if (errorStatus && errorStatus !== 200) {
            chatData.controlPeticionesIVRFugaAgua = (parseInt(chatData.controlPeticionesIVRFugaAgua) || 0) + 1;
            chatData.controlApiIVRFugaAgua = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error HTTP al consumir endpoint IVR Fuga Agua - Status: ${errorStatus} (intento ${chatData.controlPeticionesIVRFugaAgua}/6).`;
        } else {
            // Excepción de red u otro tipo - también incrementar porque no se pudo consumir
            chatData.controlPeticionesIVRFugaAgua = (parseInt(chatData.controlPeticionesIVRFugaAgua) || 0) + 1;
            chatData.controlApiIVRFugaAgua = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error al consumir endpoint IVR Fuga Agua - Excepción: ${error.message} (intento ${chatData.controlPeticionesIVRFugaAgua}/6).`;
        }
        
        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVRFugaAgua`,
            idChat,
            remitente,
            controlPeticionesIVRFugaAgua: chatData.controlPeticionesIVRFugaAgua,
            errorStatus: errorStatus || 'N/A',
            errorMensaje: error.message
        }, '❌ Error al consumir endpoint IVR Fuga Agua');
        
        await modelChat.actualizar(idChat, "Endpoint IVR Fuga Agua - Error", chatData);

        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVRFugaAgua`,
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            controlPeticionesIVRFugaAgua: chatData.controlPeticionesIVRFugaAgua
        }, 'Error en consumirEndpointIVRFugaAgua');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Endpoint IVR Fuga Agua';
        const errorResult = await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente, contextoArbol);
        
        // Si se superó el límite de intentos, pasar a asesor
        if (chatData.controlPeticionesIVRFugaAgua > 5) {
            const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>Estamos presentando dificultades técnicas.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
            await getArbolPrincipal().crearMensaje(
                idChat,
                remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                mensajeError,
                chatData.descripcion
            );
            return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'Necesito ayuda con mi servicio', contextoArbol);
        }
        
        return errorResult || false;
    }
};

// todo: Consumir Endpoint IVR Fuga Alcantarillado
const consumirEndpointIVRFugaAlcantarillado = async (idChat, remitente, chatData, contextoArbol = 'arbolControlServicio') => {
    try {
        // Control de intentos (usar un contador separado para este endpoint)
        if (!chatData.controlPeticionesIVRFugaAlcantarillado || chatData.controlPeticionesIVRFugaAlcantarillado === '-') {
            chatData.controlPeticionesIVRFugaAlcantarillado = 0;
        }

        if (chatData.controlPeticionesIVRFugaAlcantarillado <= 5) {
            // Construir estructura del mensaje para la API
            const estructuraMensaje = {
                scriptName: 'ws_ivr_crear_solicitud',
                poliza: chatData.numeroPoliza,
                tpd_codigo: '2',
                tpq_codigo: '02',
                tel_ivr: '1'
            };

            // Consumir servicio de Triple A
            const response = await serviceTripleA.procesarConsultaTripleA(estructuraMensaje);
            
            // SOLO incrementar contador si el servicio devuelve status diferente a 200
            if (response.status !== 200) {
                chatData.controlPeticionesIVRFugaAlcantarillado = (parseInt(chatData.controlPeticionesIVRFugaAlcantarillado) || 0) + 1;
                chatData.controlApiIVRFugaAlcantarillado = dataEstatica.configuracion.controlApi.error;
                chatData.descripcion = `Endpoint IVR Fuga Alcantarillado presentó error HTTP status ${response.status} (intento ${chatData.controlPeticionesIVRFugaAlcantarillado}/6).`;
                
                logger.warn({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointIVRFugaAlcantarillado`,
                    idChat,
                    remitente,
                    controlPeticionesIVRFugaAlcantarillado: chatData.controlPeticionesIVRFugaAlcantarillado,
                    status: response.status
                }, `⚠️ Error HTTP en endpoint IVR Fuga Alcantarillado - Status: ${response.status}`);
                
                await modelChat.actualizar(idChat, "Endpoint IVR Fuga Alcantarillado - Error HTTP", chatData);

                const api = 'Chat Web Triple A';
                const procesoApi = 'Endpoint IVR Fuga Alcantarillado';
                return await getArbolPrincipal().errorAPI(api, procesoApi, response, idChat, remitente, contextoArbol);
            }

            // Si la respuesta tiene status 200, procesar la respuesta sin marcar errores
            // Serializar resultadoApiIVRFugaAlcantarillado antes de guardarlo en la base de datos
            chatData.resultadoApiIVRFugaAlcantarillado = typeof response.data === 'object' ? JSON.stringify(response.data) : response.data;
            chatData.controlApiIVRFugaAlcantarillado = dataEstatica.configuracion.controlApi.success;
            chatData.controlPeticionesIVRFugaAlcantarillado = 0; // Resetear contador en caso de éxito HTTP 200
            chatData.descripcion = 'Endpoint IVR Fuga Alcantarillado ejecutado exitosamente.';

                // Verificar si la respuesta es efectiva pero errónea
                if (response.data && response.data.results && response.data.results[0]) {
                    const resultado = response.data.results[0];
                    const msgsis = resultado.msgsis || '';
                    
                    logger.info({
                        contexto: 'model',
                        recurso: `${contextoArbol}.consumirEndpointIVRFugaAlcantarillado`,
                        idChat,
                        remitente,
                        resultado: resultado,
                        tieneCodigo: !!resultado.codigo,
                        codigo: resultado.codigo
                    }, '📋 Procesando resultado del endpoint IVR Fuga Alcantarillado');
                    
                    // Validar respuesta efectiva pero errónea
                    if (msgsis.includes('NO SE PUDO REALIZAR')) {
                        // Respuesta errónea, pasar a asesor
                        chatData.descripcion = 'La solicitud no pudo ser realizada según respuesta del endpoint.';
                        await modelChat.actualizar(idChat, "Endpoint IVR Fuga Alcantarillado - Solicitud no realizada", chatData);
                        
                        const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>No pudimos registrar tu solicitud.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
                        await getArbolPrincipal().crearMensaje(
                            idChat,
                            remitente,
                            dataEstatica.configuracion.estadoMensaje.enviado,
                            dataEstatica.configuracion.tipoMensaje.pasoAgente,
                            mensajeError,
                            chatData.descripcion
                        );
                        
                        // Pasar a asesor
                        return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'No se pudo registrar mi solicitud', contextoArbol);
                    } else if (msgsis.includes('USUARIO YA TIENE REGISTRADA UNA SOLICITUD')) {
                        // Usuario ya tiene una solicitud registrada - Caso válido
                        chatData.descripcion = 'Usuario ya tiene una solicitud registrada en el sistema.';
                        await modelChat.actualizar(idChat, "Endpoint IVR Fuga Alcantarillado - Solicitud ya registrada", chatData);
                        
                        const mensajeInfo = `<p class='polizaYaRegistrada'> ℹ️ <b>Ya tienes una solicitud registrada en nuestro sistema.</b><br/><br/>
 
📋Si necesitas más información o seguimiento, te conectaré con un agente. 👤</p>`;
                        await getArbolPrincipal().crearMensaje(
                            idChat,
                            remitente,
                            dataEstatica.configuracion.estadoMensaje.enviado,
                            dataEstatica.configuracion.tipoMensaje.pasoAgente,
                            mensajeInfo,
                            chatData.descripcion
                        );
                        
                        // Pasar a asesor para seguimiento
                        return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'Necesito información sobre mi solicitud registrada', contextoArbol);
                    } else {
                        // Solicitud exitosa - El código siempre debe estar presente en respuestas exitosas
                        if (!resultado.codigo || resultado.codigo.trim() === '') {
                            logger.error({
                                contexto: 'model',
                                recurso: `${contextoArbol}.consumirEndpointIVRFugaAlcantarillado`,
                                idChat,
                                remitente,
                                resultado: resultado
                            }, '❌ Respuesta exitosa pero sin código de reporte');
                            
                            chatData.descripcion = 'La respuesta del endpoint no contiene código de reporte.';
                            await modelChat.actualizar(idChat, "Endpoint IVR Fuga Alcantarillado - Sin código", chatData);
                            
                            const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>No pudimos obtener el número de reporte.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
                            await getArbolPrincipal().crearMensaje(
                                idChat,
                                remitente,
                                dataEstatica.configuracion.estadoMensaje.enviado,
                                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                                mensajeError,
                                chatData.descripcion
                            );
                            
                            return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'No se obtuvo número de reporte', contextoArbol);
                        }
                        
                        const codigo = resultado.codigo;
                        chatData.numeroReporte = codigo;
                        
                        const mensajeExito = dataEstatica.mensajes.mensajeExitoIVR(codigo);
                        await getArbolPrincipal().crearMensaje(
                            idChat,
                            remitente,
                            dataEstatica.configuracion.estadoMensaje.enviado,
                            dataEstatica.configuracion.tipoMensaje.texto,
                            mensajeExito,
                            chatData.descripcion
                        );

                        // Actualizar el chat
                        await modelChat.actualizar(idChat, "Endpoint IVR Fuga Alcantarillado - Éxito", chatData);
                        return true;
                    }
                } else {
                    // Respuesta sin estructura esperada
                    chatData.descripcion = 'La respuesta del endpoint no tiene la estructura esperada.';
                    await modelChat.actualizar(idChat, "Endpoint IVR Fuga Alcantarillado - Respuesta inválida", chatData);
                    
                    const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>No pudimos registrar tu solicitud.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
                    await getArbolPrincipal().crearMensaje(
                        idChat,
                        remitente,
                        dataEstatica.configuracion.estadoMensaje.enviado,
                        dataEstatica.configuracion.tipoMensaje.texto,
                        mensajeError,
                        chatData.descripcion
                    );
                    
                    // Pasar a asesor
                    return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'No se pudo registrar mi solicitud', contextoArbol);
                }
        } else {
            // Se superó el límite de intentos
            chatData.descripcion = 'Se superó el límite de intentos para el endpoint IVR Fuga Alcantarillado.';
            await modelChat.actualizar(idChat, "Endpoint IVR Fuga Alcantarillado - Límite intentos", chatData);
            
            const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>Estamos presentando dificultades técnicas.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
            await getArbolPrincipal().crearMensaje(
                idChat,
                remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                mensajeError,
                chatData.descripcion
            );
            
            // Pasar a asesor
            return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'Necesito ayuda con mi servicio', contextoArbol);
        }
    } catch (error) {
        // INCREMENTAR CONTADOR solo si el error tiene un status HTTP diferente a 200
        // Si es una excepción de red u otro tipo, también incrementar porque no se pudo consumir el servicio
        const errorStatus = error.response?.status;
        if (errorStatus && errorStatus !== 200) {
            chatData.controlPeticionesIVRFugaAlcantarillado = (parseInt(chatData.controlPeticionesIVRFugaAlcantarillado) || 0) + 1;
            chatData.controlApiIVRFugaAlcantarillado = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error HTTP al consumir endpoint IVR Fuga Alcantarillado - Status: ${errorStatus} (intento ${chatData.controlPeticionesIVRFugaAlcantarillado}/6).`;
        } else {
            // Excepción de red u otro tipo - también incrementar porque no se pudo consumir
            chatData.controlPeticionesIVRFugaAlcantarillado = (parseInt(chatData.controlPeticionesIVRFugaAlcantarillado) || 0) + 1;
            chatData.controlApiIVRFugaAlcantarillado = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error al consumir endpoint IVR Fuga Alcantarillado - Excepción: ${error.message} (intento ${chatData.controlPeticionesIVRFugaAlcantarillado}/6).`;
        }
        
        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVRFugaAlcantarillado`,
            idChat,
            remitente,
            controlPeticionesIVRFugaAlcantarillado: chatData.controlPeticionesIVRFugaAlcantarillado,
            errorStatus: errorStatus || 'N/A',
            errorMensaje: error.message
        }, '❌ Error al consumir endpoint IVR Fuga Alcantarillado');
        
        await modelChat.actualizar(idChat, "Endpoint IVR Fuga Alcantarillado - Error", chatData);

        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVRFugaAlcantarillado`,
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            controlPeticionesIVRFugaAlcantarillado: chatData.controlPeticionesIVRFugaAlcantarillado
        }, 'Error en consumirEndpointIVRFugaAlcantarillado');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Endpoint IVR Fuga Alcantarillado';
        const errorResult = await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente, contextoArbol);
        
        // Si se superó el límite de intentos, pasar a asesor
        if (chatData.controlPeticionesIVRFugaAlcantarillado > 5) {
            const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>Estamos presentando dificultades técnicas.</b> 😖<br/><br/>
 
🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;
            await getArbolPrincipal().crearMensaje(
                idChat,
                remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                mensajeError,
                chatData.descripcion
            );
            return await procesarMensajeAISoulConAdjuntos(idChat, remitente, 'Necesito ayuda con mi servicio', contextoArbol);
        }
        
        return errorResult || false;
    }
};

// todo: Verificar y actualizar adjuntos antes de pasar a agente
const verificarYActualizarAdjuntos = async (idChat, chatData) => {
    try {
        // Obtener información actualizada del chat desde la BD
        const chatInfo = await modelChat.filtrar(idChat);
        if (chatInfo && chatInfo.length > 0) {
            const adjuntosBD = chatInfo[0].ADJUNTOS || '-';
            const rutaAdjuntosBD = chatInfo[0].RUTA_ADJUNTOS || '-';
            
            // Actualizar chatData con los valores de la BD
            chatData.adjuntos = (adjuntosBD === 'Si' && rutaAdjuntosBD && rutaAdjuntosBD !== '-') ? 'Si' : 'No';
            chatData.rutaAdjuntos = (chatData.adjuntos === 'Si') ? rutaAdjuntosBD : '-';
            
            logger.info({
                contexto: 'model',
                recurso: 'arbolControlServicio.verificarYActualizarAdjuntos',
                idChat,
                adjuntos: chatData.adjuntos,
                tieneRuta: chatData.rutaAdjuntos !== '-'
            }, `📎 Adjuntos verificados: ${chatData.adjuntos}`);
        } else {
            // Si no se encuentra el chat, establecer valores por defecto
            chatData.adjuntos = 'No';
            chatData.rutaAdjuntos = '-';
        }
    } catch (error) {
        logger.error({
            contexto: 'model',
            recurso: 'arbolControlServicio.verificarYActualizarAdjuntos',
            idChat,
            errorMensaje: error.message
        }, 'Error al verificar adjuntos, usando valores por defecto');
        // En caso de error, establecer valores por defecto
        chatData.adjuntos = 'No';
        chatData.rutaAdjuntos = '-';
    }
};

// todo: Wrapper simplificado para procesarMensajeAISoul (usa la misma lógica que otros árboles)
const procesarMensajeAISoulConAdjuntos = async (idChat, remitente, contenido, contextoArbol) => {
    try {
        const arbolPrincipal = getArbolPrincipal();

        // Delegar completamente en arbolPrincipal.procesarMensajeAISoul,
        // que ya se encarga de leer adjuntos actualizados desde la BD.
        return await arbolPrincipal.procesarMensajeAISoul(
            idChat,
            remitente,
            contenido,
            null,            // usar chatData global de arbolPrincipal
            contextoArbol
        );
    } catch (error) {
        logger.error({
            contexto: 'model',
            recurso: 'arbolControlServicio.procesarMensajeAISoulConAdjuntos',
            idChat,
            remitente,
            errorMensaje: error.message,
            errorStack: error.stack
        }, 'Error al pasar a agente desde Control Servicio');

        const api = 'Soul Chat';
        const procesoApi = 'Procesar Mensaje AI desde Control Servicio';
        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente, contextoArbol);
    }
};

// todo: Mostrar Submenu 
const mostrarSubmenu = async (idChat, remitente, submenuId, chatData, contextoArbol = 'arbolControlServicio') => {
    // Si el siguiente paso es pasar a agente (Interaccion AI Soul)
    if (submenuId === 'Interaccion AI Soul') {
        chatData.descripcion = 'Usuario completó inputs - Pasando a agente';
        
        // Verificar y actualizar adjuntos antes de pasar a agente
        await verificarYActualizarAdjuntos(idChat, chatData);
        
        // Crear mensaje de tipo Paso Agente antes de pasar a agente
        await getArbolPrincipal().crearMensaje(
            idChat, remitente,
            dataEstatica.configuracion.estadoMensaje.enviado,
            dataEstatica.configuracion.tipoMensaje.pasoAgente,
            // Usar el mensaje asesor genérico definido en dataEstatica
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
                recurso: 'arbolControlServicio.mostrarSubmenu',
                idChat,
                remitente,
                mensajeContextoIA: mensajeContexto
            }, '✅ Usando mensajeContextoIA guardado para solicitud dinámica del cliente');
            
            // Limpiar el mensajeContextoIA pendiente después de usarlo
            chatData.mensajeContextoIAPendiente = '-';
        } else {
            // Fallback: construir mensaje genérico según datos ingresados
            mensajeContexto = 'He reportado un problema con el servicio. ';
            if (chatData.nombresApellidos && chatData.nombresApellidos !== '-') {
                mensajeContexto += `Mis datos son: ${chatData.nombresApellidos}. `;
            }
            if (chatData.direccion && chatData.direccion !== '-') {
                mensajeContexto += `Dirección: ${chatData.direccion}. `;
            }
            if (chatData.descripcionProblema && chatData.descripcionProblema !== '-') {
                mensajeContexto += `Descripción del problema: ${chatData.descripcionProblema}.`;
            }
        }
        
        return await procesarMensajeAISoulConAdjuntos(
            idChat,
            remitente,
            mensajeContexto,
            contextoArbol
        );
    }

    const submenu = SUBMENUS_CONFIG[submenuId];

    if (!submenu) {
        logger.warn({
            contexto: 'model', recurso: 'arbolControlServicio.mostrarSubmenu',
            submenuId, idChat, remitente
        }, `Submenú no encontrado: ${submenuId}`);
        return false;
    }

    // Si es tipo endpoint, procesar el endpoint
    if (submenu.tipo === 'endpoint') {
        // Verificar si ya se procesó exitosamente este endpoint (evitar duplicados)
        // Si ya hay un numeroReporte, significa que ya se procesó exitosamente
        if (chatData.numeroReporte && chatData.numeroReporte !== '-') {
            logger.warn({
                contexto: 'model',
                recurso: 'arbolControlServicio.mostrarSubmenu',
                idChat,
                remitente,
                submenuId,
                numeroReporte: chatData.numeroReporte
            }, '⚠️ Endpoint ya fue procesado exitosamente, evitando duplicado');
            // Si hay avance automático, continuar sin procesar de nuevo
            if (submenu.avanceAutomatico) {
                return await mostrarSubmenu(idChat, remitente, submenu.avanceAutomatico, chatData, contextoArbol);
            }
            return true; // Ya se procesó, no hacer nada
        }
        
        // Determinar qué endpoint consumir según el submenuId
        let resultadoEndpoint = false;
        
        if (submenuId === 'endpoint_info_cliente_sin_agua') {
            resultadoEndpoint = await consumirEndpointInfoCliente(idChat, remitente, chatData, contextoArbol);
        } else if (submenuId === 'endpoint_ivr_sin_agua') {
            resultadoEndpoint = await consumirEndpointIVRSinAgua(idChat, remitente, chatData, contextoArbol);
        } else if (submenuId === 'endpoint_info_cliente_baja_presion') {
            // TODO: Implementar para baja presión cuando sea necesario
            resultadoEndpoint = await consumirEndpointInfoCliente(idChat, remitente, chatData, contextoArbol);
        } else if (submenuId === 'endpoint_ivr_baja_presion') {
            resultadoEndpoint = await consumirEndpointIVRBajaPresion(idChat, remitente, chatData, contextoArbol);
        } else if (submenuId === 'endpoint_info_cliente_fuga_agua') {
            // TODO: Implementar para fuga agua cuando sea necesario
            resultadoEndpoint = await consumirEndpointInfoCliente(idChat, remitente, chatData, contextoArbol);
        } else if (submenuId === 'endpoint_ivr_fuga_agua') {
            resultadoEndpoint = await consumirEndpointIVRFugaAgua(idChat, remitente, chatData, contextoArbol);
        } else if (submenuId === 'endpoint_info_cliente_fuga_alcantarillado') {
            // TODO: Implementar para fuga alcantarillado cuando sea necesario
            resultadoEndpoint = await consumirEndpointInfoCliente(idChat, remitente, chatData, contextoArbol);
        } else if (submenuId === 'endpoint_ivr_fuga_alcantarillado') {
            resultadoEndpoint = await consumirEndpointIVRFugaAlcantarillado(idChat, remitente, chatData, contextoArbol);
        }

        // Si el endpoint fue exitoso y hay avance automático, continuar
        if (resultadoEndpoint && submenu.avanceAutomatico) {
            return await mostrarSubmenu(idChat, remitente, submenu.avanceAutomatico, chatData, contextoArbol);
        }
        
        // Si el endpoint falló y pasó a asesor, no continuar
        if (!resultadoEndpoint) {
            return false;
        }
        
        return true;
    }

    // Actualizar descripción primero
    chatData.descripcion = submenu.descripcion;
    
    // No mostrar mensaje aquí si es input_multiple, lo mostrará solicitarInputUsuario
    if (!(submenu.tipo === 'input_multiple' && submenu.inputKey && submenu.inputKey.length > 0)) {
        // Mostrar mensaje solo si existe
        if (submenu.mensaje) {
            // Si es mensaje_asesor, usar tipo Paso Agente
            const tipoMensaje = (submenuId === 'mensaje_asesor') 
                ? dataEstatica.configuracion.tipoMensaje.pasoAgente 
                : dataEstatica.configuracion.tipoMensaje.texto;
            
            await getArbolPrincipal().crearMensaje(
                idChat, remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                tipoMensaje,
                submenu.mensaje,
                chatData.descripcion
            );
        }
    }
    
    // Actualizar estado del chat según el tipo de submenu DESPUÉS de mostrar el mensaje
    // Esto es crítico para que cuando el usuario responda, el código procese la respuesta
    if (submenu.tipo === 'mensaje_estatico' && !submenu.opciones) {
        await modelChat.actualizar(idChat, `${submenu.pasoArbol}_esperando_continuar`, chatData);
    } else {
        // Para submenús con opciones, actualizar con el pasoArbol para que se procese la respuesta
        logger.info({
            contexto: 'model',
            recurso: 'arbolControlServicio.mostrarSubmenu',
            idChat,
            remitente,
            submenuId,
            pasoArbol: submenu.pasoArbol,
            tieneOpciones: !!submenu.opciones
        }, `🔄 Actualizando estado del chat a: ${submenu.pasoArbol}`);
        await modelChat.actualizar(idChat, submenu.pasoArbol, chatData);
    }

    if (submenu.tipo === 'input_multiple' && submenu.inputKey && submenu.inputKey.length > 0) {
        logger.info({
            contexto: 'model',
            recurso: 'arbolControlServicio.mostrarSubmenu',
            submenuActual: submenuId,
            inputsRequeridos: submenu.inputKey
        }, '⚡ Iniciando secuencia de inputs automáticamente');

        // Guardar la secuencia completa y el destino final
        chatData.inputsSecuencia = JSON.stringify(submenu.inputKey);
        chatData.submenuPendiente = submenu.siguiente;

        // Guardar mensaje personalizado para usarlo en reintentos por validación
        chatData.mensajePersonalizadoEnCurso = submenu.mensaje || '-';

        // Indicar si es una secuencia de múltiples inputs
        chatData.esSecuenciaMultiple = submenu.inputKey.length > 1 ? 'true' : 'false';

        // Solicitar el primer input de la secuencia
        return await solicitarInputUsuario(
            idChat,
            remitente,
            submenu.inputKey[0],
            submenu.siguiente,
            chatData,
            'arbolControlServicio',
            submenu.mensaje
        );
    }


    // ===== CERRAR CHAT =====
    // Si el submenu tiene siguiente: 'cerrar_chat', cerrar el chat con despedida
    if (submenu.siguiente === 'cerrar_chat') {
        return await cerrarChatConDespedida(idChat, remitente, chatData, contextoArbol);
    }

    // ===== AVANCE AUTOMÁTICO =====
    if (submenu.avanceAutomatico) {
        logger.info({
            contexto: 'model',
            recurso: 'arbolControlServicio.mostrarSubmenu',
            submenuActual: submenuId,
            siguienteAutomatico: submenu.avanceAutomatico
        }, '⚡ Avance automático detectado');

        // Si el avance automático es cerrar_chat, cerrar el chat
        if (submenu.avanceAutomatico === 'cerrar_chat') {
            return await cerrarChatConDespedida(idChat, remitente, chatData, contextoArbol);
        }

        return await mostrarSubmenu(idChat, remitente, submenu.avanceAutomatico, chatData, contextoArbol);
    }

    return true;
};




// todo: Procesar Respuesta Submenú
const procesarRespuestaSubmenu = async (idChat, remitente, contenido, chatData, submenuId, contextoArbol) => {
    try {
        const contenidoNormalized = String(contenido).trim();
        logger.info({
            contexto: 'model',
            recurso: 'arbolControlServicio.procesarRespuestaSubmenu',
            idChat,
            remitente,
            contenido,
            contenidoNormalized,
            submenuId
        }, '🔄 Iniciando procesamiento de respuesta de submenu');
        
        const submenu = SUBMENUS_CONFIG[submenuId];

        if (!submenu) {
            logger.warn({
                contexto: 'model', recurso: 'arbolControlServicio.procesarRespuestaSubmenu',
                submenuId
            }, `Submenú no encontrado: ${submenuId}`);
            return false;
        }


        // Si el submenú NO tiene opciones (es un mensaje_estatico sin interacción), volver al menú principal
        if (!submenu.opciones) {
            logger.info({
                contexto: 'model',
                recurso: 'arbolControlServicio.procesarRespuestaSubmenu',
                submenuId
            }, 'Submenú sin opciones - Regresando al menú principal');
            return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
        }


        // Obtener la opción seleccionada
        const opcion = submenu.opciones[contenidoNormalized];

        if (opcion) {
            logger.info({
                contexto: 'model',
                recurso: 'arbolControlServicio.procesarRespuestaSubmenu',
                idChat,
                remitente,
                contenidoNormalized,
                submenuId,
                opcionTipo: opcion.tipo,
                opcionSiguiente: opcion.siguiente
            }, `✅ Opción ${contenidoNormalized} encontrada, tipo: ${opcion.tipo}`);

            // TIPO: ENDPOINT (Consumir endpoint y continuar)
            if (opcion.tipo === 'endpoint') {
                chatData.descripcion = opcion.descripcion || `Usuario seleccionó opción ${contenidoNormalized}`;
                
                // ACTUALIZAR ESTADO DEL CHAT INMEDIATAMENTE para evitar procesamiento duplicado
                // Esto previene que si el usuario envía la misma respuesta dos veces, solo se procese una vez
                const pasoArbolEndpoint = `Procesando Endpoint - ${opcion.siguiente}`;
                await modelChat.actualizar(idChat, pasoArbolEndpoint, chatData);
                
                logger.info({
                    contexto: 'model',
                    recurso: 'arbolControlServicio.procesarRespuestaSubmenu',
                    idChat,
                    remitente,
                    siguiente: opcion.siguiente,
                    pasoArbolActualizado: pasoArbolEndpoint
                }, `🔄 Avanzando a endpoint: ${opcion.siguiente} - Estado actualizado para prevenir duplicados`);
                
                // Ir al siguiente paso que es el endpoint
                if (opcion.siguiente) {
                    return await mostrarSubmenu(idChat, remitente, opcion.siguiente, chatData, contextoArbol);
                }
                return true;
            }

            // TIPO: INPUT_MULTIPLE (Secuencia de inputs)
            if (opcion.tipo === 'input_multiple') {
                chatData.descripcion = opcion.descripcion || `Usuario seleccionó opción ${contenidoNormalized}`;
                chatData.inputsSecuencia = JSON.stringify(opcion.inputKey);
                chatData.submenuPendiente = opcion.siguiente;
                chatData.mensajePersonalizadoEnCurso = opcion.mensaje || '-';
                chatData.esSecuenciaMultiple = opcion.inputKey.length > 1 ? 'true' : 'false';

                
                // LUEGO solicitar el primer input
                return await solicitarInputUsuario(
                    idChat, remitente,
                    opcion.inputKey[0],
                    opcion.siguiente,
                    chatData,
                    contextoArbol,
                    opcion.mensaje
                );
            }

            // TIPO: AVANZAR (Mostrar mensaje y continuar)
            if (opcion.tipo === 'avanzar') {
                chatData.descripcion = `Usuario seleccionó opción ${contenidoNormalized}`;

                // Mostrar mensaje de avance
                await getArbolPrincipal().crearMensaje(
                    idChat, remitente,
                    dataEstatica.configuracion.estadoMensaje.enviado,
                    dataEstatica.configuracion.tipoMensaje.texto,
                    opcion.mensajeAvance,
                    chatData.descripcion
                );

                // Ir al siguiente paso
                if (opcion.siguiente === 'menu_principal') {
                    return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
                } else {
                    return await mostrarSubmenu(idChat, remitente, opcion.siguiente, chatData, contextoArbol);
                }
            }

            // TIPO: MENSAJE_ESTATICO (Mostrar y volver al menú principal)
            if (opcion.tipo === 'mensaje_estatico') {
                return await getArbolPrincipal().mostrarMensajeEstatico(
                    idChat, remitente,
                    `Procesar Submenu ControlServicio ${submenuId}_mensaje_estatico`,
                    `Usuario seleccionó opción ${contenidoNormalized}`,
                    opcion.mensaje,
                    chatData
                );
            }

            // TIPO: SIMPLE (Solo ir al siguiente submenu)
            if (opcion.siguiente) {
                if (opcion.siguiente === 'menu_principal') {
                    return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
                }
                return await mostrarSubmenu(idChat, remitente, opcion.siguiente, chatData, contextoArbol);
            }

            return true;
        }

        // Permitir REGRESAR en submenús (case-insensitive)
        if (contenidoNormalized.toUpperCase() === 'REGRESAR') {
            chatData.descripcion = 'Usuario escribió REGRESAR en submenu';
            return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
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




const solicitarInputUsuario = async (idChat, remitente, campoKey, submenuSiguiente, chatData, contextoArbol, mensajePersonalizado = null) => {
    try {
        // Obtener configuración desde dataEstatica usando la KEY
        const inputConfig = dataEstatica.inputsConfig[campoKey];

        if (!inputConfig) {
            throw new Error(`Configuración de input no encontrada para: ${campoKey}`);
        }

        const pasoArbol = `Solicitar Input Control Servicio ${inputConfig.campo}`;
        chatData.descripcion = `Solicitando: ${inputConfig.campo}`;
        chatData.mensajePersonalizadoEnCurso = mensajePersonalizado || '-';

        // Guardar contexto en campos dedicados 
        chatData.inputEnCurso = inputConfig.campo;
        chatData.submenuPendiente = submenuSiguiente || inputConfig.submenuSiguiente || '-';

        await modelChat.actualizar(idChat, pasoArbol, chatData);

        // Usar SOLO un mensaje:
        // - Si viene mensajePersonalizado (por ejemplo, numeroPolizaControlServicio), se envía ese.
        // - Si no viene personalizado, se usa la cabecera del input.
        const mensajeFinal = (mensajePersonalizado && mensajePersonalizado !== '-')
            ? mensajePersonalizado
            : `<p class="inputUsuarioArbol">${inputConfig.cabecera}</p>`;

        return await getArbolPrincipal().crearMensaje(
            idChat,
            remitente,
            dataEstatica.configuracion.estadoMensaje.enviado,
            dataEstatica.configuracion.tipoMensaje.texto,
            mensajeFinal,
            chatData.descripcion
        );

        return true;
    } catch (error) {
        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.solicitarInputUsuario`,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            campoKey
        }, 'Error en solicitarInputUsuario');

        const api = 'Chat Web Triple A';
        const procesoApi = `Solicitar Input Control Servicio - ${inputConfig.campo}`;
        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente);
    }
};

const procesarInputUsuario = async (idChat, remitente, contenido, chatData, contextoArbol) => {
    return await getArbolPrincipal().procesarInputUsuario(
        idChat,
        remitente,
        contenido,
        chatData,
        contextoArbol,
        solicitarInputUsuario,
        mostrarSubmenu
    );
};

// todo: Cerrar Chat con Despedida
const cerrarChatConDespedida = async (idChat, remitente, chatData, contextoArbol) => {
    try {
        const pasoArbol = dataEstatica.arbol.despedida;
        chatData.descripcion = 'Usuario seleccionó cerrar chat - Se procede a cerrar el chat con mensaje de despedida.';

        // Actualizar el chat antes de cerrar
        await modelChat.actualizar(idChat, pasoArbol, chatData);

        // Cerrar el chat
        await modelChat.cerrar(
            remitente,
            dataEstatica.configuracion.estadoChat.recibido,
            dataEstatica.configuracion.estadoGestion.cerrado,
            dataEstatica.arbol.despedida,
            dataEstatica.configuracion.controlApi.success,
            chatData.descripcion,
            dataEstatica.configuracion.estadoRegistro.activo,
            dataEstatica.configuracion.responsable
        );

        // Enviar mensaje de despedida
        chatData.descripcion = 'Se envía mensaje de despedida.';
        return await getArbolPrincipal().crearMensaje(
            idChat,
            remitente,
            dataEstatica.configuracion.estadoMensaje.enviado,
            dataEstatica.configuracion.tipoMensaje.finChat,
            dataEstatica.mensajes.despedida,
            chatData.descripcion
        );
    } catch (error) {
        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.cerrarChatConDespedida`,
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente
        }, 'Error en cerrarChatConDespedida');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Cerrar Chat con Despedida';
        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente);
    }
};

// ! EXPORTACIONES
module.exports = {
    arbolControlServicio,
    solicitarMenuArbolControlServicio,
    procesarMenuArbolControlServicio,
};