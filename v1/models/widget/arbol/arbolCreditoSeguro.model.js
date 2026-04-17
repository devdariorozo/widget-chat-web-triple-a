// ! ================================================================================================================================================
// !                                                      MODELOS PARA ARBOL CHAT BOT - CREDITOS Y SEGUROS
// ! ================================================================================================================================================
// @autor Ramón Dario Rozo Torres
// @última­Modificación Ramón Dario Rozo Torres
// @versión 1.0.0
// v1/models/widget/arbol/arbolCreditoSeguro.model.js

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
    relacionPredio: '-',
};



const SUBMENUS_CONFIG = {


    // ===== FINANCIACION NO BANCARIA =====
    financiacion_no_bancaria: {
        pasoArbol: "Procesar Submenu Credito Seguro financiacion_no_bancaria",
        descripcion: 'Usuario en: Financiación No Bancaria',
        mensaje: dataEstatica.mensajes.financiacionNoBancaria,
        opciones: {
            '1': {
                pasoArbol: "Procesar Submenu Credito Seguro consultar_cupo_disponible",
                descripcion: 'Usuario en: Consultar cupo disponible',
                tipo: 'input_multiple',
                inputKey: ['numeroPoliza','nombresApellidos','relacionPredio'],
                mensaje: dataEstatica.mensajes.consultarCupoDisponible,
                siguiente:'mensaje_asesor',
                mensajeContextoIA: 'El usuario ha solicitado consultar cupo disponible para Financiación No Bancaria.'
            },
            '2': {
                pasoArbol: "Procesar Submenu Credito Seguro solicitar_asesor",
                descripcion: 'Usuario en: Solicitar asesor',
                tipo: 'input_multiple',
                inputKey: ['nombresApellidos','numeroPoliza'],
                mensaje: dataEstatica.mensajes.solicitarAsesorFinanciacionNoBancaria,
                siguiente:'mensaje_asesor',
                mensajeContextoIA: 'El usuario ha solicitado un asesor para Financiación No Bancaria.'
            },
            '3': {
                tipo: 'avanzar',
                pasoArbol: "Procesar Submenu Credito Seguro todo_sobre_DILO",
                descripcion: 'Usuario en: Todo sobre DILO',
                mensajeAvance: dataEstatica.mensajes.todoSobreDILO,
                siguiente:"cerrar_chat"
            }
        }
    },


    // ===== SEGUROS FAMILIA SEGURA =====
    seguros_familia_segura: {
        pasoArbol: "Procesar Submenu Credito Seguro seguros_familia_segura",
        descripcion: 'Usuario en: Seguros Familia Segura',
        mensaje: dataEstatica.mensajes.segurosFamiliaSegura,
        opciones: {
            '1': { 
                tipo: 'input_multiple',
                descripcion: 'Usuario en: Información activación seguros',
                inputKey: ['numeroPoliza','nombresApellidos'],
                mensaje: dataEstatica.mensajes.infoActivacionSeguros,
                siguiente:'mensaje_asesor',
                mensajeContextoIA:'El Usuario ha solicitado un asesor para Seguros Familia Segura'
            },
            '2': { 
                tipo: 'avanzar',
                descripcion: 'Usuario en: Ampliar información de tus productos',
                mensajeAvance: dataEstatica.mensajes.ampliarInfoProductos,
                siguiente:'cerrar_chat'
            },
            '3': { 
                tipo: 'avanzar',
                descripcion: 'Usuario en: Solicitud de indemnización',
                mensajeAvance: dataEstatica.mensajes.solicitudIndemnizacion,
                siguiente:'cerrar_chat'
            },
        }
    },

    // ===== PLAN PREVISION EXEQUIAL =====
    plan_prevision_exequial: {
        pasoArbol: "Procesar Submenu Credito Seguro plan_prevision_exequial",
        descripcion: 'Usuario en: Plan Previsión Exequial',
        mensaje: dataEstatica.mensajes.planPrevisionExequial,
        opciones: {
            '1': { 
                tipo: 'simple',
                descripcion: 'Usuario en Conocer o activar planes disponibles',
                siguiente: 'conocer_activar_planes'
            },
            '2': { 
                tipo: 'avanzar',
                descripcion: 'Usuario en: Ampliar información de tus productos',
                mensajeAvance: dataEstatica.mensajes.ampliarInfoProductosPrevision,
                siguiente:'cerrar_chat'
            }
        }
    },

    // ===== CONOCER ACTIVAR PLANES (SUBMENÚ) =====
    conocer_activar_planes: {
        pasoArbol: "Procesar Submenu Credito Seguro conocer_activar_planes",
        descripcion: 'Usuario en: Información planes exequiales',
        mensaje: dataEstatica.mensajes.conocerActivarPlanes,
        opciones: {
            '1': {
                tipo: 'avanzar',
                descripcion: 'Usuario continúa - Solicitar asesor',
                siguiente: 'mensaje_asesor',
                mensajeContextoIA:'El Usuario ha solicitado un asesor para Plan Previsión Exequial'

            }
        }
    },




    // ===== MENSAJE ASESOR =====
    mensaje_asesor: {
        tipo: 'pasar_agente',
        pasoArbol: "Procesar Submenu Credito Seguro mensaje_asesor",
        descripcion: 'Usuario solicita asesor - Pasando a agente',
        mensaje: dataEstatica.mensajes.mensajeAsesor,
        mensajeContextoIA: 'El usuario ha solicitado un asesor para Créditos y Seguros.', 
        requiereAdjuntos: true,
    }

}

