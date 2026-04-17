// ! ================================================================================================================================================
// !                                                      MODELOS PARA ARBOL CHAT BOT - FACTURA PAGO
// ! ================================================================================================================================================
// @autor Ramón Dario Rozo Torres
// @última­Modificación Ramón Dario Rozo Torres
// @versión 1.0.0
// v1/models/widget/arbol/arbolFacturaPago.model.js

// ! REQUIRES
require('dotenv').config({ path: './../../../.env' });
const modelChat = require('../chat.model.js');
const dataEstatica = require('../../../seeds/dataEstatica.js');
const logger = require('../../../logger/index.js');
const serviceTripleA = require('../../../services/serviceTripleA.service.js');
const serviceTBOTripleA = require('../../../services/serviceTBOTripleA.service.js');
const fs = require('fs').promises;
const path = require('path');


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
    esSecuenciaMultiple: 'false',
    relacionPredio: '-',
    revisarFactura: '-',
};

const SUBMENUS_CONFIG = {
    // ===== SALDO DE TU FACTURA ===== (SIN TBO - Solo IVR)
    saldo_factura: {
        pasoArbol: "Procesar Submenu Factura Pago saldo_factura",
        descripcion: 'Usuario en: Saldo de tu factura - Verificar póliza',
        mensaje: dataEstatica.mensajes.verificarPoliza,
        opciones: {
            '1': {
                tipo: 'input_multiple',
                descripcion: 'Usuario tiene póliza - Saldo',
                inputKey: ['numeroPoliza'],
                mensaje: dataEstatica.mensajes.numeroPolizaFactura,
                siguiente: 'endpoint_info_cliente_saldo'
            },
            '2': {
                tipo: 'input_multiple',
                descripcion: 'Usuario no tiene póliza - Saldo',
                inputKey: ['nombresApellidos', 'direccion', 'descripcionProblema'],
                mensaje: dataEstatica.mensajes.sinPolizaAsesor,
                siguiente: 'mensaje_asesor',
            }
        }
    },

    // ===== ENDPOINT INFO CLIENTE SALDO=====
    endpoint_info_cliente_saldo: {
        pasoArbol: "Procesar Submenu Factura Pago endpoint_info_cliente_saldo",
        descripcion: 'Usuario en: Endpoint información cliente - Saldo',
        tipo: 'endpoint',
        avanceAutomatico: 'confirmar_informacion_saldo'
    },

    // ===== CONFIRMAR INFORMACIÓN SALDO =====
    confirmar_informacion_saldo: {
        pasoArbol: "Procesar Submenu Factura Pago confirmar_informacion_saldo",
        descripcion: 'Usuario en: Confirmar información - Saldo',
        mensaje: dataEstatica.mensajes.confirmarInformacion,
        opciones: {
            '1': {
                tipo: 'endpoint',
                descripcion: 'Usuario confirma - Procesar IVR Estado Cuenta',
                siguiente: 'endpoint_ivr_estado_cuenta'
            },
            '2': {
                tipo: 'input_multiple',
                descripcion: 'Usuario corrige - Volver a ingresar póliza',
                inputKey: ['numeroPoliza'],
                mensaje: dataEstatica.mensajes.numeroPolizaFactura,
                siguiente: 'endpoint_info_cliente_saldo'
            }
        }
    },

    // ===== ENDPOINT IVR ESTADO CUENTA =====
    endpoint_ivr_estado_cuenta: {
        pasoArbol: "Procesar Submenu Factura Pago endpoint_ivr_estado_cuenta",
        descripcion: 'Usuario en: Endpoint IVR Estado Cuenta',
        tipo: 'endpoint',
        siguienteExito: 'opciones_saldo_factura',
        siguienteError: 'solicitar_datos_error_factura'
    },

    // ===== SOLICITAR DATOS ERROR SALDO =====
    solicitar_datos_error_factura: {
        pasoArbol: "Procesar Submenu Factura Pago solicitar_datos_error_factura",
        descripcion: 'Usuario en: Solicitar datos por error en factura',
        tipo: 'input_multiple',
        inputKey: ['nombresApellidos', 'direccion'],
        mensaje: dataEstatica.mensajes.mensajeErrorFactura,
        siguiente: 'mensaje_asesor',
        mensajeContextoIA: 'El Usuario reportó un problema con la consulta de su factura y necesita ayuda'
    },

    // ===== OPCIONES SALDO FACTURA =====
    opciones_saldo_factura: {
        pasoArbol: "Procesar Submenu Factura Pago opciones_saldo_factura",
        descripcion: 'Usuario en: Opciones saldo factura',
        mensaje: dataEstatica.mensajes.opcionesSaldoFactura,
        opciones: {
            '1': {
                tipo: 'avanzar',
                descripcion: 'Usuario consulta otra póliza',
                siguiente: 'saldo_factura'
            },
            '2': {
                tipo: 'avanzar',
                descripcion: 'Usuario va al menú principal',
                siguiente: 'menu_principal'
            },
            '3': {
                tipo: 'avanzar',
                descripcion: 'Usuario finaliza',
                mensajeAvance: dataEstatica.mensajes.msgFinalFactura,
                siguiente: 'cerrar_chat'
            }
        }
    },

    // ===== DESCARGAR FACTURA ===== (CON TBO - Descarga PDF)
    descargar_factura: {
        pasoArbol: "Procesar Submenu Factura Pago descargar_factura",
        descripcion: 'Usuario en: Descargar factura - Verificar póliza',
        mensaje: dataEstatica.mensajes.verificarPoliza,
        opciones: {
            '1': {
                tipo: 'input_multiple',
                descripcion: 'Usuario tiene póliza - Descargar',
                inputKey: ['numeroPoliza'],
                mensaje: dataEstatica.mensajes.numeroPolizaFactura,
                siguiente: 'endpoint_info_cliente_descarga'
            },
            '2': {
                tipo: 'input_multiple',
                descripcion: 'Usuario no tiene póliza - Descargar',
                inputKey: ['nombresApellidos', 'direccion', 'descripcionProblema'],
                mensaje: dataEstatica.mensajes.sinPolizaAsesor,
                siguiente: 'mensaje_asesor'
            }
        }
    },

    // ===== ENDPOINT INFO CLIENTE DESCARGA =====
    endpoint_info_cliente_descarga: {
        pasoArbol: "Procesar Submenu Factura Pago endpoint_info_cliente_descarga",
        descripcion: 'Usuario en: Endpoint información cliente - Descarga',
        tipo: 'endpoint',
        avanceAutomatico: 'confirmar_informacion_descarga'
    },

    // ===== CONFIRMAR INFORMACIÓN DESCARGA =====
    confirmar_informacion_descarga: {
        pasoArbol: "Procesar Submenu Factura Pago confirmar_informacion_descarga",
        descripcion: 'Usuario en: Confirmar información - Descarga',
        mensaje: dataEstatica.mensajes.confirmarInformacion,
        opciones: {
            '1': {
                tipo: 'endpoint',
                descripcion: 'Usuario confirma - Procesar TBO Datos Cliente',
                siguiente: 'endpoint_tbo_datos_cliente'
            },
            '2': {
                tipo: 'input_multiple',
                descripcion: 'Usuario corrige - Volver a ingresar póliza',
                inputKey: ['numeroPoliza'],
                mensaje: dataEstatica.mensajes.numeroPolizaFactura,
                siguiente: 'endpoint_info_cliente_descarga'
            }
        }
    },

    // ===== ENDPOINT TBO DATOS CLIENTE (SOLO DESCARGA) =====
    endpoint_tbo_datos_cliente: {
        pasoArbol: "Procesar Submenu Factura Pago endpoint_tbo_datos_cliente",
        descripcion: 'Usuario en: Endpoint TBO Datos Cliente',
        tipo: 'endpoint',
        avanceAutomatico: 'endpoint_tbo_copia_factura',
        siguienteExito: 'endpoint_tbo_copia_factura',
        siguienteError: 'solicitar_datos_error_descarga'
    },

    // ===== SOLICITAR DATOS ERROR DESCARGA =====
    solicitar_datos_error_descarga: {
        pasoArbol: "Procesar Submenu Factura Pago solicitar_datos_error_descarga",
        descripcion: 'Usuario en: Solicitar datos por error en descarga factura',
        tipo: 'input_multiple',
        inputKey: ['nombresApellidos', 'direccion'],
        mensaje: dataEstatica.mensajes.mensajeErrorFactura,
        siguiente: 'mensaje_asesor',
        mensajeContextoIA: 'El Usuario reportó un problema con la descarga de su factura y necesita ayuda'
    },

    // ===== ENDPOINT TBO COPIA FACTURA PDF (SOLO DESCARGA) =====
    endpoint_tbo_copia_factura: {
        pasoArbol: "Procesar Submenu Factura Pago endpoint_tbo_copia_factura",
        descripcion: 'Usuario en: Endpoint TBO Copia Factura PDF',
        tipo: 'endpoint',
        avanceAutomatico: 'opciones_descarga_factura'
    },

    // ===== OPCIONES DESCARGA FACTURA (NUEVO) =====
    opciones_descarga_factura: {
        pasoArbol: "Procesar Submenu Factura Pago opciones_descarga_factura",
        descripcion: 'Usuario en: Opciones descarga factura',
        mensaje: dataEstatica.mensajes.opcionesSaldoFactura,
        opciones: {
            '1': {
                tipo: 'avanzar',
                descripcion: 'Usuario descarga otra factura',
                siguiente: 'descargar_factura'
            },
            '2': {
                tipo: 'avanzar',
                descripcion: 'Usuario va al menú principal',
                siguiente: 'menu_principal'
            },
            '3': {
                tipo: 'avanzar',
                descripcion: 'Usuario finaliza',
                mensajeAvance: dataEstatica.mensajes.msgFinalFactura,
                siguiente: 'cerrar_chat'
            }
        }
    },

    // ===== ACUERDO DE PAGO =====
    acuerdo_pago: {
        pasoArbol: "Procesar Submenu Factura Pago acuerdo_pago",
        descripcion: 'Usuario en: Acuerdo de pago',
        tipo: 'input_multiple',
        inputKey: ['numeroPoliza', 'nombresApellidos', 'numeroDocumento', 'relacionPredio'],
        mensaje: dataEstatica.mensajes.acuerdoPago,
        siguiente: 'mensaje_asesor',
        mensajeContextoIA: 'El Usuario ha solicitado un asesor para Acuerdo de pago'
    },

    // ===== ACLARACIÓN FACTURA =====
    aclaracion_factura: {
        pasoArbol: "Procesar Submenu Factura Pago aclaracion_factura",
        descripcion: 'Usuario en: Aclaración factura',
        tipo: 'input_multiple',
        inputKey: ['numeroPoliza', 'nombresApellidos', 'numeroDocumento', 'relacionPredio', 'revisarFactura'],
        mensaje: dataEstatica.mensajes.aclaracionFactura,
        siguiente: 'mensaje_asesor',
        mensajeContextoIA: 'El Usuario ha solicitado un asesor para Aclaración factura'
    },

    // ===== PUNTOS DE PAGO =====
    puntos_pago: {
        tipo: 'avanzar',
        pasoArbol: "Procesar Submenu Factura Pago puntos_pago",
        descripcion: 'Usuario en: Puntos de pago',
        mensajeAvance: dataEstatica.mensajes.puntosDePago,
        siguiente: 'cerrar_chat'
    },

    // ===== MENSAJE ASESOR =====
    mensaje_asesor: {
        tipo: 'pasar_agente',
        pasoArbol: "Procesar Submenu Factura Pago mensaje_asesor",
        descripcion: 'Usuario solicita asesor - Pasando a agente',
        mensaje: dataEstatica.mensajes.mensajeAsesor
    }
};

