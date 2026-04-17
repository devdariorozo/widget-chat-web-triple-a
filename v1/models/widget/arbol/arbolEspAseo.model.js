// ! ================================================================================================================================================
// !                                                      MODELOS PARA ARBOL CHAT BOT - RECOLECCION ESPECIAL ASEO
// ! ================================================================================================================================================
// @autor Ramón Dario Rozo Torres
// @última­Modificación Ramón Dario Rozo Torres
// @versión 1.0.0
// v1/models/widget/arbol/arbolEspAseo.model.js

// ! REQUIRES
require('dotenv').config({ path: './../../../.env' });
const modelChat = require('../chat.model.js');
const dataEstatica = require('../../../seeds/dataEstatica.js');
const serviceSoulChat = require('../../../services/serviceSoulChat.service.js');
const serviceTripleA = require('../../../services/serviceTripleA.service.js');
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

    // ===== ESCOMBROS =====
    escombros: {
        pasoArbol: "Procesar Submenu Esp Aseo escombros",
        descripcion: 'Usuario en: Escombros',
        mensaje: dataEstatica.mensajes.escombros,
        opciones: {
            '1': {
                tipo: 'input_multiple',
                descripcion: 'Usuario de acuerdo - Ingreso número póliza',
                inputKey: ['numeroPoliza'],
                siguiente: 'endpoint_info_cliente_ivr_escombros'
            }
        }
    },

    // ===== ENDPOINT INFO CLIENTE IVR ESCOMBROS =====
    endpoint_info_cliente_ivr_escombros: {
        pasoArbol: "Procesar Submenu Esp Aseo endpoint_info_cliente_ivr_escombros",
        descripcion: 'Usuario en: Endpoint información cliente IVR escombros',
        tipo: 'endpoint',
        // TODO: ESPACIO PARA ENDPOINT - Información Cliente IVR
        avanceAutomatico: 'confirmar_informacion_escombros'
    },

    // ===== CONFIRMAR INFORMACIÓN ESCOMBROS =====
    confirmar_informacion_escombros: {
        pasoArbol: "Procesar Submenu Esp Aseo confirmar_informacion_escombros",
        descripcion: 'Usuario en: Confirmar información escombros',
        mensaje: dataEstatica.mensajes.confirmarInformacion,
        opciones: {
            '1': {
                tipo: 'endpoint',
                descripcion: 'Usuario confirma - Procesar IVR escombros',
                siguiente: 'endpoint_ivr_escombros'
            },
            '2': {
                tipo: 'input_multiple',
                descripcion: 'Usuario corrige - Volver a ingresar póliza',
                inputKey: ['numeroPoliza'],
                mensaje: dataEstatica.mensajes.ingresoNumeroPoliza,
                siguiente: 'endpoint_info_cliente_ivr_escombros'
            }
        }
    },

    // ===== ENDPOINT IVR ESCOMBROS =====
    endpoint_ivr_escombros: {
        pasoArbol: "Procesar Submenu Esp Aseo endpoint_ivr_escombros",
        descripcion: 'Usuario en: Endpoint IVR escombros',
        tipo: 'endpoint',
        // TODO: ESPACIO PARA ENDPOINT - IVR Recolección Escombros
        avanceAutomatico: 'fin_ivr_solicitudes'
    },

    // ===== RECOLECCIÓN PODAS =====
    recoleccion_podas: {
        pasoArbol: "Procesar Submenu Esp Aseo recoleccion_podas",
        descripcion: 'Usuario en: Recolección podas',
        mensaje: dataEstatica.mensajes.recolecciónPodas,
        opciones: {
            '1': {
                tipo: 'input_multiple',
                descripcion: 'Usuario de acuerdo - Ingreso número póliza',
                inputKey: ['numeroPoliza'],
                siguiente: 'endpoint_info_cliente_ivr_podas'
            }
        }
    },

    // ===== ENDPOINT INFO CLIENTE IVR PODAS =====
    endpoint_info_cliente_ivr_podas: {
        pasoArbol: "Procesar Submenu Esp Aseo endpoint_info_cliente_ivr_podas",
        descripcion: 'Usuario en: Endpoint información cliente IVR podas',
        tipo: 'endpoint',
        // TODO: ESPACIO PARA ENDPOINT - Información Cliente IVR
        avanceAutomatico: 'confirmar_informacion_podas'
    },

    // ===== CONFIRMAR INFORMACIÓN PODAS =====
    confirmar_informacion_podas: {
        pasoArbol: "Procesar Submenu Esp Aseo confirmar_informacion_podas",
        descripcion: 'Usuario en: Confirmar información podas',
        mensaje: dataEstatica.mensajes.confirmarInformacion,
        opciones: {
            '1': {
                tipo: 'endpoint',
                descripcion: 'Usuario confirma - Procesar IVR podas',
                siguiente: 'endpoint_ivr_podas'
            },
            '2': {
                tipo: 'input_multiple',
                descripcion: 'Usuario corrige - Volver a ingresar póliza',
                inputKey: ['numeroPoliza'],
                mensaje: dataEstatica.mensajes.ingresoNumeroPoliza,
                siguiente: 'endpoint_info_cliente_ivr_podas'
            }
        }
    },

    // ===== ENDPOINT IVR PODAS =====
    endpoint_ivr_podas: {
        pasoArbol: "Procesar Submenu Esp Aseo endpoint_ivr_podas",
        descripcion: 'Usuario en: Endpoint IVR podas',
        tipo: 'endpoint',
        // TODO: ESPACIO PARA ENDPOINT - IVR Recolección Podas
        avanceAutomatico: 'fin_ivr_solicitudes'
    },

    // ===== RECOLECCIÓN TRONCOS =====
    recoleccion_troncos: {
        pasoArbol: "Procesar Submenu Esp Aseo recoleccion_troncos",
        descripcion: 'Usuario en: Recolección troncos',
        mensaje: dataEstatica.mensajes.recolecciónTroncos,
        opciones: {
            '1': {
                tipo: 'input_multiple',
                descripcion: 'Usuario de acuerdo - Ingreso número póliza',
                inputKey: ['numeroPoliza'],
                siguiente: 'endpoint_info_cliente_ivr_troncos'
            }
        }
    },

    // ===== ENDPOINT INFO CLIENTE IVR TRONCOS =====
    endpoint_info_cliente_ivr_troncos: {
        pasoArbol: "Procesar Submenu Esp Aseo endpoint_info_cliente_ivr_troncos",
        descripcion: 'Usuario en: Endpoint información cliente IVR troncos',
        tipo: 'endpoint',
        // TODO: ESPACIO PARA ENDPOINT - Información Cliente IVR
        avanceAutomatico: 'confirmar_informacion_troncos'
    },

    // ===== CONFIRMAR INFORMACIÓN TRONCOS =====
    confirmar_informacion_troncos: {
        pasoArbol: "Procesar Submenu Esp Aseo confirmar_informacion_troncos",
        descripcion: 'Usuario en: Confirmar información troncos',
        mensaje: dataEstatica.mensajes.confirmarInformacion,
        opciones: {
            '1': {
                tipo: 'endpoint',
                descripcion: 'Usuario confirma - Procesar IVR troncos',
                siguiente: 'endpoint_ivr_troncos'
            },
            '2': {
                tipo: 'input_multiple',
                descripcion: 'Usuario corrige - Volver a ingresar póliza',
                inputKey: ['numeroPoliza'],
                mensaje: dataEstatica.mensajes.ingresoNumeroPoliza,
                siguiente: 'endpoint_info_cliente_ivr_troncos'
            }
        }
    },

    // ===== ENDPOINT IVR TRONCOS =====
    endpoint_ivr_troncos: {
        pasoArbol: "Procesar Submenu Esp Aseo endpoint_ivr_troncos",
        descripcion: 'Usuario en: Endpoint IVR troncos',
        tipo: 'endpoint',
        // TODO: ESPACIO PARA ENDPOINT - IVR Recolección Troncos
        avanceAutomatico: 'fin_ivr_solicitudes'
    },

    // ===== OTROS RESIDUOS ESPECIALES =====
    otros_residuos_especiales: {
        pasoArbol: "Procesar Submenu Esp Aseo otros_residuos_especiales",
        descripcion: 'Usuario en: Otros residuos especiales',
        tipo: 'input_multiple',
        inputKey: ['nombresApellidos', 'numeroPoliza'],
        mensaje: dataEstatica.mensajes.otrosResiduosEspeciales,
        siguiente: 'mensaje_asesor',
        mensajeContextoIA:'El Usuario ha solicitado un asesor para Otros residuos especiales'

    },

    // ===== FIN IVR SOLICITUDES =====
    fin_ivr_solicitudes: {
        tipo: 'avanzar',
        pasoArbol: "Procesar Submenu Esp Aseo fin_ivr_solicitudes",
        descripcion: 'Usuario en: Fin IVR solicitudes',
        mensajeAvance: dataEstatica.mensajes.finIVRSolicitudes,
        siguiente: 'cerrar_chat'
    },

    // ===== MENSAJE ASESOR =====
    mensaje_asesor: {
        tipo: 'pasar_agente',
        pasoArbol: "Procesar Submenu Esp Aseo mensaje_asesor",
        descripcion: 'Usuario en: Mensaje asesor recolección especial aseo',
        mensaje: dataEstatica.mensajes.mensajeAsesor,
    },
}