// ! MODELOS
// * ARBOL CHAT BOT - Credito Seguro
const arbolCreditoSeguro = async (idChat, remitente, arbolChat,contenido, chatData, contextoArbol='arbolCreditoSeguro') => {

    try {

        // todo: Primera vez que entra al árbol
        if (arbolChat === "Solicitar Arbol Credito Seguro") {
            return await solicitarMenuArbolCreditoSeguro(idChat, remitente, chatData, contextoArbol)
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
            arbolChat === "Solicitar Menu Arbol Credito Seguro" ||
            arbolChat === dataEstatica.arbol.alertaNoEntiendo
        ) {
            return await procesarMenuArbolCreditoSeguro(idChat, remitente, contenido, chatData, contextoArbol)
        }

        // todo: Manejo de errores en submenús
        if (arbolChat.startsWith("Alerta No Entiendo - Submenu Credito Seguro ")) {
            const submenuId = arbolChat.replace("Alerta No Entiendo - Submenu Credito Seguro ", "")
            return await procesarRespuestaSubmenu(
                idChat, remitente, contenido, chatData, submenuId, contextoArbol
            )
        }

        // todo: Procesando respuesta de submenú
        if (arbolChat.startsWith("Procesar Submenu Credito Seguro ")) {
            const submenuId = arbolChat.replace("Procesar Submenu Credito Seguro ", "")
            return await procesarRespuestaSubmenu(idChat, remitente, contenido, chatData, submenuId, contextoArbol)
        }

        // todo: Procesando input del usuario
        if (arbolChat.startsWith("Solicitar Input Credito Seguro ")) {
            return await procesarInputUsuario(idChat, remitente, contenido, chatData, contextoArbol)
        }

        if (arbolChat.startsWith("Esperando Adjuntos Credito Seguro ")) {
            // Extraer el submenuId del paso del árbol
            const submenuId = arbolChat.replace("Esperando Adjuntos Credito Seguro ", "");

            // Verificar si ya hay adjuntos en el chat
            const chatActualizado = await modelChat.filtrar(remitente);
            const rutaAdjuntosActual = chatActualizado[0].RUTA_ADJUNTOS || '-';

            // Si hay adjuntos, procesarlos automáticamente
            if (rutaAdjuntosActual && rutaAdjuntosActual !== '-') {
                return await procesarAdjuntosEnviados(idChat, remitente, contenido, chatData, contextoArbol, submenuId)
            }

            // Si no hay adjuntos aún y el usuario escribió algo, mostrar recordatorio
            if (contenido && contenido.trim()) {
                return await procesarAdjuntosEnviados(idChat, remitente, contenido, chatData, contextoArbol, submenuId)
            }

            // Si no hay adjuntos y no hay contenido, solo esperar
            return true;
        }

        // todo: Interacción con IA
        if (arbolChat === "Interaccion AI Soul" || arbolChat === dataEstatica.arbol.alertaNoEntiendo) {
            return await getArbolPrincipal().procesarMensajeAISoul(idChat, remitente, contenido, chatData, contextoArbol)
        }

        logger.warn(
            {
                contexto: "model",
                recurso: "arbolCreditoSeguro.arbolCreditoSeguro",
                arbolChat,
                idChat,
                remitente,
            },
            "No se encontró condición válida para arbolChat en Credito Seguro",
        )
        return true;
    } catch (error) {
        const api = 'Chat Web Triple A ';
        const procesoApi = 'Arbol Credito Seguro';
        logger.error({
            contexto: 'model',
            recurso: 'arbolCreditoSeguro.arbolCreditoSeguro',
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            api,
            procesoApi
        }, 'Error en v1/models/widget/arbol/arbolCreditoSeguro.model.js → arbolCreditoSeguro');
        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente, contextoArbol);
    }
};