// ! MODELOS
// * ARBOL CHAT BOT - Factura Pago
const arbolFacturaPago = async (idChat, remitente, arbolChat, contenido, chatData, contextoArbol = 'arbolFacturaPago') => {
    try {
        // todo: Primera vez que entra al árbol
        if (arbolChat === "Solicitar Arbol Factura Pago") {
            return await solicitarMenuArbolFacturaPago(idChat, remitente, chatData, contextoArbol);
        }

        // todo: Interceptar después de IA y volver al menú
        if (arbolChat === "Regresar Al Menu Principal Despues IA") {
            logger.info({
                contexto: 'model',
                recurso: 'arbolFacturaPago.arbolFacturaPago',
                idChat,
                remitente,
                contenido
            }, '🔄 Usuario respondió después de IA, regresando al menú principal');

            return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
        }

        // todo: Menú principal
        if (arbolChat === "Solicitar Menu Arbol Factura Pago" || arbolChat === dataEstatica.arbol.alertaNoEntiendo) {
            return await procesarMenuArbolFacturaPago(idChat, remitente, contenido, chatData, contextoArbol);
        }

        // todo: Manejo de errores en submenús
        if (arbolChat.startsWith("Alerta No Entiendo - Submenu Factura Pago ")) {
            const submenuId = arbolChat.replace("Alerta No Entiendo - Submenu Factura Pago ", "");
            return await procesarRespuestaSubmenu(idChat, remitente, contenido, chatData, submenuId, contextoArbol);
        }

        // todo: Procesando respuesta de submenú
        if (arbolChat.startsWith("Procesar Submenu Factura Pago ")) {
            const submenuId = arbolChat.replace("Procesar Submenu Factura Pago ", "");
            return await procesarRespuestaSubmenu(idChat, remitente, contenido, chatData, submenuId, contextoArbol);
        }

        // todo: Procesando input del usuario
        if (arbolChat.startsWith("Solicitar Input Factura Pago ")) {
            return await procesarInputUsuario(idChat, remitente, contenido, chatData, contextoArbol);
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

        logger.warn({
            contexto: "model",
            recurso: "arbolFacturaPago.arbolFacturaPago",
            arbolChat,
            idChat,
            remitente
        }, "No se encontró condición válida para arbolChat en Factura Pago");

        return true;
    } catch (error) {
        const api = 'Chat Web Triple A';
        const procesoApi = 'Arbol Factura Pago';
        logger.error({
            contexto: 'model',
            recurso: 'arbolFacturaPago.arbolFacturaPago',
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            api,
            procesoApi
        }, 'Error en arbolFacturaPago');

        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente, contextoArbol);
    }
};

// todo: Solicitar Menu Arbol Factura Pago
const solicitarMenuArbolFacturaPago = async (idChat, remitente, chatData) => {
    const solicitarMenuArbolFacturaPago = "Solicitar Menu Arbol Factura Pago";
    chatData.descripcion = 'Se solicita el menú de Factura Pago.';

    await modelChat.actualizar(idChat, solicitarMenuArbolFacturaPago, chatData);

    return await getArbolPrincipal().crearMensaje(
        idChat,
        remitente,
        dataEstatica.configuracion.estadoMensaje.enviado,
        dataEstatica.configuracion.tipoMensaje.texto,
        dataEstatica.mensajes.solicitarMenuArbolFacturaPago,
        chatData.descripcion
    );
}

// todo: Procesar Menu Arbol Factura Pago
const procesarMenuArbolFacturaPago = async (idChat, remitente, contenido, chatData) => {
    try {
        const contenidoNormalized = String(contenido).trim();

        const menuOpciones = {
            '1': 'saldo_factura',
            '2': 'descargar_factura',
            '3': 'acuerdo_pago',
            '4': 'aclaracion_factura',
            '5': 'puntos_pago'
        };

        // Si es una opción válida del menú
        if (menuOpciones[contenidoNormalized]) {
            return await mostrarSubmenu(idChat, remitente, menuOpciones[contenidoNormalized], chatData);
        }

        // Opción no válida
        const resultado = await getArbolPrincipal().manejarNoEntiendo(
            idChat,
            remitente,
            "Alerta No Entiendo - Solicitar Menu Arbol Factura Pago",
            dataEstatica.mensajes.alertaNoEntiendo
        );

        if (resultado) {
            return await solicitarMenuArbolFacturaPago(idChat, remitente, chatData);
        }
        return false;

    } catch (error) {
        logger.error({
            contexto: 'model',
            recurso: 'arbolFacturaPago.procesarMenuArbolFacturaPago',
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente
        }, 'Error en procesarMenuArbolFacturaPago');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Procesar Menu Factura Pago';
        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente);
    }
};





// todo: Consumir Endpoint Información Cliente IVR
const consumirEndpointInfoCliente = async (idChat, remitente, chatData, contextoArbol = 'arbolFacturaPago') => {
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
                    dataEstatica.configuracion.tipoMensaje.texto,
                    mensajeError,
                    chatData.descripcion
                );

                // Pasar a asesor
                return await getArbolPrincipal().procesarMensajeAISoul(
                    idChat,
                    remitente,
                    'Necesito ayuda con mi servicio',
                    chatData,
                    contextoArbol
                );
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
                dataEstatica.configuracion.tipoMensaje.texto,
                mensajeError,
                chatData.descripcion
            );

            // Pasar a asesor
            return await getArbolPrincipal().procesarMensajeAISoul(
                idChat,
                remitente,
                'Necesito ayuda con mi servicio',
                chatData,
                contextoArbol
            );
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
            return await getArbolPrincipal().procesarMensajeAISoul(
                idChat,
                remitente,
                'Necesito ayuda con mi servicio',
                chatData,
                contextoArbol
            );
        }

        return errorResult || false;
    }
};