// ! MODELOS
// * ARBOL CHAT BOT - Recolección Especial Aseo
const arbolEspAseo = async (idChat, remitente, arbolChat, contenido, chatData, contextoArbol = 'arbolEspAseo') => {

    try {

        // todo: Primera vez que entra al árbol
        if (arbolChat === "Solicitar Arbol Esp Aseo") {
            return await solicitarMenuarbolEspAseo(idChat, remitente, chatData, contextoArbol)
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
            arbolChat === "Solicitar Menu Arbol Esp Aseo" ||
            arbolChat === dataEstatica.arbol.alertaNoEntiendo
        ) {
            return await procesarMenuarbolEspAseo(idChat, remitente, contenido, chatData, contextoArbol)
        }

        // todo: Manejo de errores en submenús
        if (arbolChat.startsWith("Alerta No Entiendo - Submenu Esp Aseo ")) {
            const submenuId = arbolChat.replace("Alerta No Entiendo - Submenu Esp Aseo ", "")
            return await procesarRespuestaSubmenu(
                idChat, remitente, contenido, chatData, submenuId, contextoArbol
            )
        }

        // todo: Procesando respuesta de submenú
        if (arbolChat.startsWith("Procesar Submenu Esp Aseo ")) {
            const submenuId = arbolChat.replace("Procesar Submenu Esp Aseo ", "")
            return await procesarRespuestaSubmenu(idChat, remitente, contenido, chatData, submenuId, contextoArbol)
        }

        // todo: Procesando input del usuario
        if (arbolChat.startsWith("Solicitar Input Esp Aseo ")) {
            return await procesarInputUsuario(idChat, remitente, contenido, chatData, contextoArbol)
        }

        // todo: Interacción con IA
        if (arbolChat === "Interaccion AI Soul" || arbolChat === dataEstatica.arbol.alertaNoEntiendo) {
            return await getArbolPrincipal().procesarMensajeAISoul(
                idChat,
                remitente,
                contenido,
                chatData,
                contextoArbol
            );
        }

        logger.warn(
            {
                contexto: "model",
                recurso: "arbolEspAseo.arbolEspAseo",
                arbolChat,
                idChat,
                remitente,
            },
            "No se encontró condición válida para arbolChat en Esp Aseo",
        )
        return true;
    } catch (error) {
        const api = 'Chat Web Triple A ';
        const procesoApi = 'Arbol Esp Aseo';
        logger.error({
            contexto: 'model',
            recurso: 'arbolEspAseo.arbolEspAseo',
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            api,
            procesoApi
        }, 'Error en v1/models/widget/arbol/arbolEspAseo.model.js → arbolEspAseo');
        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente, contextoArbol);
    }
};



// todo: Solicitar Menu Arbol Esp Aseo
const solicitarMenuarbolEspAseo = async (idChat, remitente, chatData) => {
    const solicitarMenuarbolEspAseo = "Solicitar Menu Arbol Esp Aseo"
    chatData.descripcion = 'Se solicita el menu de Recolección Especial Aseo.'

    await modelChat.actualizar(idChat, solicitarMenuarbolEspAseo, chatData)

    return await getArbolPrincipal().crearMensaje(
        idChat,
        remitente,
        dataEstatica.configuracion.estadoMensaje.enviado,
        dataEstatica.configuracion.tipoMensaje.texto,
        dataEstatica.mensajes.solicitarMenuArbolEspAseo,
        chatData.descripcion,
    )
}