// todo: Solicitar Menu Arbol Credito Seguro
const solicitarMenuArbolCreditoSeguro = async (idChat, remitente, chatData) => {
    const solicitarMenuArbolCreditoSeguro = "Solicitar Menu Arbol Credito Seguro"
    chatData.descripcion = 'Se solicita el menu de Credito Seguro.'

    await modelChat.actualizar(idChat, solicitarMenuArbolCreditoSeguro, chatData)

    return await getArbolPrincipal().crearMensaje(
        idChat,
        remitente,
        dataEstatica.configuracion.estadoMensaje.enviado,
        dataEstatica.configuracion.tipoMensaje.texto,
        dataEstatica.mensajes.solicitarMenuArbolCreditoSeguro,
        chatData.descripcion,
    )
}

// todo: Procesar Menu Arbol Trámite
const procesarMenuArbolCreditoSeguro = async (idChat, remitente, contenido, chatData) => {
    try {
        const contenidoNormalized = String(contenido).trim();

        const menuOpciones = {
            '1': 'financiacion_no_bancaria',
            '2': 'seguros_familia_segura',
            '3': 'plan_prevision_exequial',
        };

        // Si es una opción válida del menú
        if (menuOpciones[contenidoNormalized]) {
            return await mostrarSubmenu(idChat, remitente, menuOpciones[contenidoNormalized], chatData);
        }

        // // Permitir REGRESAR
        // if (contenidoNormalized === 'REGRESAR') {
        //     chatData.descripcion = 'Usuario escribió REGRESAR';
        //     return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
        // }

        // Opción no válida
        const resultado = await getArbolPrincipal().manejarNoEntiendo(
            idChat, remitente,
            "Alerta No Entiendo - Solicitar Menu Arbol Credito Seguro",
            dataEstatica.mensajes.alertaNoEntiendo
        );
        
        if (resultado) {
            return await solicitarMenuArbolCreditoSeguro(idChat, remitente, chatData);
        }
        return false;

    } catch (error) {
        logger.error({ contexto: 'model', recurso: 'arbolCreditoSeguro.procesarMenuArbolCreditoSeguro',
            errorMensaje: error.message, errorStack: error.stack, idChat, remitente },
            'Error en procesarMenuArbolCreditoSeguro');
        
        const api = 'Chat Web Triple A';
        const procesoApi = 'Procesar Menu Credito Seguro';
        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente);
    }
};