const consumirEndpointIVREstadoCuenta = async (idChat, remitente, chatData, contextoArbol = 'arbolFacturaPago') => {
    try {
        // Control de intentos (usar un contador separado para este endpoint)
        if (chatData.controlPeticionesIVR === undefined || chatData.controlPeticionesIVR === null || chatData.controlPeticionesIVR === '-') {
            chatData.controlPeticionesIVR = 0;
        } else {
            chatData.controlPeticionesIVR = parseInt(chatData.controlPeticionesIVR) || 0;
        }

        logger.info({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`,
            idChat,
            remitente,
            controlPeticionesIVR: chatData.controlPeticionesIVR
        }, `Intentando consumir endpoint IVR Estado Cuenta (intento ${chatData.controlPeticionesIVR + 1})`);

        // // 🧪 MODO PRUEBA - DESCOMENTAR PARA PROBAR FLUJO DE ERROR
        // logger.warn({ contexto: 'model', recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`, idChat, remitente }, '🧪 MODO PRUEBA: Simulando endpoint sin datos de factura');
        // chatData.descripcion = '[PRUEBA] La respuesta del endpoint no contiene información de factura.';
        // await modelChat.actualizar(idChat, "Endpoint IVR Estado Cuenta - Sin datos factura [PRUEBA]", chatData);
        // return false;
        // // FIN MODO PRUEBA

        if (chatData.controlPeticionesIVR <= 5) {
            // Construir estructura del mensaje para la API
            const estructuraMensaje = {
                scriptName: 'ws_ivr_estado_cuenta',
                poliza: chatData.numeroPoliza,
            };

            // Consumir servicio de Triple A
            const response = await serviceTripleA.procesarConsultaTripleA(estructuraMensaje);

            // SOLO incrementar contador si el servicio devuelve status diferente a 200
            if (response.status !== 200) {
                chatData.controlPeticionesIVR = (parseInt(chatData.controlPeticionesIVR) || 0) + 1;
                chatData.controlApiIVR = dataEstatica.configuracion.controlApi.error;
                chatData.descripcion = `Endpoint IVR Estado Cuenta presentó error HTTP status ${response.status} (intento ${chatData.controlPeticionesIVR}/6).`;

                logger.warn({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`,
                    idChat,
                    remitente,
                    controlPeticionesIVR: chatData.c,
                    status: response.status
                }, `Error HTTP en endpoint IVR Estado Cuenta - Status: ${response.status}`);

                await modelChat.actualizar(idChat, "Endpoint IVR Estado Cuenta - Error HTTP", chatData);

                const api = 'Chat Web Triple A';
                const procesoApi = 'Endpoint IVR Estado Cuenta';
                await getArbolPrincipal().errorAPI(api, procesoApi, response, idChat, remitente, contextoArbol);

                // Retornar false para que mostrarSubmenu redirija al flujo de error
                return false;
            }

            // Si la respuesta tiene status 200, procesar la respuesta sin marcar errores
            chatData.resultadoApiIVR = typeof response.data === 'object' ? JSON.stringify(response.data) : response.data;
            chatData.controlApiIVR = dataEstatica.configuracion.controlApi.success;
            chatData.controlPeticionesIVR = 0; // Resetear contador en caso de éxito HTTP 200
            chatData.descripcion = 'Endpoint IVR Estado Cuenta ejecutado exitosamente.';

            // Log completo de la respuesta para debugging
            logger.info({
                contexto: 'model',
                recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`,
                idChat,
                remitente,
                responseData: response.data,
                responseDataKeys: response.data ? Object.keys(response.data) : [],
                hasResults: !!(response.data && response.data.results),
                resultsLength: response.data && response.data.results ? response.data.results.length : 0
            }, '📊 Respuesta completa del endpoint IVR Estado Cuenta');

            // Verificar si la respuesta es efectiva pero errónea
            // Intentar diferentes estructuras de respuesta
            let resultado = null;
            
            // Log completo de la respuesta para debugging
            logger.info({
                contexto: 'model',
                recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`,
                idChat,
                remitente,
                responseDataCompleto: response.data,
                responseDataType: typeof response.data,
                tieneResults: !!(response.data && response.data.results),
                esArray: Array.isArray(response.data),
                keysResponseData: response.data ? Object.keys(response.data) : []
            }, '🔍 Analizando estructura de respuesta del endpoint IVR Estado Cuenta');
            
            if (response.data && response.data.results && response.data.results[0]) {
                resultado = response.data.results[0];
                logger.info({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`,
                    idChat,
                    remitente
                }, '✅ Resultado encontrado en response.data.results[0]');
            } else if (response.data && Array.isArray(response.data) && response.data[0]) {
                resultado = response.data[0];
                logger.info({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`,
                    idChat,
                    remitente
                }, '✅ Resultado encontrado en response.data[0] (array)');
            } else if (response.data && !response.data.results) {
                // La respuesta puede venir directamente en response.data
                resultado = response.data;
                logger.info({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`,
                    idChat,
                    remitente
                }, '✅ Resultado encontrado directamente en response.data');
            }

            if (resultado) {
                const msgsis = resultado.msgsis || '';

                logger.info({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`,
                    idChat,
                    remitente,
                    resultado: resultado,
                    resultadoKeys: Object.keys(resultado),
                    tieneCodigo: !!resultado.codigo,
                    codigo: resultado.codigo,
                    tieneValUltFactura: !!resultado.valUltFactura,
                    tieneValorfactura: !!resultado.valorfactura,
                    tieneValor_factura: !!resultado.valor_factura,
                    todasLasKeys: Object.keys(resultado).join(', ')
                }, '📊 Procesando resultado del endpoint IVR Estado Cuenta');

                // Validar respuesta efectiva pero errónea
                if (msgsis.includes('NO SE PUDO REALIZAR')) {
                    logger.warn({
                        contexto: 'model',
                        recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`,
                        idChat,
                        remitente,
                        msgsis
                    }, '⚠️ Respuesta indica que no se pudo realizar');

                    chatData.descripcion = 'La solicitud no pudo ser realizada según respuesta del endpoint.';
                    await modelChat.actualizar(idChat, "Endpoint IVR Estado Cuenta - Solicitud no realizada", chatData);

                    // Retornar false para ir al flujo de error
                    return false;
                }

                // Solicitud exitosa - Para Estado Cuenta validamos que tenga al menos un campo de factura
                // Buscar en diferentes posibles nombres de campos (case-insensitive)
                const obtenerValor = (obj, camposPosibles, valorDefault = 'N/A') => {
                    for (const campo of camposPosibles) {
                        // Buscar exacto
                        if (obj?.[campo] !== undefined && obj?.[campo] !== null && obj?.[campo] !== '') {
                            logger.info({
                                campoEncontrado: campo,
                                valor: obj[campo]
                            }, `✅ Campo encontrado (exacto): ${campo}`);
                            return obj[campo];
                        }
                        // Buscar case-insensitive
                        const campoLower = campo.toLowerCase();
                        for (const key in obj) {
                            if (key.toLowerCase() === campoLower && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
                                logger.info({
                                    campoEncontrado: key,
                                    valor: obj[key],
                                    campoBuscado: campo
                                }, `✅ Campo encontrado (case-insensitive): ${key} (buscado: ${campo})`);
                                return obj[key];
                            }
                        }
                    }
                    logger.warn({
                        camposBuscados: camposPosibles,
                        keysDisponibles: Object.keys(obj)
                    }, `⚠️ No se encontró ninguno de los campos buscados`);
                    return valorDefault;
                };

                const valUltFactura = obtenerValor(resultado, ['valUltFactura', 'valorfactura', 'valor_factura', 'valorFactura', 'VALOR_FACTURA', 'valor', 'VALOR', 'valorUltFactura']);
                const tieneValorFactura = valUltFactura !== 'N/A' && valUltFactura !== null && valUltFactura !== '';

                logger.info({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`,
                    idChat,
                    remitente,
                    valUltFactura,
                    tieneValorFactura
                }, `💰 Validación de valor factura: ${tieneValorFactura ? '✅ Tiene valor' : '❌ Sin valor'}`);

                if (!tieneValorFactura) {
                    logger.error({
                        contexto: 'model',
                        recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`,
                        idChat,
                        remitente,
                        resultado: resultado,
                        resultadoKeys: Object.keys(resultado),
                        valUltFactura: valUltFactura,
                        todasLasKeys: Object.keys(resultado).join(', '),
                        todosLosValores: JSON.stringify(resultado)
                    }, '❌ Respuesta exitosa pero sin datos de factura');

                    chatData.descripcion = 'La respuesta del endpoint no contiene información de factura.';
                    await modelChat.actualizar(idChat, "Endpoint IVR Estado Cuenta - Sin datos factura", chatData);

                    // Retornar false para ir al flujo de error
                    return false;
                }

                // ÉXITO - Mostrar mensaje con datos de factura
                const valorPendiente = obtenerValor(resultado, ['valorPendiente', 'valorpendiente', 'valor_pendiente', 'valorPendiente', 'VALOR_PENDIENTE', 'pendiente', 'PENDIENTE']);
                const ultFactura = obtenerValor(resultado, ['ultFactura', 'ultfactura', 'ult_factura', 'codigo', 'factura', 'ULT_FACTURA', 'facturaCodigo', 'FACTURA_CODIGO']);
                const fechaVencimiento = obtenerValor(resultado, ['fechaVencimiento', 'fechavencimiento', 'fecha_vencimiento', 'fechaVencimiento', 'FECHA_VENCIMIENTO', 'vencimiento', 'VENCIMIENTO']);
                const ultPeriodo = obtenerValor(resultado, ['ultPeriodo', 'ultperiodo', 'ult_periodo', 'periodo', 'ULT_PERIODO', 'PERIODO']);

                logger.info({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`,
                    idChat,
                    remitente,
                    valUltFactura,
                    valorPendiente,
                    ultFactura,
                    fechaVencimiento,
                    ultPeriodo
                }, '📋 Valores extraídos para el mensaje de éxito');

                const mensajeExito = dataEstatica.mensajes.mensajeExitoEstadoCuenta({
                    valUltFactura: valUltFactura,
                    valorPendiente: valorPendiente,
                    ultFactura: ultFactura,
                    fechaVencimiento: fechaVencimiento,
                    ultPeriodo: ultPeriodo
                });

                logger.info({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`,
                    idChat,
                    remitente,
                    mensajeExito: mensajeExito.substring(0, 300) // Primeros 300 caracteres para log
                }, '✅ Creando mensaje de éxito con datos de factura');

                await getArbolPrincipal().crearMensaje(
                    idChat,
                    remitente,
                    dataEstatica.configuracion.estadoMensaje.enviado,
                    dataEstatica.configuracion.tipoMensaje.texto,
                    mensajeExito,
                    chatData.descripcion
                );

                await modelChat.actualizar(idChat, "Endpoint IVR Estado Cuenta - Éxito", chatData);
                // Retornar true para éxito
                return true;
            } else {
                // Respuesta sin estructura esperada
                logger.error({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`,
                    idChat,
                    remitente,
                    responseData: response.data,
                    responseDataType: typeof response.data,
                    responseDataString: JSON.stringify(response.data),
                    tieneResults: !!(response.data && response.data.results),
                    esArray: Array.isArray(response.data),
                    keysResponseData: response.data ? Object.keys(response.data) : []
                }, '❌ Respuesta sin estructura esperada - No se pudo extraer resultado');

                chatData.descripcion = 'La respuesta del endpoint no tiene la estructura esperada.';
                await modelChat.actualizar(idChat, "Endpoint IVR Estado Cuenta - Respuesta inválida", chatData);

                // Retornar false para ir al flujo de error
                return false;
            }
        } else {
            // Se superó el límite de intentos
            chatData.descripcion = 'Se superó el límite de intentos para el endpoint IVR Estado Cuenta.';
            await modelChat.actualizar(idChat, "Endpoint IVR Estado Cuenta - Límite intentos", chatData);

            // Retornar false para ir al flujo de error
            return false;
        }
    } catch (error) {
        const errorStatus = error.response?.status;
        if (errorStatus && errorStatus !== 200) {
            chatData.controlPeticionesIVR = (parseInt(chatData.controlPeticionesIVR) || 0) + 1;
            chatData.controlApiIVR = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error HTTP al consumir endpoint IVR Estado Cuenta - Status: ${errorStatus} (intento ${chatData.controlPeticionesIVR}/6).`;
        } else {
            chatData.controlPeticionesIVR = (parseInt(chatData.controlPeticionesIVR) || 0) + 1;
            chatData.controlApiIVR = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error al consumir endpoint IVR Estado Cuenta - Excepción: ${error.message} (intento ${chatData.controlPeticionesIVR}/6).`;
        }

        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`,
            idChat,
            remitente,
            controlPeticionesIVR: chatData.controlPeticionesIVR,
            errorStatus: errorStatus || 'N/A',
            errorMensaje: error.message
        }, 'Error al consumir endpoint IVR Estado Cuenta');

        await modelChat.actualizar(idChat, "Endpoint IVR Estado Cuenta - Error", chatData);

        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointIVREstadoCuenta`,
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            controlPeticionesIVR: chatData.controlPeticionesIVR
        }, 'Error en consumirEndpointIVREstadoCuenta');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Endpoint IVR Estado Cuenta';
        await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente, contextoArbol);

        // Retornar false para indicar error
        return false;
    }
};




//todo: Consumir Endpoint TBO Datos Cliente
const consumirEndpointTBODatosCliente = async (idChat, remitente, chatData, contextoArbol = 'arbolFacturaPago') => {
    try {
        // Control de intentos
        if (chatData.controlPeticionesTBO === undefined || chatData.controlPeticionesTBO === null || chatData.controlPeticionesTBO === '-') {
            chatData.controlPeticionesTBO = 0;
        } else {
            chatData.controlPeticionesTBO = parseInt(chatData.controlPeticionesTBO) || 0;
        }

        logger.info({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointTBODatosCliente`,
            idChat,
            remitente,
            controlPeticionesTBO: chatData.controlPeticionesTBO,
            numeroPoliza: chatData.numeroPoliza
        }, ` Intentando consumir endpoint TBO Datos Cliente (intento ${chatData.controlPeticionesTBO + 1})`);

        if (chatData.controlPeticionesTBO <= 5) {
            // Determinar el período - usar el del resultado anterior si existe
            let periodo = chatData.periodoFactura || '-';

            // Si no hay período guardado, usar el actual
            if (periodo === '-') {
                const fecha = new Date();
                periodo = `${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            }

            logger.info({
                contexto: 'model',
                recurso: `${contextoArbol}.consumirEndpointTBODatosCliente`,
                poliza: chatData.numeroPoliza,
                periodo: periodo
            }, ` Consultando datos para período: ${periodo}`);

            // Consumir servicio TBO
            const response = await serviceTBOTripleA.procesarConsultaTBO(
                chatData.numeroPoliza,
                periodo
            );

            // Error HTTP
            if (response.status !== 200) {
                chatData.controlPeticionesTBO = (parseInt(chatData.controlPeticionesTBO) || 0) + 1;
                chatData.controlApiTBO = dataEstatica.configuracion.controlApi.error;
                chatData.descripcion = `Endpoint TBO Datos Cliente presentó error HTTP status ${response.status} (intento ${chatData.controlPeticionesTBO}/6).`;

                logger.warn({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointTBODatosCliente`,
                    idChat,
                    remitente,
                    controlPeticionesTBO: chatData.controlPeticionesTBO,
                    status: response.status
                }, `Error HTTP en endpoint TBO Datos Cliente - Status: ${response.status}`);

                await modelChat.actualizar(idChat, "Endpoint TBO Datos Cliente - Error HTTP", chatData);

                const api = 'Chat Web Triple A';
                const procesoApi = 'Endpoint TBO Datos Cliente';
                await getArbolPrincipal().errorAPI(api, procesoApi, response, idChat, remitente, contextoArbol);

                return false;
            }

            // Respuesta HTTP 200 - procesar contenido
            chatData.resultadoApiTBO = typeof response.data === 'object' ? JSON.stringify(response.data) : response.data;
            chatData.controlApiTBO = dataEstatica.configuracion.controlApi.success;
            chatData.controlPeticionesTBO = 0;
            chatData.descripcion = 'Endpoint TBO Datos Cliente ejecutado exitosamente.';

            // Log de la estructura completa de la respuesta
            logger.info({
                contexto: 'model',
                recurso: `${contextoArbol}.consumirEndpointTBODatosCliente`,
                idChat,
                remitente,
                responseData: response.data,
                responseKeys: Object.keys(response.data || {}),
                hasData: !!response.data
            }, 'Estructura completa de la respuesta TBO Datos Cliente');

            if (response.data && response.data.status === false) {
                const mensaje = response.data.message || 'Registro no encontrado';

                logger.warn({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointTBODatosCliente`,
                    idChat,
                    remitente,
                    poliza: chatData.numeroPoliza,
                    mensaje: mensaje
                }, 'API TBO indica registro inexistente');

                chatData.descripcion = `Registro inexistente en TBO: ${mensaje}`;
                await modelChat.actualizar(idChat, "Endpoint TBO Datos Cliente - Registro inexistente", chatData);

                // Retornar false para activar flujo de error
                return false;
            }

            // Verificar estructura de respuesta
            let resultado = null;

            if (response.data) {
                // Intentar diferentes estructuras posibles
                if (response.data.poliza || response.data.Poliza || response.data.POLIZA) {
                    resultado = response.data;
                } else if (response.data.results && response.data.results[0]) {
                    resultado = response.data.results[0];
                } else if (response.data.data) {
                    resultado = response.data.data;
                }
            }

            if (resultado) {
                logger.info({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointTBODatosCliente`,
                    idChat,
                    remitente,
                    resultado: resultado,
                    resultadoKeys: Object.keys(resultado)
                }, 'Procesando resultado del endpoint TBO Datos Cliente');


                const obtenerValor = (obj, posiblesNombres) => {
                    for (const nombre of posiblesNombres) {
                        if (obj[nombre] !== undefined && obj[nombre] !== null && obj[nombre] !== '') {
                            logger.info({
                                nombreCampo: nombre,
                                valorEncontrado: obj[nombre]
                            }, `✅ Campo encontrado: ${nombre}`);
                            return obj[nombre];
                        }
                    }
                    return 'No disponible';
                };

                chatData.nombreCliente = obtenerValor(resultado, ['NOMBRE_CLIENTE', 'nombre', 'Nombre', 'NOMBRE', 'nombreCliente']);
                chatData.direccionCliente = obtenerValor(resultado, ['DIRECCION', 'direccion', 'Direccion', 'address']);
                chatData.fechaEmision = obtenerValor(resultado, ['FECHA_EMISION', 'fechaEmision', 'FechaEmision', 'fecha_generacion']);
                chatData.periodoFacturado = obtenerValor(resultado, ['PERIODO_FACTURADO', 'periodoFacturado', 'PeriodoFacturado', 'periodo']);

                // 🔧 LIMPIAR TOTAL_PAGAR - La API concatena el nombre con el monto
                const totalPagarRaw = obtenerValor(resultado, ['TOTAL_PAGAR', 'totalPagar', 'TotalPagar', 'total', 'valorTotal']);
                if (totalPagarRaw && totalPagarRaw !== 'No disponible') {
                    // Si contiene coma, separar y tomar solo el monto
                    if (totalPagarRaw.includes(',')) {
                        chatData.totalPagar = totalPagarRaw.split(',')[0].trim();
                        logger.info({
                            totalPagarOriginal: totalPagarRaw,
                            totalPagarLimpio: chatData.totalPagar
                        }, 'Total limpiado (API concatenaba nombre)');
                    } else {
                        chatData.totalPagar = totalPagarRaw;
                    }
                } else {
                    chatData.totalPagar = 'No disponible';
                }

                chatData.cuponPagos = obtenerValor(resultado, ['CUPON_PAGOS_MES', 'cuponPagosMes', 'CuponPagosMes', 'codigoPago']);

                // Guardar FACTURA_SERVICIO para el PDF(no se muestra en el mensaje)
                chatData.facturaServicio = obtenerValor(resultado, ['FACTURA_SERVICIO', 'facturaServicio', 'FacturaServicio', 'factura_servicio']);

                logger.info({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointTBODatosCliente`,
                    cuponPagos: chatData.cuponPagos,
                    facturaServicio: chatData.facturaServicio,
                    numeroPoliza: chatData.numeroPoliza
                }, '💾 Valores guardados para siguiente endpoint');

                logger.info({
                    nombreCliente: chatData.nombreCliente,
                    direccionCliente: chatData.direccionCliente,
                    totalPagar: chatData.totalPagar,
                    cuponPagos: chatData.cuponPagos
                }, '📊 Datos procesados correctamente');

                // Construir el mensaje con la información de la factura
                const mensajeExito = dataEstatica.mensajes.msgExitoTBODatosCliente({
                    numeroPoliza: chatData.numeroPoliza,
                    nombreCliente: chatData.nombreCliente,
                    direccionCliente: chatData.direccionCliente,
                    fechaEmision: chatData.fechaEmision,
                    periodoFacturado: chatData.periodoFacturado,
                    totalPagar: chatData.totalPagar,
                    cuponPagos: chatData.cuponPagos
                });

                await getArbolPrincipal().crearMensaje(
                    idChat,
                    remitente,
                    dataEstatica.configuracion.estadoMensaje.enviado,
                    dataEstatica.configuracion.tipoMensaje.texto,
                    mensajeExito,
                    chatData.descripcion
                );

                await modelChat.actualizar(idChat, "Endpoint TBO Datos Cliente - Éxito", chatData);
                return true;
            } else {
                // Respuesta sin estructura esperada
                logger.error({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointTBODatosCliente`,
                    idChat,
                    remitente,
                    responseData: response.data
                }, '❌ Respuesta del endpoint no tiene la estructura esperada');

                chatData.descripcion = 'La respuesta del endpoint no tiene la estructura esperada.';
                await modelChat.actualizar(idChat, "Endpoint TBO Datos Cliente - Respuesta inválida", chatData);

                return false
            }
        } else {
            // Se superó el límite de intentos
            chatData.descripcion = 'Se superó el límite de intentos para el endpoint TBO Datos Cliente.';
            await modelChat.actualizar(idChat, "Endpoint TBO Datos Cliente - Límite intentos", chatData);

            const mensajeError = `<p class='errorRegistroSolicitud'> ❌ <b>Estamos presentando dificultades técnicas.</b> 😖<br/><br/>
            🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;

            await getArbolPrincipal().crearMensaje(
                idChat,
                remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.texto,
                mensajeError,
                chatData.descripcion
            );

            return await getArbolPrincipal().procesarMensajeAISoul(idChat, remitente, 'Necesito ayuda con mi servicio', contextoArbol);
        }
    } catch (error) {
        const errorStatus = error.response?.status;
        if (errorStatus && errorStatus !== 200) {
            chatData.controlPeticionesTBO = (parseInt(chatData.controlPeticionesTBO) || 0) + 1;
            chatData.controlApiTBO = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error HTTP al consumir endpoint TBO Datos Cliente - Status: ${errorStatus} (intento ${chatData.controlPeticionesTBO}/6).`;
        } else {
            chatData.controlPeticionesTBO = (parseInt(chatData.controlPeticionesTBO) || 0) + 1;
            chatData.controlApiTBO = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error al consumir endpoint TBO Datos Cliente - Excepción: ${error.message} (intento ${chatData.controlPeticionesTBO}/6).`;
        }

        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointTBODatosCliente`,
            idChat,
            remitente,
            controlPeticionesTBO: chatData.controlPeticionesTBO,
            errorStatus: errorStatus || 'N/A',
            errorMensaje: error.message,
            errorStack: error.stack
        }, '❌ Error al consumir endpoint TBO Datos Cliente');

        await modelChat.actualizar(idChat, "Endpoint TBO Datos Cliente - Error", chatData);

        const api = 'Chat Web Triple A';
        const procesoApi = 'Endpoint TBO Datos Cliente';
        await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente, contextoArbol);

        if (chatData.controlPeticionesTBO > 5) {
            return await getArbolPrincipal().procesarMensajeAISoul(idChat, remitente, 'Necesito ayuda con mi servicio', contextoArbol);
        }

        return false;
    }
};