// todo: Procesar Menu Arbol Esp Aseo
const procesarMenuarbolEspAseo = async (idChat, remitente, contenido, chatData) => {
    try {
        const contenidoNormalized = String(contenido).trim();

        const menuOpciones = {
            '1': 'escombros',
            '2': 'recoleccion_podas',
            '3': 'recoleccion_troncos',
            '4': 'otros_residuos_especiales',
        };

        // Si es una opción válida del menú
        if (menuOpciones[contenidoNormalized]) {
            return await mostrarSubmenu(idChat, remitente, menuOpciones[contenidoNormalized], chatData);
        }

        // Opción no válida
        const resultado = await getArbolPrincipal().manejarNoEntiendo(
            idChat, remitente,
            "Alerta No Entiendo - Solicitar Menu Arbol Esp Aseo",
            dataEstatica.mensajes.alertaNoEntiendo
        );

        if (resultado) {
            return await solicitarMenuarbolEspAseo(idChat, remitente, chatData);
        }
        return false;

    } catch (error) {
        logger.error({
            contexto: 'model', recurso: 'arbolEspAseo.procesarMenuarbolEspAseo',
            errorMensaje: error.message, errorStack: error.stack, idChat, remitente
        },
            'Error en procesarMenuarbolEspAseo');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Procesar Menu Esp Aseo';
        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente);
    }
};


// todo: Consumir Endpoint Información Cliente IVR
const consumirEndpointInfoCliente = async (idChat, remitente, chatData, contextoArbol = 'arbolEspAseo') => {
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
                
                // Pasar a asesor (no continuar flujo del árbol)
                await getArbolPrincipal().procesarMensajeAISoul(
                    idChat,
                    remitente,
                    'Necesito ayuda con mi servicio',
                    chatData,
                    contextoArbol
                );
                return false;
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
            
            // Pasar a asesor (no continuar flujo del árbol)
            await getArbolPrincipal().procesarMensajeAISoul(
                idChat,
                remitente,
                'Necesito ayuda con mi servicio',
                chatData,
                contextoArbol
            );
            return false;
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
        
            // Si se superó el límite de intentos, pasar a asesor (sin continuar flujo)
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
                await getArbolPrincipal().procesarMensajeAISoul(
                    idChat,
                    remitente,
                    'Necesito ayuda con mi servicio',
                    chatData,
                    contextoArbol
                );
                return false;
            }
        
        return errorResult || false;
    }
};