// todo: Mostrar Submenu 
const mostrarSubmenu = async (idChat, remitente, submenuId, chatData) => {
    const submenu = SUBMENUS_CONFIG[submenuId];
    
    if (!submenu) {
        logger.warn({ contexto: 'model', recurso: 'arbolTramite.mostrarSubmenu',
            submenuId, idChat, remitente }, `Submenú no encontrado: ${submenuId}`);
        return false;
    }

    chatData.descripcion = submenu.descripcion;

    // ===== CASO ESPECIAL: INPUT_MULTIPLE - Iniciar secuencia de inputs =====
    if (submenu.tipo === 'input_multiple' && submenu.inputKey && submenu.inputKey.length > 0) {
        logger.info({
            contexto: 'model',
            recurso: 'arbolTramite.mostrarSubmenu',
            submenuActual: submenuId,
            inputsRequeridos: submenu.inputKey
        }, '⚡ Iniciando secuencia de inputs automáticamente');

        // Actualizar estado primero
        await modelChat.actualizar(idChat, submenu.pasoArbol, chatData);

        // Guardar la secuencia completa y el destino final
        chatData.inputsSecuencia = JSON.stringify(submenu.inputKey);
        chatData.submenuPendiente = submenu.siguiente;
        chatData.mensajePersonalizadoEnCurso = submenu.mensaje || '-';

        // Guardar mensajeContextoIA si existe y el siguiente paso es mensaje_asesor
        // Esto garantiza que la solicitud del cliente se envíe dinámicamente al servicio de soulchat
        if (submenu.mensajeContextoIA && submenu.siguiente === 'mensaje_asesor') {
            chatData.mensajeContextoIAPendiente = submenu.mensajeContextoIA;
            logger.info({
                contexto: 'model',
                recurso: 'arbolCreditoSeguro.mostrarSubmenu',
                submenuId,
                mensajeContextoIA: submenu.mensajeContextoIA
            }, '💾 Guardando mensajeContextoIA para uso al pasar a agente');
        }

        // Solicitar el primer input de la secuencia (sin mostrar mensaje previo)
        return await solicitarInputUsuario(
            idChat,
            remitente,
            submenu.inputKey[0],
            submenu.siguiente,
            chatData,
            'arbolCreditoSeguro',
            submenu.mensaje
        );
    }

    // ===== CASO ESPECIAL: PASAR_AGENTE - NO mostrar mensaje aquí =====
    if (submenu.tipo === 'pasar_agente') {
        // Solo actualizar estado, el mensaje lo mostrará procesarRespuestaSubmenu
        await modelChat.actualizar(idChat, submenu.pasoArbol, chatData);
        
        // Llamar directamente a procesarRespuestaSubmenu para manejar el pasar_agente
        return await procesarRespuestaSubmenu(idChat, remitente, '', chatData, submenuId, 'arbolCreditoSeguro');
    }

    // ===== MOSTRAR MENSAJE NORMAL (para otros tipos) =====
    const tipoMensaje = submenu.requiereAdjuntos === true 
        ? dataEstatica.configuracion.tipoMensaje.adjuntos 
        : (submenu.tipoMensaje || dataEstatica.configuracion.tipoMensaje.texto);
    
    await getArbolPrincipal().crearMensaje(
        idChat, remitente,
        dataEstatica.configuracion.estadoMensaje.enviado,
        tipoMensaje,
        submenu.mensaje,
        chatData.descripcion
    );

    // Actualizar estado después de mostrar mensaje
    await modelChat.actualizar(idChat, submenu.pasoArbol, chatData);

    // ===== AVANCE AUTOMÁTICO =====
    if (submenu.avanceAutomatico) {
        logger.info({
            contexto: 'model',
            recurso: 'arbolCreditoSeguro.mostrarSubmenu',
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
            logger.warn({ contexto: 'model', recurso: 'arbolCreditoSeguro.procesarRespuestaSubmenu',
                submenuId }, `Submenú no encontrado: ${submenuId}`);
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
                    recurso: 'arbolCreditoSeguro.procesarRespuestaSubmenu',
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

        // ===== OBTENER LA OPCIÓN SELECCIONADA =====
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

            // TIPO: PASAR_AGENTE (desde una opción específica)
            if (opcion.tipo === 'pasar_agente') {
                chatData.descripcion = `Usuario requiere asesor - opción ${contenidoNormalized}`;
                chatData.adjuntos = 'No';
                chatData.rutaAdjuntos = '-';

                // Mostrar mensaje si existe en la opción (tipo Paso Agente porque indica paso a agente)
                if (opcion.mensaje) {
                    await getArbolPrincipal().crearMensaje(
                        idChat, remitente,
                        dataEstatica.configuracion.estadoMensaje.enviado,
                        dataEstatica.configuracion.tipoMensaje.pasoAgente,
                        opcion.mensaje,
                        chatData.descripcion
                    );
                }

                // Actualizar estado y pasar a IA/Agente
                const pasoArbol = "Interaccion AI Soul";
                await modelChat.actualizar(idChat, pasoArbol, chatData);

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


            // TIPO: INPUT_MULTIPLE (Secuencia de inputs)
            if (opcion.tipo === 'input_multiple') {
                chatData.descripcion = opcion.descripcion || `Usuario seleccionó opción ${contenidoNormalized}`;

                // Mostrar mensaje inicial
                if (opcion.mensaje) {
                    await getArbolPrincipal().crearMensaje(
                        idChat, remitente,
                        dataEstatica.configuracion.estadoMensaje.enviado,
                        dataEstatica.configuracion.tipoMensaje.texto,
                        opcion.mensaje,
                        chatData.descripcion
                    );
                }
                chatData.inputsSecuencia = JSON.stringify(opcion.inputKey);
                chatData.submenuPendiente = opcion.siguiente;

                // Guardar mensajeContextoIA si existe y el siguiente paso es mensaje_asesor
                // Esto garantiza que la solicitud del cliente se envíe dinámicamente al servicio de soulchat
                if (opcion.mensajeContextoIA && opcion.siguiente === 'mensaje_asesor') {
                    chatData.mensajeContextoIAPendiente = opcion.mensajeContextoIA;
                    logger.info({
                        contexto: 'model',
                        recurso: 'arbolCreditoSeguro.procesarRespuestaSubmenu',
                        opcion: contenidoNormalized,
                        mensajeContextoIA: opcion.mensajeContextoIA
                    }, '💾 Guardando mensajeContextoIA para uso al pasar a agente');
                }

                // Solicitar el primer input de la secuencia
                return await solicitarInputUsuario(
                    idChat, remitente,
                    opcion.inputKey[0],
                    opcion.siguiente,
                    chatData,
                    contextoArbol
                );
            }

            // TIPO: SIMPLE (Solo ir al siguiente submenu)
            if (opcion.siguiente) {
                if (opcion.siguiente === 'menu_principal') {
                    return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
                }
                if (opcion.siguiente === 'cerrar_chat') {
                    return await getArbolPrincipal().cerrarChatConDespedida(idChat, remitente, chatData, contextoArbol);
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
        logger.error({ contexto: 'model', recurso: `${contextoArbol}.procesarRespuestaSubmenu`,
            errorMensaje: error.message, errorStack: error.stack, idChat, remitente, submenuId },
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
        const pasoArbol = `Solicitar Input Credito Seguro ${inputConfig.campo}`;
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
        const procesoApi = 'Solicitar Input Credito Seguro';
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


const procesarAdjuntosEnviados = async (idChat, remitente, contenido, chatData, contextoArbol, submenuId = null) => {
    try {
        // Obtener información del chat actualizado
        const chat = await modelChat.filtrar(remitente);
        const rutaAdjuntos = chat[0].RUTA_ADJUNTOS || '-';

        // Verificar si hay adjuntos
        if (rutaAdjuntos && rutaAdjuntos !== '-') {
            const enlaces = rutaAdjuntos.split('|').filter(e => e.trim());
            
            if (enlaces.length > 0) {
                // Hay adjuntos, mostrar confirmación
                const APP_URL = process.env.APP_URL || '';
                let mensajeConfirmacion = '<p class="confirmacionAdjuntosArbol">✅ <b>Hemos recibido tus documentos correctamente.</b><br/><br/>';
                mensajeConfirmacion += '<b>Archivos recibidos:</b><br/><br/>';
                
                enlaces.forEach(enlace => {
                    const nombreArchivo = enlace.split('/').pop();
                    let rutaEnlace = enlace;
                    
                    if (!rutaEnlace.startsWith('/files/')) {
                        rutaEnlace = rutaEnlace.startsWith('/') ? `/files${rutaEnlace}` : `/files/${rutaEnlace}`;
                    }
                    
                    // Si la ruta apunta a send, no se debe mostrar en este mensaje (solo archivos del cliente)
                    if (rutaEnlace.includes('/send/')) {
                        return;
                    }

                    if (!rutaEnlace.includes('/received/')) {
                        const partes = rutaEnlace.split('/');
                        const archivo = partes.pop();
                        rutaEnlace = partes.join('/') + '/received/' + archivo;
                    }
                    
                    const rutaCompleta = `${APP_URL}/uploads${rutaEnlace}`;
                    mensajeConfirmacion += `📄 <a href="${rutaCompleta}" target="_blank">${nombreArchivo}</a><br/>`;
                });


                chatData.descripcion = `Adjuntos recibidos para Crédito/Seguro: ${enlaces.length} archivo(s)`;
                chatData.adjuntos = 'Si';
                chatData.rutaAdjuntos = rutaAdjuntos;

                // Mostrar mensaje de confirmación
                await getArbolPrincipal().crearMensaje(
                    idChat,
                    remitente,
                    dataEstatica.configuracion.estadoMensaje.enviado,
                    dataEstatica.configuracion.tipoMensaje.texto,
                    chatData.descripcion
                );

                logger.info({
                    contexto: 'model',
                    recurso: `${contextoArbol}.procesarAdjuntosEnviados`,
                    idChat,
                    remitente,
                    cantidadArchivos: enlaces.length,
                    submenuId
                }, '✅ Adjuntos recibidos y confirmados en Crédito/Seguro');

                // Mantener esperando adjuntos (permite envío múltiple)
                const pasoArbol = `Esperando Adjuntos Credito Seguro ${submenuId}`;
                chatData.descripcion = `Esperando más adjuntos (permite envío múltiple)`;
                await modelChat.actualizar(idChat, pasoArbol, chatData);
                return true;
            }
        }

        // Si no hay adjuntos aún, esperar o mostrar mensaje de recordatorio
        const mensajeRecordatorio = '<p class="recordatorioAdjuntosArbol">📎 <b>Puedes adjuntar documentos si el asesor los solicita.</b><br/><br/>' +
            'Utiliza el botón de adjuntar archivos para enviar tus documentos.<br/><br/>' +
            'Si no tienes documentos que enviar en este momento, puedes continuar escribiendo tu consulta.</p>';

        await getArbolPrincipal().crearMensaje(
            idChat,
            remitente,
            dataEstatica.configuracion.estadoMensaje.enviado,
            dataEstatica.configuracion.tipoMensaje.texto,
            mensajeRecordatorio,
            'Recordatorio: adjuntar documentos'
        );

        return true;

    } catch (error) {
        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.procesarAdjuntosEnviados`,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente
        }, 'Error en procesarAdjuntosEnviados');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Procesar Adjuntos Enviados';
        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente);
    }
};


// ! EXPORTACIONES
module.exports = {
    arbolCreditoSeguro,
    solicitarMenuArbolCreditoSeguro,
    procesarMenuArbolCreditoSeguro,
    procesarAdjuntosEnviados
};