//todo: Guardar PDF en carpeta send
const guardarPDFEnSend = async (idChat, remitente, pdfBase64, nombreArchivo, contextoArbol = 'arbolFacturaPago') => {
    try {
        const carpetaBase = path.join(__dirname, '../../../uploads/files');
        const carpetaChat = path.join(carpetaBase, `${idChat}-${remitente}`);
        const carpetaSend = path.join(carpetaChat, 'send');

        logger.info({
            contexto: 'model',
            recurso: `${contextoArbol}.guardarPDFEnSend`,
            carpetaSend
        }, '📂 Creando estructura de carpetas para PDF');

        await fs.mkdir(carpetaSend, { recursive: true });

        const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
        const timestamp = Date.now();
        const nombreFinal = `${timestamp}_${nombreArchivo}`;
        const rutaCompleta = path.join(carpetaSend, nombreFinal);

        await fs.writeFile(rutaCompleta, base64Data, 'base64');

        const rutaRelativa = `/${idChat}-${remitente}/send/${nombreFinal}`;

        logger.info({
            contexto: 'model',
            recurso: `${contextoArbol}.guardarPDFEnSend`,
            rutaRelativa
        }, '✅ PDF guardado exitosamente');

        return {
            exito: true,
            rutaRelativa,
            nombreArchivo: nombreFinal
        };

    } catch (error) {
        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.guardarPDFEnSend`,
            errorMensaje: error.message
        }, '❌ Error al guardar PDF');

        throw error;
    }
};


// todo: Consumir endpoint TBO Copia Factura
const consumirEndpointTBOCopiaFactura = async (idChat, remitente, chatData, contextoArbol = 'arbolFacturaPago') => {
    try {
        // Control de intentos (usar contador general de controlPeticiones para este endpoint)
        if (chatData.controlPeticiones === undefined || chatData.controlPeticiones === null || chatData.controlPeticiones === '-') {
            chatData.controlPeticiones = 0;
        } else {
            chatData.controlPeticiones = parseInt(chatData.controlPeticiones) || 0;
        }

        logger.info({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointTBOCopiaFactura`,
            idChat,
            remitente,
                controlPeticiones: chatData.controlPeticiones
        }, `🔄 Intentando consumir endpoint TBO Copia Factura (intento ${chatData.controlPeticiones + 1})`);

        if (chatData.controlPeticiones <= 5) {
            // Validar invoice
            const invoice = chatData.facturaServicio || chatData.numeroPoliza;
            if (!invoice || invoice === '-' || invoice === 'No disponible') {
                logger.error({
                    contexto: 'model',
                    recurso: `${contextoArbol}.consumirEndpointTBOCopiaFactura`,
                    idChat,
                    remitente
                }, '❌ No se encontró número de factura');

                chatData.descripcion = 'No se encontró número de factura para generar el PDF.';
                await modelChat.actualizar(idChat, "Endpoint TBO Copia Factura - Sin invoice", chatData);

                const mensajeError = `<p class='errorSinFactura'> ❌ <b>No pudimos generar tu PDF.</b> 😖<br/><br/>
                No encontramos un número de factura o póliza asociado a tu cuenta.<br/><br/>
                🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;

                await getArbolPrincipal().crearMensaje(
                    idChat,
                    remitente,
                    dataEstatica.configuracion.estadoMensaje.enviado,
                    dataEstatica.configuracion.tipoMensaje.pasoAgente,
                    mensajeError,
                    chatData.descripcion
                );

                // Ya se pasó a asesor, no continuar flujo del árbol
                await getArbolPrincipal().procesarMensajeAISoul(
                    idChat,
                    remitente,
                    'No se encontró mi número de factura',
                    chatData,
                    contextoArbol
                );
                return false;
            }

            logger.info({
                contexto: 'model',
                recurso: `${contextoArbol}.consumirEndpointTBOCopiaFactura`,
                invoice
            }, `📄 Consultando PDF para factura: ${invoice}`);

            // // 🧪 MODO PRUEBA - DESCOMENTAR PARA PROBAR FLUJO DE ERROR
            // logger.warn({ contexto: 'model', recurso: `${contextoArbol}.consumirEndpointTBOCopiaFactura`, idChat, remitente }, '🧪 MODO PRUEBA: Simulando respuesta sin PDF');
            // chatData.descripcion = '[PRUEBA] La respuesta del endpoint no contiene PDF.';
            // await modelChat.actualizar(idChat, "Endpoint TBO Copia Factura - Sin PDF [PRUEBA]", chatData);

            // const mensajeError = `<p class='errorSinPDF'> ❌ <b>No pudimos obtener tu PDF.</b> 😖<br/><br/>
            // La respuesta del sistema no contiene el archivo PDF.<br/><br/>
            // 🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;

            // await getArbolPrincipal().crearMensaje(
            //     idChat,
            //     remitente,
            //     dataEstatica.configuracion.estadoMensaje.enviado,
            //     dataEstatica.configuracion.tipoMensaje.texto,
            //     mensajeError,
            //     chatData.descripcion
            // );

            // return await getArbolPrincipal().procesarMensajeAISoul(idChat, remitente, 'No se encontró el PDF de mi factura', contextoArbol);
            // // FIN MODO PRUEBA

            // Consumir servicio
            const response = await serviceTBOTripleA.procesarConsultaTBOCopiaFactura(invoice);

            // Validar status HTTP
            if (response.status !== 200) {
                // Solo reintentar errores transitorios (server errors y timeouts)
                const erroresTransitorios = [500, 502, 503, 504, 408, 429];

                if (erroresTransitorios.includes(response.status)) {
                    // Error transitorio -  reintentar
                    chatData.controlPeticiones = (parseInt(chatData.controlPeticiones) || 0) + 1;
                    chatData.controlApi = dataEstatica.configuracion.controlApi.error;
                    chatData.descripcion = `Error HTTP transitorio ${response.status} (intento ${chatData.controlPeticiones}/6).`;

                    logger.warn({
                        contexto: 'model',
                        recurso: `${contextoArbol}.consumirEndpointTBOCopiaFactura`,
                        idChat,
                        remitente,
                        controlPeticiones: chatData.controlPeticiones,
                        status: response.status
                    }, `Error HTTP transitorio en endpoint TBO Copia Factura - Status: ${response.status}`);

                    await modelChat.actualizar(idChat, "Endpoint TBO Copia Factura - Error HTTP Transitorio", chatData);

                    const api = 'Chat Web Triple A';
                    const procesoApi = 'Endpoint TBO Copia Factura';
                    await getArbolPrincipal().errorAPI(api, procesoApi, response, idChat, remitente, contextoArbol);

                    return false;
                } else {
                    // Error permanente (400, 404, 401, etc) - no reintentar
                    chatData.controlApiTBOPDF = dataEstatica.configuracion.controlApi.error;
                    chatData.descripcion = `Error HTTP permanente ${response.status} - No se reintentará.`;

                    logger.error({
                        contexto: 'model',
                        recurso: `${contextoArbol}.consumirEndpointTBOCopiaFactura`,
                        idChat,
                        remitente,
                        status: response.status
                    }, `Error HTTP permanente en endpoint TBO Copia Factura - Status: ${response.status}`);

                    await modelChat.actualizar(idChat, "Endpoint TBO Copia Factura - Error HTTP Permanente", chatData);

                    const api = 'Chat Web Triple A';
                    const procesoApi = 'Endpoint TBO Copia Factura';
                    await getArbolPrincipal().errorAPI(api, procesoApi, response, idChat, remitente, contextoArbol);

                    return false;
                }
            }

            // Actualizar estado exitoso
            chatData.resultadoApiTBOPDF = typeof response.data === 'object' ? JSON.stringify(response.data) : response.data;
            chatData.controlApiTBOPDF = dataEstatica.configuracion.controlApi.success;
            chatData.controlPeticiones = 0; // Resetear contador general en caso de éxito HTTP 200
            chatData.descripcion = 'Endpoint TBO Copia Factura ejecutado exitosamente.';

            // Validar respuesta con error
            if (response.data?.status === false) {
                const mensaje = response.data.message || 'No se pudo generar el PDF';  
                chatData.descripcion = `Error al generar PDF: ${mensaje}`;
                await modelChat.actualizar(idChat, "Endpoint TBO Copia Factura - Error generando PDF", chatData);

                const mensajeError = `<p class='errorGenerarPDF'> ❌ <b>No pudimos generar tu PDF.</b> 😖<br/><br/>
                🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;

                await getArbolPrincipal().crearMensaje(
                    idChat,
                    remitente,
                    dataEstatica.configuracion.estadoMensaje.enviado,
                    dataEstatica.configuracion.tipoMensaje.pasoAgente,
                    mensajeError,
                    chatData.descripcion
                );

                // Ya se pasó a asesor, no continuar flujo del árbol
                await getArbolPrincipal().procesarMensajeAISoul(
                    idChat,
                    remitente,
                    'No se pudo generar mi PDF de factura',
                    chatData,
                    contextoArbol
                );
                return false;
            }

            // Extraer contenido
            const pdfUrl = response.data.url || response.data.pdf_url || response.data.link;
            const base64 = response.data.pdf || response.data.file || response.data.content || response.data.document;

            // CASO 1: PDF en Base64 - Guardar en servidor
            if (base64) {
                const nombreArchivo = `factura_${invoice}.pdf`;

                try {
                    const resultado = await guardarPDFEnSend(idChat, remitente, base64, nombreArchivo, contextoArbol);

                    if (resultado.exito) {
                        if (chatData.rutaAdjuntos && chatData.rutaAdjuntos !== '-') {
                            chatData.rutaAdjuntos = `${chatData.rutaAdjuntos}|${resultado.rutaRelativa}`;
                        } else {
                            chatData.rutaAdjuntos = resultado.rutaRelativa;
                        }
                        chatData.adjuntos = 'Si';
                        chatData.urlPDFFactura = resultado.rutaRelativa;

                        const APP_URL = process.env.APP_URL || '';
                        let rutaEnlace = resultado.rutaRelativa.startsWith('/') ? `/files${resultado.rutaRelativa}` : `/files/${resultado.rutaRelativa}`;
                        const rutaCompleta = `${APP_URL}/uploads${rutaEnlace}`;

                        const mensaje = dataEstatica.mensajes.msgExitoTBOCopiaFacturaPDF({
                            rutaCompleta,
                            nombreArchivo
                        });

                        await getArbolPrincipal().crearMensaje(
                            idChat,
                            remitente,
                            dataEstatica.configuracion.estadoMensaje.enviado,
                            dataEstatica.configuracion.tipoMensaje.texto,
                            mensaje,
                            'PDF guardado y listo'
                        );

                        await modelChat.actualizar(idChat, "Endpoint TBO Copia Factura - PDF Guardado", chatData);
                        return true;
                    }
                } catch (errorGuardado) {
                    logger.error({ errorMensaje: errorGuardado.message }, 'Error al guardar PDF - usando fallback');

                    // Fallback: Base64 directo
                     const pdfBase64 = `data:application/pdf;base64,${base64}`;
                    if (chatData.rutaAdjuntos && chatData.rutaAdjuntos !== '-') {
                        chatData.rutaAdjuntos = `${chatData.rutaAdjuntos}|${pdfBase64}`;
                    } else {
                        chatData.rutaAdjuntos = pdfBase64;
                    }
                    chatData.adjuntos = 'Si';
                    chatData.urlPDFFactura = pdfBase64;

                    const mensaje = dataEstatica.mensajes.msgExitoTBOCopiaFacturaPDF({
                        rutaCompleta: pdfBase64,
                        nombreArchivo
                    });

                    await getArbolPrincipal().crearMensaje(
                        idChat,
                        remitente,
                        dataEstatica.configuracion.estadoMensaje.enviado,
                        dataEstatica.configuracion.tipoMensaje.texto,
                        mensaje,
                        'PDF base64 directo (fallback)'
                    );

                    await modelChat.actualizar(idChat, "Endpoint TBO Copia Factura - Fallback Base64", chatData);
                    return true;
                }
            }

            // CASO 2: URL del PDF
            if (pdfUrl) {
                if (chatData.rutaAdjuntos && chatData.rutaAdjuntos !== '-') {
                    chatData.rutaAdjuntos = `${chatData.rutaAdjuntos}|${pdfUrl}`;
                } else {
                    chatData.rutaAdjuntos = pdfUrl;
                }
                chatData.adjuntos = 'Si';
                chatData.urlPDFFactura = pdfUrl;

                const mensaje = dataEstatica.mensajes.msgExitoTBOCopiaFacturaPDF({
                    rutaCompleta: pdfUrl,
                    nombreArchivo: `factura_${invoice}.pdf`
                });

                await getArbolPrincipal().crearMensaje(
                    idChat,
                    remitente,
                    dataEstatica.configuracion.estadoMensaje.enviado,
                    dataEstatica.configuracion.tipoMensaje.texto,
                    mensaje,
                    chatData.descripcion
                );

                await modelChat.actualizar(idChat, "Endpoint TBO Copia Factura - Éxito", chatData);
                return true;
            }

            // CASO 3: Sin PDF
            logger.error({
                contexto: 'model',
                recurso: `${contextoArbol}.consumirEndpointTBOCopiaFactura`,
                idChat,
                remitente,
                responseData: response.data
            }, '❌ Respuesta sin URL ni Base64');

            chatData.descripcion = 'La respuesta no contiene PDF.';
            await modelChat.actualizar(idChat, "Endpoint TBO Copia Factura - Sin PDF", chatData);

            const mensajeError = `<p class='errorSinPDF'> ❌ <b>No pudimos obtener tu PDF.</b> 😖<br/><br/>
            La respuesta del sistema no contiene el archivo PDF.<br/><br/>
            🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;

            await getArbolPrincipal().crearMensaje(
                idChat,
                remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                mensajeError,
                chatData.descripcion
            );

            // Ya se pasó a asesor, no continuar flujo del árbol
            await getArbolPrincipal().procesarMensajeAISoul(
                idChat,
                remitente,
                'No se encontró el PDF de mi factura',
                chatData,
                contextoArbol
            );
            return false;



        } else {
            // Se superó el límite de intentos
            chatData.descripcion = 'Se superó el límite de intentos para el endpoint TBO Copia Factura.';
            await modelChat.actualizar(idChat, "Endpoint TBO Copia Factura - Límite intentos", chatData);

            const mensajeError = `<p class='errorGenerarPDF'> ❌ <b>Estamos presentando dificultades técnicas.</b> 😖<br/><br/>
            🤖Para ayudarte mejor, te conectaré con un agente en breve. ⏳</p>`;

            await getArbolPrincipal().crearMensaje(
                idChat,
                remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.pasoAgente,
                mensajeError,
                chatData.descripcion
            );

            // Ya se pasó a asesor, no continuar flujo del árbol
            await getArbolPrincipal().procesarMensajeAISoul(
                idChat,
                remitente,
                'Necesito ayuda para obtener mi factura en PDF',
                chatData,
                contextoArbol
            );
            return false;
        }

    } catch (error) {
        const errorStatus = error.response?.status;
        if (errorStatus && errorStatus !== 200) {
            chatData.controlPeticiones = (parseInt(chatData.controlPeticiones) || 0) + 1;
            chatData.controlApiTBOPDF = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error HTTP al consumir endpoint TBO Copia Factura - Status: ${errorStatus} (intento ${chatData.controlPeticiones}/6).`;
        } else {
            chatData.controlPeticiones = (parseInt(chatData.controlPeticiones) || 0) + 1;
            chatData.controlApiTBOPDF = dataEstatica.configuracion.controlApi.error;
            chatData.descripcion = `Error al consumir endpoint TBO Copia Factura - Excepción: ${error.message} (intento ${chatData.controlPeticiones}/6).`;
        }

        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointTBOCopiaFactura`,
            idChat,
            remitente,
            controlPeticiones: chatData.controlPeticiones,
            errorStatus: errorStatus || 'N/A',
            errorMensaje: error.message
        }, ' Error al consumir endpoint TBO Copia Factura');

        await modelChat.actualizar(idChat, "Endpoint TBO Copia Factura - Error", chatData);

        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.consumirEndpointTBOCopiaFactura`,
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            controlPeticiones: chatData.controlPeticiones
        }, 'Error en consumirEndpointTBOCopiaFactura');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Endpoint TBO Copia Factura';
        await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente, contextoArbol);

        // Si se superó el límite de intentos, pasar a asesor y NO continuar flujo del árbol
        if (chatData.controlPeticiones > 5) {
            await getArbolPrincipal().procesarMensajeAISoul(
                idChat,
                remitente,
                'Necesito ayuda para obtener mi factura en PDF',
                chatData,
                contextoArbol
            );
            return false;
        }

        return false;
    }
};


// todo: Mostrar Submenu 
const mostrarSubmenu = async (idChat, remitente, submenuId, chatData, contextoArbol = 'arbolFacturaPago') => {
    // Si el siguiente paso es pasar a agente (Interaccion AI Soul)
    if (submenuId === 'Interaccion AI Soul') {
        chatData.descripcion = 'Usuario completó inputs - Pasando a agente';
        chatData.adjuntos = 'No';
        chatData.rutaAdjuntos = '-';

        // IMPORTANTE: Registrar el paso del submenu anterior en la conversación antes de pasar a agente
        // Esto garantiza que el resumen del flujo incluya el submenu (ej: "Aclaración factura")
        if (chatData.submenuAnteriorId && chatData.submenuAnteriorId !== '-') {
            const submenuAnterior = SUBMENUS_CONFIG[chatData.submenuAnteriorId];
            if (submenuAnterior && submenuAnterior.pasoArbol) {
                // CRÍTICO: Actualizar temporalmente el estado del chat al paso del submenu anterior
                // para que crearMensaje registre correctamente el paso en la conversación
                await modelChat.actualizar(idChat, submenuAnterior.pasoArbol, chatData);
                
                // Registrar el paso del submenu en la conversación
                await getArbolPrincipal().crearMensaje(
                    idChat, remitente,
                    dataEstatica.configuracion.estadoMensaje.enviado,
                    dataEstatica.configuracion.tipoMensaje.texto,
                    submenuAnterior.mensaje || submenuAnterior.descripcion,
                    submenuAnterior.descripcion
                );
                
                logger.info({
                    contexto: 'model',
                    recurso: 'arbolFacturaPago.mostrarSubmenu',
                    idChat,
                    remitente,
                    submenuAnteriorId: chatData.submenuAnteriorId,
                    pasoArbol: submenuAnterior.pasoArbol
                }, '📝 Registrando paso del submenu anterior en conversación antes de pasar a agente');
            }
            // Limpiar el submenuAnteriorId después de usarlo
            chatData.submenuAnteriorId = '-';
        }

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
                recurso: 'arbolFacturaPago.mostrarSubmenu',
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
            contexto: 'model',
            recurso: 'arbolFacturaPago.mostrarSubmenu',
            submenuId,
            idChat,
            remitente
        }, `Submenú no encontrado: ${submenuId}`);
        return false;
    }

    // ===== MANEJO DE ENDPOINTS =====
    if (submenu.tipo === 'endpoint') {
        // Verificar si ya se procesó exitosamente este endpoint (evitar duplicados)
        if (chatData.numeroReporte && chatData.numeroReporte !== '-') {
            logger.warn({
                contexto: 'model',
                recurso: 'arbolFacturaPago.mostrarSubmenu',
                idChat,
                remitente,
                submenuId,
                numeroReporte: chatData.numeroReporte
            }, 'Endpoint ya fue procesado exitosamente, evitando duplicado');

            // Si es endpoint_ivr_estado_cuenta y ya se procesó, ir a opciones_saldo_factura
            if (submenuId === 'endpoint_ivr_estado_cuenta' && submenu.siguienteExito) {
                return await mostrarSubmenu(idChat, remitente, submenu.siguienteExito, chatData, contextoArbol);
            }

            if (submenu.avanceAutomatico) {
                return await mostrarSubmenu(idChat, remitente, submenu.avanceAutomatico, chatData, contextoArbol);
            }
            return true;
        }

        // Determinar qué endpoint consumir según el submenuId
        let resultadoEndpoint = false;

        if (submenuId === 'endpoint_info_cliente_saldo') {
            resultadoEndpoint = await consumirEndpointInfoCliente(idChat, remitente, chatData, contextoArbol);
        }
        else if (submenuId === 'endpoint_info_cliente_descarga') {
            resultadoEndpoint = await consumirEndpointInfoCliente(idChat, remitente, chatData, contextoArbol);
        }
        else if (submenuId === 'endpoint_ivr_estado_cuenta') {
            resultadoEndpoint = await consumirEndpointIVREstadoCuenta(idChat, remitente, chatData, contextoArbol);

            if (!resultadoEndpoint && submenu.siguienteError) {
                return await mostrarSubmenu(idChat, remitente, submenu.siguienteError, chatData, contextoArbol);
            }

            if (resultadoEndpoint && submenu.siguienteExito) {
                return await mostrarSubmenu(idChat, remitente, submenu.siguienteExito, chatData, contextoArbol);
            }

            return resultadoEndpoint;
        }
        else if (submenuId === 'endpoint_tbo_datos_cliente') {
            resultadoEndpoint = await consumirEndpointTBODatosCliente(idChat, remitente, chatData, contextoArbol);

            if (!resultadoEndpoint && submenu.siguienteError) {
                return await mostrarSubmenu(idChat, remitente, submenu.siguienteError, chatData, contextoArbol);
            }

            if (resultadoEndpoint && submenu.siguienteExito) {
                return await mostrarSubmenu(idChat, remitente, submenu.siguienteExito, chatData, contextoArbol);
            }

            return resultadoEndpoint;
        }
        else if (submenuId === 'endpoint_tbo_copia_factura') {
            resultadoEndpoint = await consumirEndpointTBOCopiaFactura(idChat, remitente, chatData, contextoArbol);
        }

        // Si el endpoint fue exitoso y hay avance automático, continuar
        if (resultadoEndpoint && submenu.avanceAutomatico) {
            return await mostrarSubmenu(idChat, remitente, submenu.avanceAutomatico, chatData, contextoArbol);
        }

        if (!resultadoEndpoint) {
            return false;
        }

        return true;
    }

    chatData.descripcion = submenu.descripcion;

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
            return await getArbolPrincipal().cerrarChatConDespedida(idChat, remitente, chatData, 'arbolFacturaPago');
        } else if (submenu.siguiente === 'menu_principal') {
            return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
        } else if (submenu.siguiente) {
            return await mostrarSubmenu(idChat, remitente, submenu.siguiente, chatData);
        }

        return true;
    }

    if (submenu.tipo === 'input_multiple' && submenu.inputKey && submenu.inputKey.length > 0) {
        logger.info({
            contexto: 'model',
            recurso: 'arbolFacturaPago.mostrarSubmenu',
            submenuActual: submenuId,
            inputsRequeridos: submenu.inputKey
        }, '⚡ Iniciando secuencia de inputs automáticamente');

        // CRÍTICO: Actualizar el estado del chat PRIMERO para que crearMensaje registre correctamente el paso
        // Esto garantiza que el resumen del flujo incluya el submenu (ej: "Aclaración factura")
        await modelChat.actualizar(idChat, submenu.pasoArbol, chatData);

        // Luego, mostrar el mensaje introductorio del submenú (si existe),
        // similar a como se hace en otros árboles como Trámite.
        if (submenu.mensaje) {
            await getArbolPrincipal().crearMensaje(
                idChat,
                remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.texto,
                submenu.mensaje,
                chatData.descripcion
            );
        }

        // Guardar la secuencia completa y el destino final
        chatData.inputsSecuencia = JSON.stringify(submenu.inputKey);
        chatData.submenuPendiente = submenu.siguiente;

        // Guardar el submenuId actual para registrarlo en la conversación cuando se complete el input_multiple
        // Esto garantiza que el resumen del flujo incluya el submenu (ej: "Aclaración factura")
        if (submenu.siguiente === 'mensaje_asesor') {
            chatData.submenuAnteriorId = submenuId;
            logger.info({
                contexto: 'model',
                recurso: 'arbolFacturaPago.mostrarSubmenu',
                submenuId,
                siguiente: submenu.siguiente
            }, '💾 Guardando submenuAnteriorId para registro en conversación al pasar a agente');
        }

        // Guardar mensajeContextoIA si existe y el siguiente paso es mensaje_asesor
        // Esto garantiza que la solicitud del cliente se envíe dinámicamente al servicio de soulchat
        if (submenu.mensajeContextoIA && submenu.siguiente === 'mensaje_asesor') {
            chatData.mensajeContextoIAPendiente = submenu.mensajeContextoIA;
            logger.info({
                contexto: 'model',
                recurso: 'arbolFacturaPago.mostrarSubmenu',
                submenuId,
                mensajeContextoIA: submenu.mensajeContextoIA
            }, '💾 Guardando mensajeContextoIA para uso al pasar a agente');
        }

        // Para esta secuencia queremos que cada pregunta use la cabecera propia
        // del input (como en Trámite), no el mensaje introductorio del submenú.
        chatData.mensajePersonalizadoEnCurso = '-';

        // Indicar si es una secuencia de múltiples inputs
        chatData.esSecuenciaMultiple = submenu.inputKey.length > 1 ? 'true' : 'false';

        // Solicitar el primer input de la secuencia (ej: primero número de póliza)
        return await solicitarInputUsuario(
            idChat,
            remitente,
            submenu.inputKey[0],
            submenu.siguiente,
            chatData,
            'arbolFacturaPago',
            null
        );
    }

    // ===== PASAR_AGENTE =====
    if (submenu.tipo === 'pasar_agente') {
        // Solo actualizar estado, el mensaje lo mostrará procesarRespuestaSubmenu
        await modelChat.actualizar(idChat, submenu.pasoArbol, chatData);

        // Llamar directamente a procesarRespuestaSubmenu para manejar el pasar_agente
        return await procesarRespuestaSubmenu(idChat, remitente, '', chatData, submenuId, 'arbolFacturaPago');
    }

    await modelChat.actualizar(idChat, submenu.pasoArbol, chatData);

    // Validar que el mensaje exista antes de crearlo
    if (!submenu.mensaje) {
        logger.error({
            contexto: 'model',
            recurso: 'arbolFacturaPago.mostrarSubmenu',
            submenuId,
            idChat,
            remitente
        }, `❌ Submenú ${submenuId} no tiene mensaje definido`);
        
        const mensajeError = `<p>Lo sentimos, hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.</p>`;
        await getArbolPrincipal().crearMensaje(
            idChat, remitente,
            dataEstatica.configuracion.estadoMensaje.enviado,
            dataEstatica.configuracion.tipoMensaje.texto,
            mensajeError,
            chatData.descripcion
        );
        return false;
    }

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
            recurso: 'arbolFacturaPago.mostrarSubmenu',
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
                contexto: 'model', recurso: 'arbolFacturaPago.procesarRespuestaSubmenu',
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

            const mensajeContexto = submenu.mensajeContextoIA ||
                `El usuario necesita asistencia. Contexto: ${submenu.descripcion}`;


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

            // TIPO: ENDPOINT (Consumir endpoint y continuar)
            if (opcion.tipo === 'endpoint') {
                chatData.descripcion = opcion.descripcion || `Usuario seleccionó opción ${contenidoNormalized}`;

                // ACTUALIZAR ESTADO DEL CHAT INMEDIATAMENTE para evitar procesamiento duplicado
                // Esto previene que si el usuario envía la misma respuesta dos veces, solo se procese una vez
                const pasoArbolEndpoint = `Procesando Endpoint - ${opcion.siguiente}`;
                await modelChat.actualizar(idChat, pasoArbolEndpoint, chatData);

                logger.info({
                    contexto: 'model',
                    recurso: 'arbolFacturaPago.procesarRespuestaSubmenu',
                    idChat,
                    remitente,
                    siguiente: opcion.siguiente,
                    pasoArbolActualizado: pasoArbolEndpoint
                }, `Avanzando a endpoint: ${opcion.siguiente} - Estado actualizado para prevenir duplicados`);

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

                // Guardar mensajeContextoIA si existe y el siguiente paso es mensaje_asesor
                // Esto garantiza que la solicitud del cliente se envíe dinámicamente al servicio de soulchat
                if (opcion.mensajeContextoIA && opcion.siguiente === 'mensaje_asesor') {
                    chatData.mensajeContextoIAPendiente = opcion.mensajeContextoIA;
                    logger.info({
                        contexto: 'model',
                        recurso: 'arbolFacturaPago.procesarRespuestaSubmenu',
                        opcion: contenidoNormalized,
                        mensajeContextoIA: opcion.mensajeContextoIA
                    }, '💾 Guardando mensajeContextoIA para uso al pasar a agente');
                }

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
                } else if (opcion.siguiente === 'cerrar_chat') {
                    return await getArbolPrincipal().cerrarChatConDespedida(idChat, remitente, chatData, contextoArbol);
                } else if (opcion.siguiente) {
                    return await mostrarSubmenu(idChat, remitente, opcion.siguiente, chatData);
                }

                return true;
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



const solicitarInputUsuario = async (idChat, remitente, campoKey, submenuSiguiente, chatData, contextoArbol, mensajePersonalizado = null) => {
    try {
        // Obtener configuración desde dataEstatica usando la KEY
        const inputConfig = dataEstatica.inputsConfig[campoKey];

        if (!inputConfig) {
            throw new Error(`Configuración de input no encontrada para: ${campoKey}`);
        }

        const pasoArbol = `Solicitar Input Factura Pago ${inputConfig.campo}`;
        chatData.descripcion = `Solicitando: ${inputConfig.campo}`;
        chatData.mensajePersonalizadoEnCurso = mensajePersonalizado || '-';

        // Guardar contexto en campos dedicados 
        chatData.inputEnCurso = inputConfig.campo;
        chatData.submenuPendiente = submenuSiguiente || inputConfig.submenuSiguiente || '-';

        await modelChat.actualizar(idChat, pasoArbol, chatData);

        // Usar SOLO un mensaje:
        // - Si viene mensajePersonalizado (por ejemplo, numeroPolizaFactura), se envía ese.
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
        const procesoApi = `Solicitar Input FacturaPago - ${inputConfig.campo}`;
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
    arbolFacturaPago,
    solicitarMenuArbolFacturaPago,
    procesarMenuArbolFacturaPago,
};