// todo: Consumir Endpoint IVR Escombros
const consumirEndpointIVREscombros = async (idChat, remitente, chatData, contextoArbol = 'arbolEspAseo') => {
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
                tpd_codigo: '31',
                tpq_codigo: '08',
                tel_ivr: '1'
            };

            // Consumir servicio de Triple A
            const response = await serviceTripleA.procesarConsultaTripleA(estructuraMensaje);
            
            // SOLO incrementar contador si el servicio devuelve status diferente a 200
            if (response.status !== 200) {
                chatData.controlPeticionesIVRFugaAgua = (parseInt(chatData.controlPeticionesIVRFugaAgua) || 0) + 1;
                chatData.controlApiIVRFugaAgua = dataEstatica.configuracion.controlApi.error;
                chatData.descripcion = `Endpoint IVR Escombros presentó error HTTP status ${response.status} (intento ${chatData.controlPeticionesIVRFugaAgua}/6).`;
                
                logger.warn({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointIVREscombros`,
                    idChat,
                    remitente,
                    controlPeticionesIVRFugaAgua: chatData.controlPeticionesIVRFugaAgua,
                    status: response.status
                }, `⚠️ Error HTTP en Endpoint IVR Escombros - Status: ${response.status}`);
                
                await modelChat.actualizar(idChat, "Endpoint IVR Escombros - Error HTTP", chatData);

                const api = 'Chat Web Triple A';
                const procesoApi = 'Endpoint IVR Escombros';
                return await getArbolPrincipal().errorAPI(api, procesoApi, response, idChat, remitente, contextoArbol);
            }

            // Si la respuesta tiene status 200, procesar la respuesta sin marcar errores
            // Serializar resultadoApiIVRFugaAgua antes de guardarlo en la base de datos
            chatData.resultadoApiIVRFugaAgua = typeof response.data === 'object' ? JSON.stringify(response.data) : response.data;
            chatData.controlApiIVRFugaAgua = dataEstatica.configuracion.controlApi.success;
            chatData.controlPeticionesIVRFugaAgua = 0; // Resetear contador en caso de éxito HTTP 200
            chatData.descripcion = 'Endpoint IVR Escombros ejecutado exitosamente.';

                // Verificar si la respuesta es efectiva pero errónea
                if (response.data && response.data.results && response.data.results[0]) {
                    const resultado = response.data.results[0];
                    const msgsis = resultado.msgsis || '';
                    
                    logger.info({
                        contexto: 'model',
                        recurso: `${contextoArbol}.consumirEndpointIVREscombros`,
                        idChat,
                        remitente,
                        resultado: resultado,
                        tieneCodigo: !!resultado.codigo,
                        codigo: resultado.codigo
                    }, '📋 Procesando resultado del Endpoint IVR Escombros');
                    
                    // Validar respuesta efectiva pero errónea
                    if (msgsis.includes('NO SE PUDO REALIZAR')) {
                        // Respuesta errónea, pasar a asesor
                        chatData.descripcion = 'La solicitud no pudo ser realizada según respuesta del endpoint.';
                        await modelChat.actualizar(idChat, "Endpoint IVR Escombros - Solicitud no realizada", chatData);
                        
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
                        
                        // Pasar a asesor (no continuar flujo del árbol)
                        await getArbolPrincipal().procesarMensajeAISoul(
                            idChat,
                            remitente,
                            'No se pudo registrar mi solicitud',
                            chatData,
                            contextoArbol
                        );
                        return false;
                    } else if (msgsis.includes('USUARIO YA TIENE REGISTRADA UNA SOLICITUD')) {
                        // Usuario ya tiene una solicitud registrada - Caso válido
                        chatData.descripcion = 'Usuario ya tiene una solicitud registrada en el sistema.';
                        await modelChat.actualizar(idChat, "Endpoint IVR Escombros - Solicitud ya registrada", chatData);
                        
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
                        
                        // Pasar a asesor para seguimiento (no continuar flujo del árbol)
                        await getArbolPrincipal().procesarMensajeAISoul(
                            idChat,
                            remitente,
                            'Necesito información sobre mi solicitud registrada',
                            chatData,
                            contextoArbol
                        );
                        return false;
                    } else {
                        // Solicitud exitosa - El código siempre debe estar presente en respuestas exitosas
                        if (!resultado.codigo || resultado.codigo.trim() === '') {
                            logger.error({
                                contexto: 'model',
                                recurso: `${contextoArbol}.consumirEndpointIVREscombros`,
                                idChat,
                                remitente,
                                resultado: resultado
                            }, '❌ Respuesta exitosa pero sin código de reporte');
                            
                            chatData.descripcion = 'La respuesta del endpoint no contiene código de reporte.';
                            await modelChat.actualizar(idChat, "Endpoint IVR Escombros - Sin código", chatData);
                            
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
                            
                            await getArbolPrincipal().procesarMensajeAISoul(
                                idChat,
                                remitente,
                                'No se obtuvo número de reporte',
                                chatData,
                                contextoArbol
                            );
                            return false;
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
                        await modelChat.actualizar(idChat, "Endpoint IVR Escombros - Éxito", chatData);
                        return true;
                    }
                } else {
                    // Respuesta sin estructura esperada
                    chatData.descripcion = 'La respuesta del endpoint no tiene la estructura esperada.';
                    await modelChat.actualizar(idChat, "Endpoint IVR Escombros - Respuesta inválida", chatData);
                    
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
                    
                    // Pasar a asesor (no continuar flujo del árbol)
                    await getArbolPrincipal().procesarMensajeAISoul(
                        idChat,
                        remitente,
                        'No se pudo registrar mi solicitud',
                        chatData,
                        contextoArbol
                    );
                    return false;
                }
        } else {
            // Se superó el límite de intentos
            chatData.descripcion = 'Se superó el límite de intentos para el Endpoint IVR Escombros.';
            await modelChat.actualizar(idChat, "Endpoint IVR Escombros - Límite intentos", chatData);
            
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
            
            // Pasar a asesor (no continuar flujo del árbol)
            await getArbolPrincipal().procesarMensajeAISoul(
                idChat,
                remitente,
                'Necesito ayuda con mi servicio',
                chatData,
                contextoArbol
            );
            return false;
        }
    } catch (error) {
        // INCREMENTAR CONTADOR solo si el error tiene un status HTTP diferente a 200
        // Si es una excepción de red u otro tipo, también incrementar porque no se pudo consumir el servicio
        const errorStatus = error.response?.status;
        if (errorStatus && errorStatus !== 200) {
            chatData.controlPeticionesIVRFugaAgua = (parseInt(chatData.controlPeticionesIVRFugaAgua) || 0) + 1;
            chatData.controlApiIVRFugaAgua = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error HTTP al consumir Endpoint IVR Escombros - Status: ${errorStatus} (intento ${chatData.controlPeticionesIVRFugaAgua}/6).`;
        } else {
            // Excepción de red u otro tipo - también incrementar porque no se pudo consumir
            chatData.controlPeticionesIVRFugaAgua = (parseInt(chatData.controlPeticionesIVRFugaAgua) || 0) + 1;
            chatData.controlApiIVRFugaAgua = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error al consumir Endpoint IVR Escombros - Excepción: ${error.message} (intento ${chatData.controlPeticionesIVRFugaAgua}/6).`;
        }
        
        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVREscombros`,
            idChat,
            remitente,
            controlPeticionesIVRFugaAgua: chatData.controlPeticionesIVRFugaAgua,
            errorStatus: errorStatus || 'N/A',
            errorMensaje: error.message
        }, '❌ Error al consumir Endpoint IVR Escombros');
        
        await modelChat.actualizar(idChat, "Endpoint IVR Escombros - Error", chatData);

        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVREscombros`,
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            controlPeticionesIVRFugaAgua: chatData.controlPeticionesIVRFugaAgua
        }, 'Error en consumirEndpointIVREscombros');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Endpoint IVR Escombros';
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
            return await getArbolPrincipal().procesarMensajeAISoul(idChat, remitente, 'Necesito ayuda con mi servicio', contextoArbol);
        }
        
        return errorResult || false;
    }
};




// todo: Consumir Endpoint IVR Podas
const consumirEndpointIVRPodas = async (idChat, remitente, chatData, contextoArbol = 'arbolEspAseo') => {
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
            recurso: `${contextoArbol}.consumirEndpointIVRPodas`,
            idChat,
            remitente,
            controlPeticionesIVR: chatData.controlPeticionesIVR
        }, `🔄 Intentando consumir Endpoint IVR Podas (intento ${chatData.controlPeticionesIVR + 1})`);

        if (chatData.controlPeticionesIVR <= 5) {
            // Construir estructura del mensaje para la API
            const estructuraMensaje = {
                scriptName: 'ws_ivr_crear_solicitud',
                poliza: chatData.numeroPoliza,
                tpd_codigo: '29',
                tpq_codigo: '06',
                tel_ivr: '1'
            };

            // Consumir servicio de Triple A
            const response = await serviceTripleA.procesarConsultaTripleA(estructuraMensaje);
            
            // SOLO incrementar contador si el servicio devuelve status diferente a 200
            if (response.status !== 200) {
                chatData.controlPeticionesIVR = (parseInt(chatData.controlPeticionesIVR) || 0) + 1;
                chatData.controlApiIVR = dataEstatica.configuracion.controlApi.error;
                chatData.descripcion = `Endpoint IVR Podas presentó error HTTP status ${response.status} (intento ${chatData.controlPeticionesIVR}/6).`;
                
                logger.warn({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointIVRPodas`,
                    idChat,
                    remitente,
                    controlPeticionesIVR: chatData.controlPeticionesIVR,
                    status: response.status
                }, `⚠️ Error HTTP en Endpoint IVR Podas - Status: ${response.status}`);
                
                await modelChat.actualizar(idChat, "Endpoint IVR Podas - Error HTTP", chatData);

                const api = 'Chat Web Triple A';
                const procesoApi = 'Endpoint IVR Podas';
                return await getArbolPrincipal().errorAPI(api, procesoApi, response, idChat, remitente, contextoArbol);
            }

            // Si la respuesta tiene status 200, procesar la respuesta sin marcar errores
            // Serializar resultadoApiIVR antes de guardarlo en la base de datos
            chatData.resultadoApiIVR = typeof response.data === 'object' ? JSON.stringify(response.data) : response.data;
            chatData.controlApiIVR = dataEstatica.configuracion.controlApi.success;
            chatData.controlPeticionesIVR = 0; // Resetear contador en caso de éxito HTTP 200
            chatData.descripcion = 'Endpoint IVR Podas ejecutado exitosamente.';

                // Verificar si la respuesta es efectiva pero errónea
                if (response.data && response.data.results && response.data.results[0]) {
                    const resultado = response.data.results[0];
                    const msgsis = resultado.msgsis || '';
                    
                    logger.info({
                        contexto: 'model',
                        recurso: `${contextoArbol}.consumirEndpointIVRPodas`,
                        idChat,
                        remitente,
                        resultado: resultado,
                        tieneCodigo: !!resultado.codigo,
                        codigo: resultado.codigo
                    }, '📋 Procesando resultado del Endpoint IVR Podas');
                    
                    // Validar respuesta efectiva pero errónea
                    if (msgsis.includes('NO SE PUDO REALIZAR')) {
                        // Respuesta errónea, pasar a asesor
                        chatData.descripcion = 'La solicitud no pudo ser realizada según respuesta del endpoint.';
                        await modelChat.actualizar(idChat, "Endpoint IVR Podas - Solicitud no realizada", chatData);
                        
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
                        
                        // Pasar a asesor (no continuar flujo del árbol)
                        await getArbolPrincipal().procesarMensajeAISoul(
                            idChat,
                            remitente,
                            'No se pudo registrar mi solicitud',
                            chatData,
                            contextoArbol
                        );
                        return false;
                    } else if (msgsis.includes('USUARIO YA TIENE REGISTRADA UNA SOLICITUD')) {
                        // Usuario ya tiene una solicitud registrada - Caso válido
                        chatData.descripcion = 'Usuario ya tiene una solicitud registrada en el sistema.';
                        await modelChat.actualizar(idChat, "Endpoint IVR Podas - Solicitud ya registrada", chatData);
                        
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
                        
                        // Pasar a asesor para seguimiento (no continuar flujo del árbol)
                        await getArbolPrincipal().procesarMensajeAISoul(
                            idChat,
                            remitente,
                            'Necesito información sobre mi solicitud registrada',
                            chatData,
                            contextoArbol
                        );
                        return false;
                    } else {
                        // Solicitud exitosa - El código siempre debe estar presente en respuestas exitosas
                        if (!resultado.codigo || resultado.codigo.trim() === '') {
                            logger.error({
                                contexto: 'model',
                                recurso: `${contextoArbol}.consumirEndpointIVRPodas`,
                                idChat,
                                remitente,
                                resultado: resultado
                            }, '❌ Respuesta exitosa pero sin código de reporte');
                            
                            chatData.descripcion = 'La respuesta del endpoint no contiene código de reporte.';
                            await modelChat.actualizar(idChat, "Endpoint IVR Podas - Sin código", chatData);
                            
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
                            
                            await getArbolPrincipal().procesarMensajeAISoul(
                                idChat,
                                remitente,
                                'No se obtuvo número de reporte',
                                chatData,
                                contextoArbol
                            );
                            return false;
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
                        await modelChat.actualizar(idChat, "Endpoint IVR Podas - Éxito", chatData);
                        return true;
                    }
                } else {
                    // Respuesta sin estructura esperada
                    chatData.descripcion = 'La respuesta del endpoint no tiene la estructura esperada.';
                    await modelChat.actualizar(idChat, "Endpoint IVR Podas - Respuesta inválida", chatData);
                    
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
                    
                    // Pasar a asesor (no continuar flujo del árbol)
                    await getArbolPrincipal().procesarMensajeAISoul(
                        idChat,
                        remitente,
                        'No se pudo registrar mi solicitud',
                        chatData,
                        contextoArbol
                    );
                    return false;
                }
        } else {
            // Se superó el límite de intentos
            chatData.descripcion = 'Se superó el límite de intentos para el Endpoint IVR Podas.';
            await modelChat.actualizar(idChat, "Endpoint IVR Podas - Límite intentos", chatData);
            
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
            
            // Pasar a asesor (no continuar flujo del árbol)
            await getArbolPrincipal().procesarMensajeAISoul(
                idChat,
                remitente,
                'Necesito ayuda con mi servicio',
                chatData,
                contextoArbol
            );
            return false;
        }
    } catch (error) {
        // INCREMENTAR CONTADOR solo si el error tiene un status HTTP diferente a 200
        // Si es una excepción de red u otro tipo, también incrementar porque no se pudo consumir el servicio
        const errorStatus = error.response?.status;
        if (errorStatus && errorStatus !== 200) {
            chatData.controlPeticionesIVR = (parseInt(chatData.controlPeticionesIVR) || 0) + 1;
            chatData.controlApiIVR = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error HTTP al consumir Endpoint IVR Podas - Status: ${errorStatus} (intento ${chatData.controlPeticionesIVR}/6).`;
        } else {
            // Excepción de red u otro tipo - también incrementar porque no se pudo consumir
            chatData.controlPeticionesIVR = (parseInt(chatData.controlPeticionesIVR) || 0) + 1;
            chatData.controlApiIVR = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error al consumir Endpoint IVR Podas - Excepción: ${error.message} (intento ${chatData.controlPeticionesIVR}/6).`;
        }
        
        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVRPodas`,
            idChat,
            remitente,
            controlPeticionesIVR: chatData.controlPeticionesIVR,
            errorStatus: errorStatus || 'N/A',
            errorMensaje: error.message
        }, '❌ Error al consumir Endpoint IVR Podas');
        
        await modelChat.actualizar(idChat, "Endpoint IVR Podas - Error", chatData);

        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVRPodas`,
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            controlPeticionesIVR: chatData.controlPeticionesIVR
        }, 'Error en consumirEndpointIVRPodas');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Endpoint IVR Podas';
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
            return await getArbolPrincipal().procesarMensajeAISoul(idChat, remitente, 'Necesito ayuda con mi servicio', contextoArbol);
        }
        
        return errorResult || false;
    }
};


// todo: Consumir Endpoint IVR Troncos
const consumirEndpointIVRTroncos = async (idChat, remitente, chatData, contextoArbol = 'arbolEspAseo') => {
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
            recurso: `${contextoArbol}.consumirEndpointIVRTroncos`,
            idChat,
            remitente,
            controlPeticionesIVR: chatData.controlPeticionesIVR
        }, `🔄 Intentando consumir Endpoint IVR Troncos (intento ${chatData.controlPeticionesIVR + 1})`);

        if (chatData.controlPeticionesIVR <= 5) {
            // Construir estructura del mensaje para la API
            const estructuraMensaje = {
                scriptName: 'ws_ivr_crear_solicitud',
                poliza: chatData.numeroPoliza,
                tpd_codigo: '30',
                tpq_codigo: '65',
                tel_ivr: '1'
            };

            // Consumir servicio de Triple A
            const response = await serviceTripleA.procesarConsultaTripleA(estructuraMensaje);
            
            // SOLO incrementar contador si el servicio devuelve status diferente a 200
            if (response.status !== 200) {
                chatData.controlPeticionesIVR = (parseInt(chatData.controlPeticionesIVR) || 0) + 1;
                chatData.controlApiIVR = dataEstatica.configuracion.controlApi.error;
                chatData.descripcion = `Endpoint IVR Troncos presentó error HTTP status ${response.status} (intento ${chatData.controlPeticionesIVR}/6).`;
                
                logger.warn({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointIVRTroncos`,
                    idChat,
                    remitente,
                    controlPeticionesIVR: chatData.controlPeticionesIVR,
                    status: response.status
                }, `⚠️ Error HTTP en Endpoint IVR Troncos - Status: ${response.status}`);
                
                await modelChat.actualizar(idChat, "Endpoint IVR Troncos - Error HTTP", chatData);

                const api = 'Chat Web Triple A';
                const procesoApi = 'Endpoint IVR Troncos';
                return await getArbolPrincipal().errorAPI(api, procesoApi, response, idChat, remitente, contextoArbol);
            }

            // Si la respuesta tiene status 200, procesar la respuesta sin marcar errores
            // Serializar resultadoApiIVR antes de guardarlo en la base de datos
            chatData.resultadoApiIVR = typeof response.data === 'object' ? JSON.stringify(response.data) : response.data;
            chatData.controlApiIVR = dataEstatica.configuracion.controlApi.success;
            chatData.controlPeticionesIVR = 0; // Resetear contador en caso de éxito HTTP 200
            chatData.descripcion = 'Endpoint IVR Troncos ejecutado exitosamente.';

                // Verificar si la respuesta es efectiva pero errónea
                if (response.data && response.data.results && response.data.results[0]) {
                    const resultado = response.data.results[0];
                    const msgsis = resultado.msgsis || '';
                    
                    logger.info({
                        contexto: 'model',
                        recurso: `${contextoArbol}.consumirEndpointIVRTroncos`,
                        idChat,
                        remitente,
                        resultado: resultado,
                        tieneCodigo: !!resultado.codigo,
                        codigo: resultado.codigo
                    }, '📋 Procesando resultado del Endpoint IVR Troncos');
                    
                    // Validar respuesta efectiva pero errónea
                    if (msgsis.includes('NO SE PUDO REALIZAR')) {
                        // Respuesta errónea, pasar a asesor
                        chatData.descripcion = 'La solicitud no pudo ser realizada según respuesta del endpoint.';
                        await modelChat.actualizar(idChat, "Endpoint IVR Troncos - Solicitud no realizada", chatData);
                        
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
                        
                        // Pasar a asesor (no continuar flujo del árbol)
                        await getArbolPrincipal().procesarMensajeAISoul(
                            idChat,
                            remitente,
                            'No se pudo registrar mi solicitud',
                            chatData,
                            contextoArbol
                        );
                        return false;
                    } else if (msgsis.includes('USUARIO YA TIENE REGISTRADA UNA SOLICITUD')) {
                        // Usuario ya tiene una solicitud registrada - Caso válido
                        chatData.descripcion = 'Usuario ya tiene una solicitud registrada en el sistema.';
                        await modelChat.actualizar(idChat, "Endpoint IVR Troncos - Solicitud ya registrada", chatData);
                        
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
                        
                        // Pasar a asesor para seguimiento (no continuar flujo del árbol)
                        await getArbolPrincipal().procesarMensajeAISoul(
                            idChat,
                            remitente,
                            'Necesito información sobre mi solicitud registrada',
                            chatData,
                            contextoArbol
                        );
                        return false;
                    } else {
                        // Solicitud exitosa - El código siempre debe estar presente en respuestas exitosas
                        if (!resultado.codigo || resultado.codigo.trim() === '') {
                            logger.error({
                                contexto: 'model',
                                recurso: `${contextoArbol}.consumirEndpointIVRTroncos`,
                                idChat,
                                remitente,
                                resultado: resultado
                            }, '❌ Respuesta exitosa pero sin código de reporte');
                            
                            chatData.descripcion = 'La respuesta del endpoint no contiene código de reporte.';
                            await modelChat.actualizar(idChat, "Endpoint IVR Troncos - Sin código", chatData);
                            
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
                            
                            await getArbolPrincipal().procesarMensajeAISoul(
                                idChat,
                                remitente,
                                'No se obtuvo número de reporte',
                                chatData,
                                contextoArbol
                            );
                            return false;
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
                        await modelChat.actualizar(idChat, "Endpoint IVR Troncos - Éxito", chatData);
                        return true;
                    }
                } else {
                    // Respuesta sin estructura esperada
                    chatData.descripcion = 'La respuesta del endpoint no tiene la estructura esperada.';
                    await modelChat.actualizar(idChat, "Endpoint IVR Troncos - Respuesta inválida", chatData);
                    
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
                    
                    // Pasar a asesor (no continuar flujo del árbol)
                    await getArbolPrincipal().procesarMensajeAISoul(
                        idChat,
                        remitente,
                        'No se pudo registrar mi solicitud',
                        chatData,
                        contextoArbol
                    );
                    return false;
                }
        } else {
            // Se superó el límite de intentos
            chatData.descripcion = 'Se superó el límite de intentos para el Endpoint IVR Troncos.';
            await modelChat.actualizar(idChat, "Endpoint IVR Troncos - Límite intentos", chatData);
            
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
            
            // Pasar a asesor (no continuar flujo del árbol)
            await getArbolPrincipal().procesarMensajeAISoul(
                idChat,
                remitente,
                'Necesito ayuda con mi servicio',
                chatData,
                contextoArbol
            );
            return false;
        }
    } catch (error) {
        // INCREMENTAR CONTADOR solo si el error tiene un status HTTP diferente a 200
        // Si es una excepción de red u otro tipo, también incrementar porque no se pudo consumir el servicio
        const errorStatus = error.response?.status;
        if (errorStatus && errorStatus !== 200) {
            chatData.controlPeticionesIVR = (parseInt(chatData.controlPeticionesIVR) || 0) + 1;
            chatData.controlApiIVR = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error HTTP al consumir Endpoint IVR Troncos - Status: ${errorStatus} (intento ${chatData.controlPeticionesIVR}/6).`;
        } else {
            // Excepción de red u otro tipo - también incrementar porque no se pudo consumir
            chatData.controlPeticionesIVR = (parseInt(chatData.controlPeticionesIVR) || 0) + 1;
            chatData.controlApiIVR = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error al consumir Endpoint IVR Troncos - Excepción: ${error.message} (intento ${chatData.controlPeticionesIVR}/6).`;
        }
        
        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVRTroncos`,
            idChat,
            remitente,
            controlPeticionesIVR: chatData.controlPeticionesIVR,
            errorStatus: errorStatus || 'N/A',
            errorMensaje: error.message
        }, '❌ Error al consumir Endpoint IVR Troncos');
        
        await modelChat.actualizar(idChat, "Endpoint IVR Troncos - Error", chatData);

        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVRTroncos`,
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            controlPeticionesIVR: chatData.controlPeticionesIVR
        }, 'Error en consumirEndpointIVRTroncos');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Endpoint IVR Troncos';
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
            return await getArbolPrincipal().procesarMensajeAISoul(idChat, remitente, 'Necesito ayuda con mi servicio', contextoArbol);
        }
        
        return errorResult || false;
    }
};



// todo: Mostrar Submenu 
const mostrarSubmenu = async (idChat, remitente, submenuId, chatData, contextoArbol = 'arbolEspAseo') => {
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

        // Construir mensaje contextual según los datos ingresados
        let mensajeContexto = 'He reportado un problema con el servicio. ';
        if (chatData.nombresApellidos && chatData.nombresApellidos !== '-') {
            mensajeContexto += `Mis datos son: ${chatData.nombresApellidos}. `;
        }
        if (chatData.direccion && chatData.direccion !== '-') {
            mensajeContexto += `Dirección: ${chatData.direccion}. `;
        }
        if (chatData.descripcionProblema && chatData.descripcionProblema !== '-') {
            mensajeContexto += `Descripción del problema: ${chatData.descripcionProblema}.`;
        }

        return await getArbolPrincipal().procesarMensajeAISoul(
            idChat,
            remitente,
            mensajeContexto,
            contextoArbol
        );
    }
    const submenu = SUBMENUS_CONFIG[submenuId];

    if (!submenu) {
        logger.warn({
            contexto: 'model', recurso: 'arbolEspAseo.mostrarSubmenu',
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
                recurso: 'arbolEspAseo.mostrarSubmenu',
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
        
        if (submenuId === 'endpoint_info_cliente_ivr_escombros') {
            resultadoEndpoint = await consumirEndpointInfoCliente(idChat, remitente, chatData, contextoArbol);
        } else if (submenuId === 'endpoint_ivr_escombros') {
            resultadoEndpoint = await consumirEndpointIVREscombros(idChat, remitente, chatData, contextoArbol);
        } else if (submenuId === 'endpoint_info_cliente_ivr_podas') {
            // TODO: Implementar para baja presión cuando sea necesario
            resultadoEndpoint = await consumirEndpointInfoCliente(idChat, remitente, chatData, contextoArbol);
        } else if (submenuId === 'endpoint_ivr_podas') {
            resultadoEndpoint = await consumirEndpointIVRPodas(idChat, remitente, chatData, contextoArbol);
        } else if (submenuId === 'endpoint_info_cliente_ivr_troncos') {
            // TODO: Implementar para fuga agua cuando sea necesario
            resultadoEndpoint = await consumirEndpointInfoCliente(idChat, remitente, chatData, contextoArbol);
        } else if (submenuId === 'endpoint_ivr_troncos') {
            resultadoEndpoint = await consumirEndpointIVRTroncos(idChat, remitente, chatData, contextoArbol);
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

    // ===== CASO ESPECIAL: AVANZAR =====
    if (submenu.tipo === 'avanzar') {
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


    // ===== CERRAR CHAT =====
    if (submenu.siguiente === 'cerrar_chat') {
        return await getArbolPrincipal().cerrarChatConDespedida(idChat, remitente, chatData, 'arbolEspAseo');
    } else if (submenu.siguiente === 'menu_principal') {
        return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
    } else if (submenu.siguiente) {
        return await mostrarSubmenu(idChat, remitente, submenu.siguiente, chatData);
    }



     // ===== CASO ESPECIAL: INPUT_MULTIPLE - Iniciar secuencia de inputs =====
    if (submenu.tipo === 'input_multiple' && submenu.inputKey && submenu.inputKey.length > 0) {
        logger.info({
            contexto: 'model',
            recurso: 'arbolEspAseo.mostrarSubmenu',
            submenuActual: submenuId,
            inputsRequeridos: submenu.inputKey
        }, '⚡ Iniciando secuencia de inputs automáticamente');

        // Actualizar estado primero
        await modelChat.actualizar(idChat, submenu.pasoArbol, chatData);

        // Guardar la secuencia completa y el destino final
        chatData.inputsSecuencia = JSON.stringify(submenu.inputKey);
        chatData.submenuPendiente = submenu.siguiente;
        chatData.mensajePersonalizadoEnCurso = submenu.mensaje || '-';

        // Solicitar el primer input de la secuencia (sin mostrar mensaje previo)
        return await solicitarInputUsuario(
            idChat,
            remitente,
            submenu.inputKey[0],
            submenu.siguiente,
            chatData,
            'arbolEspAseo',
            submenu.mensaje
        );
    }

    // ===== CASO ESPECIAL: PASAR_AGENTE - NO mostrar mensaje aquí =====
    if (submenu.tipo === 'pasar_agente') {
        // Solo actualizar estado, el mensaje lo mostrará procesarRespuestaSubmenu
        await modelChat.actualizar(idChat, submenu.pasoArbol, chatData);

        // Llamar directamente a procesarRespuestaSubmenu para manejar el pasar_agente
        return await procesarRespuestaSubmenu(idChat, remitente, '', chatData, submenuId, 'arbolEspAseo');
    }

    // ===== MOSTRAR MENSAJE NORMAL (para submenús con opciones) =====
    await modelChat.actualizar(idChat, submenu.pasoArbol, chatData);

    await getArbolPrincipal().crearMensaje(
        idChat, remitente,
        dataEstatica.configuracion.estadoMensaje.enviado,
        dataEstatica.configuracion.tipoMensaje.texto,
        submenu.mensaje,
        chatData.descripcion
    );

    // ===== AVANCE AUTOMÁTICO =====
    if (submenu.avanceAutomatico) {
        logger.info({
            contexto: 'model',
            recurso: 'arbolEspAseo.mostrarSubmenu',
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
                contexto: 'model', recurso: 'arbolEspAseo.procesarRespuestaSubmenu',
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
                    recurso: 'arbolEspAseo.procesarRespuestaSubmenu',
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

                // Determinar si es un mensaje que requiere adjuntos
                const requiereAdjuntos = opcion.requiereAdjuntos === true;
                const tipoMensaje = requiereAdjuntos
                    ? dataEstatica.configuracion.tipoMensaje.adjuntos
                    : dataEstatica.configuracion.tipoMensaje.texto;

                // Mostrar mensaje de avance
                await getArbolPrincipal().crearMensaje(
                    idChat, remitente,
                    dataEstatica.configuracion.estadoMensaje.enviado,
                    dataEstatica.configuracion.tipoMensaje.texto,
                    opcion.mensajeAvance,
                    chatData.descripcion
                );

                // Si requiere adjuntos, actualizar el estado para esperar adjuntos
                if (requiereAdjuntos) {
                    const pasoArbol = `Esperando Adjuntos Tramite ${submenuId}`;
                    chatData.descripcion = `Esperando adjuntos de documentos para ${submenuId}`;
                    await modelChat.actualizar(idChat, pasoArbol, chatData);
                    return true;
                }

                // Si el siguiente paso es pasar a agente (Interaccion AI Soul)
                if (opcion.siguiente === 'Interaccion AI Soul') {
                    chatData.descripcion = `Usuario seleccionó opción ${contenidoNormalized} - Pasando a agente`;
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

                    // Pasar directamente a agente con mensaje contextual
                    const mensajeContexto = opcion.mensajeContextoIA ||
                        `El usuario necesita asistencia. Contexto: ${submenu.descripcion}`;

                    return await getArbolPrincipal().procesarMensajeAISoul(
                        idChat,
                        remitente,
                        mensajeContexto,
                        chatData,
                        contextoArbol
                    );
                }

                // Ir al siguiente paso
                if (opcion.siguiente === 'menu_principal') {
                    return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
                } else if (opcion.siguiente === 'cerrar_chat') {
                    return await getArbolPrincipal().cerrarChatConDespedida(idChat, remitente, chatData, contextoArbol);
                } else if (opcion.siguiente) {
                    return await mostrarSubmenu(idChat, remitente, opcion.siguiente, chatData);
                }

                return true;
            }

            // TIPO: INPUT_MULTIPLE (Secuencia de inputs)
            if (opcion.tipo === 'input_multiple') {
                chatData.descripcion = opcion.descripcion || `Usuario seleccionó opción ${contenidoNormalized}`;

                chatData.inputsSecuencia = JSON.stringify(opcion.inputKey);
                chatData.submenuPendiente = opcion.siguiente;

                // Guardar mensajeContextoIA si existe y el siguiente paso es mensaje_asesor
                // Esto garantiza que la solicitud del cliente se envíe dinámicamente al servicio de soulchat
                if (opcion.mensajeContextoIA && opcion.siguiente === 'mensaje_asesor') {
                    chatData.mensajeContextoIAPendiente = opcion.mensajeContextoIA;
                    logger.info({
                        contexto: 'model',
                        recurso: 'arbolEspAseo.procesarRespuestaSubmenu',
                        opcion: contenidoNormalized,
                        mensajeContextoIA: opcion.mensajeContextoIA
                    }, '💾 Guardando mensajeContextoIA para uso al pasar a agente');
                }

                // Guardar mensaje personalizado para usarlo en reintentos por validación
                chatData.mensajePersonalizadoEnCurso = opcion.mensaje || '-';

                // Solicitar el primer input de la secuencia
                return await solicitarInputUsuario(
                    idChat, remitente,
                    opcion.inputKey[0],
                    opcion.siguiente,
                    chatData,
                    contextoArbol
                );
            }

            // Ir al siguiente paso
            if (opcion.siguiente === 'menu_principal') {
                return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
            } else if (opcion.siguiente === 'cerrar_chat') {
                return await getArbolPrincipal().cerrarChatConDespedida(idChat, remitente, chatData, contextoArbol);
            } else if (opcion.siguiente) {
                return await mostrarSubmenu(idChat, remitente, opcion.siguiente, chatData);
            }

            return true;
        }

        // Opción no válida
        const resultado = await getArbolPrincipal().manejarNoEntiendo(
            idChat, remitente,
            `Alerta No Entiendo - Submenu Esp Aseo ${submenuId}`,
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




const solicitarInputUsuario = async (idChat, remitente, campoKey, submenuSiguiente, chatData, contextoArbol) => {
    try {
        // Obtener configuración desde dataEstatica usando la KEY
        const inputConfig = dataEstatica.inputsConfig[campoKey];

        if (!inputConfig) {
            throw new Error(`Configuración de input no encontrada para: ${campoKey}`);
        }

        const mensajeInput = `<p class="inputUsuarioArbol">${inputConfig.cabecera}</p>`;

        const pasoArbol = `Solicitar Input Esp Aseo ${inputConfig.campo}`;
        chatData.descripcion = `Solicitando: ${inputConfig.campo}`;

        // Guardar contexto en campos dedicados 
        chatData.inputEnCurso = inputConfig.campo;
        chatData.submenuPendiente = submenuSiguiente || inputConfig.submenuSiguiente || '-';

        await modelChat.actualizar(idChat, pasoArbol, chatData);

        return await getArbolPrincipal().crearMensaje(
            idChat,
            remitente,
            dataEstatica.configuracion.estadoMensaje.enviado,
            dataEstatica.configuracion.tipoMensaje.texto,
            mensajeInput,
            chatData.descripcion
        );
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
        const procesoApi = 'Solicitar Input Esp Aseo';
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


// ! EXPORTACIONES
module.exports = {
    arbolEspAseo,
    solicitarMenuarbolEspAseo,
    procesarMenuarbolEspAseo,
};