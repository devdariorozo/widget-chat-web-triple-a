// ! ================================================================================================================================================
// !                                                      MODELOS PARA ARBOL CHAT BOT - TRAMITE
// ! ================================================================================================================================================
// @autor Ramón Dario Rozo Torres
// @última­Modificación Ramón Dario Rozo Torres
// @versión 1.0.0
// v1/models/widget/arbol/arbolTramite.model.js

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
    // ===== FACTURA A TU NOMBRE =====
    factura_nombre: {
        pasoArbol: "Procesar Submenu Tramite factura_nombre",
        descripcion: 'Usuario en: Factura a tu nombre',
        mensaje: dataEstatica.mensajes.facturaNombre,
        opciones: {
            '1': { siguiente: 'persona_natural' },
            '2': { siguiente: 'persona_juridica' },
            '3': { siguiente: 'persona_leasing_habitacional' }
        }
    },

    // ===== PERSONA NATURAL =====
    persona_natural: {
        pasoArbol: "Procesar Submenu Tramite persona_natural",
        descripcion: 'Usuario en: Persona natural',
        mensaje: dataEstatica.mensajes.personaNatural,
        opciones: {
            '1': { 
                // SI - Mostrar mensaje y esperar adjuntos
                tipo: 'avanzar',
                descripcion: 'Usuario en: Persona natural - Documentos Si',
                mensajeAvance: dataEstatica.mensajes.personaNaturalDocumentosSi,
                requiereAdjuntos: true,
                // siguiente: '' asesor
            },
            '2': { 
                // NO - Mostrar mensaje y cerrar chat
                tipo: 'avanzar',
                descripcion: 'Usuario en: Persona natural - Documentos No',
                mensajeAvance: dataEstatica.mensajes.personaNaturalDocumentosNo,
                requiereAdjuntos: false,
                siguiente: 'cerrar_chat'
            }
        }
    },

    // ===== PERSONA JURÍDICA =====
    persona_juridica: {
        pasoArbol: "Procesar Submenu Tramite persona_juridica",
        descripcion: 'Usuario en: Persona jurídica',
        mensaje: dataEstatica.mensajes.personaJuridica,
        opciones: {
            '1': { 
                tipo: 'avanzar',
                descripcion: 'Usuario en: Persona jurídica - Documentos Si',
                mensajeAvance: dataEstatica.mensajes.personaJuridicaDocumentosSi,
                requiereAdjuntos: true,
                // siguiente: '' asesor
            },
            '2': { 
                // NO - Mostrar mensaje y cerrar chat
                tipo: 'avanzar',
                descripcion: 'Usuario en: Persona jurídica - Documentos No',
                mensajeAvance: dataEstatica.mensajes.personaJuridicaDocumentosNo,
                requiereAdjuntos: false,
                siguiente: 'cerrar_chat'
            }
        }
    },

    // ===== PERSONA LEASING HABITACIONAL =====
    persona_leasing_habitacional: {
        pasoArbol: "Procesar Submenu Tramite persona_leasing_habitacional",
        descripcion: 'Usuario en: Persona Leasing Habitacional',
        mensaje: dataEstatica.mensajes.personaLeasingHabitacional,
        opciones: {
            '1': { 
                tipo: 'avanzar',
                descripcion: 'Usuario en: Persona Leasing Habitacional - Documentos Si',
                mensajeAvance: dataEstatica.mensajes.personaLeasingHabitacionalDocumentosSi,
                requiereAdjuntos: true,
               // siguiente: '' asesor
            },
            '2': { 
                // NO - Mostrar mensaje y cerrar chat
                tipo: 'avanzar',
                descripcion: 'Usuario en: Persona Leasing Habitacional - Documentos No',
                mensajeAvance: dataEstatica.mensajes.personaLeasingHabitacionalDocumentosNo,
                requiereAdjuntos: false,
                siguiente: 'cerrar_chat'
            }
        }
    },

    // ===== INMUEBLE DESOCUPADO =====
    inmueble_desocupado: {
        pasoArbol: "Procesar Submenu Tramite inmueble_desocupado",
        descripcion: 'Usuario en: Inmueble desocupado',
        tipo: 'input_multiple',
        mensaje: dataEstatica.mensajes.inmuebleDesocupado,
        inputKey: ['numeroPoliza', 'nombresApellidos', 'numeroDocumento', 'relacionPredio'],
        siguiente: 'mensaje_asesor',
        mensajeContextoIA:'El Usuario ha solicitado un asesor para Inmueble desocupado'
    },

    // ===== GESTIONAR MEDIDOR =====
    gestionar_medidor: {
        pasoArbol: "Procesar Submenu Tramite gestionar_medidor",
        descripcion: 'Usuario en: Gestionar tu medidor',
        tipo: 'input_multiple',
        mensaje: dataEstatica.mensajes.gestionarMedidor,
        inputKey: ['numeroPoliza', 'nombresApellidos', 'numeroDocumento', 'relacionPredio'],
        siguiente: 'mensaje_asesor',
        mensajeContextoIA:'El Usuario ha solicitado un asesor para Gestionar tu medidor'
    },

    // ===== REPORTAR FRAUDES =====
    reportar_fraudes: {
        pasoArbol: "Procesar Submenu Tramite reportar_fraudes",
        descripcion: 'Usuario en: Reportar fraudes',
        tipo: 'input_multiple',
        mensaje: dataEstatica.mensajes.reportarFraudes,
        inputKey: ['direccion', 'nombresApellidos'],
        siguiente: 'mensaje_asesor',
        mensajeContextoIA:'El Usuario ha solicitado un asesor para Reportar fraudes'
    },

    // ===== CAMBIO DE ESTRATO =====
    cambio_estrato: {
        pasoArbol: "Procesar Submenu Tramite cambio_estrato",
        descripcion: 'Usuario en: Cambio de estrato',
        mensaje: dataEstatica.mensajes.cambioEstrato,
        avanceAutomatico: 'cambio_estrato_otra_consulta' 
    },

    cambio_estrato_otra_consulta: {
        pasoArbol: "Procesar Submenu Tramite cambio_estrato_otra_consulta",
        descripcion: 'Usuario en: Cambio de estrato - Otra consulta',
        mensaje: dataEstatica.mensajes.cambioEstratoOtraConsulta,
        opciones: {
            '1': { 
                tipo: 'avanzar', 
                descripcion: 'Usuario en: Cambio de estrato - Otra consulta - Opción 1', 
                siguiente: 'menu_principal' 
            },
            '2': { 
                tipo: 'avanzar',
                descripcion: 'Usuario en: Cambio de estrato - Otra consulta - Opción 2', 
                siguiente: 'cerrar_chat' 
            }
        }
    },

    // ===== INFO PQRs =====
    info_pqrs: {
        pasoArbol: "Procesar Submenu Tramite info_pqrs",
        descripcion: 'Usuario en: ¿Qué son las PQRs?',
        mensaje: dataEstatica.mensajes.infoPqrs,
        avanceAutomatico: 'info_pqrs_otra_consulta' 
    },

    info_pqrs_otra_consulta: {
        pasoArbol: "Procesar Submenu Tramite info_pqrs_otra_consulta",
        descripcion: 'Usuario en: Info PQRs - Otra consulta',
        mensaje: dataEstatica.mensajes.infoPqrsOtraConsulta,
        opciones: {
            '1': { 
                tipo: 'avanzar', 
                descripcion: 'Usuario en: Info PQRs - Otra consulta - Opción 1', 
                siguiente: 'menu_principal' 
            },
            '2': { 
                tipo: 'avanzar',
                descripcion: 'Usuario en: Info PQRs - Otra consulta - Opción 2',
                siguiente: 'cerrar_chat'
            }
        }
    },

    // ===== MENSAJE ASESOR =====
    mensaje_asesor: {
        tipo: 'pasar_agente',
        pasoArbol: "Procesar Submenu Factura Pago mensaje_asesor",
        descripcion: 'Usuario en: Mensaje asesor factura pago',
        mensaje: dataEstatica.mensajes.mensajeAsesor
    }
};

// ! MODELOS
// * ARBOL CHAT BOT - TRAMITE
const arbolTramite = async (idChat, remitente, arbolChat,contenido, chatData, contextoArbol='arbolTramite') => {
 
    try {

        // todo: Primera vez que entra al árbol
        if (arbolChat === "Solicitar Arbol Tramite") {
            return await solicitarMenuArbolTramite(idChat, remitente, chatData, contextoArbol)
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
            arbolChat === "Solicitar Menu Arbol Tramite" ||
            arbolChat === dataEstatica.arbol.alertaNoEntiendo
        ) {
            return await procesarMenuArbolTramite(idChat, remitente, contenido, chatData, contextoArbol)
        }

        // todo: Manejo de errores en submenús
        if (arbolChat.startsWith("Alerta No Entiendo - Submenu Tramite ")) {
            const submenuId = arbolChat.replace("Alerta No Entiendo - Submenu Tramite ", "")
            return await procesarRespuestaSubmenu(
                idChat, remitente, contenido, chatData, submenuId, contextoArbol
            )
        }

        // todo: Procesando respuesta de submenú
        if (arbolChat.startsWith("Procesar Submenu Tramite ")) {
            const submenuId = arbolChat.replace("Procesar Submenu Tramite ", "")
            return await procesarRespuestaSubmenu(idChat, remitente, contenido, chatData, submenuId, contextoArbol)
        }

        // todo: Procesando input del usuario
        if (arbolChat.startsWith("Solicitar Input Tramite ")) {
            return await procesarInputUsuario(idChat, remitente, contenido, chatData, contextoArbol)
        }

        // todo: Procesando adjuntos después de enviar documentos
        if (arbolChat.startsWith("Esperando Adjuntos Tramite ")) {
            // Extraer el submenuId del paso del árbol
            const submenuId = arbolChat.replace("Esperando Adjuntos Tramite ", "");
            
            // Verificar si ya hay adjuntos en el chat (incluso si el usuario no escribió nada)
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
                recurso: "arbolTramite.arbolTramite",
                arbolChat,
                idChat,
                remitente,
            },
            "No se encontró condición válida para arbolChat en Tramite",
        )
        return true;
    } catch (error) {
        const api = 'Chat Web Triple A ';
        const procesoApi = 'Arbol Tramite';
        logger.error({
            contexto: 'model',
            recurso: 'arbolTramite.arbolTramite',
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            api,
            procesoApi
        }, 'Error en v1/models/widget/arbol/arbolTramite.model.js → arbolTramite');
        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente, contextoArbol);
    }
};



// todo: Solicitar Menu Arbol Tramite
const solicitarMenuArbolTramite = async (idChat, remitente, chatData) => {
    const solicitarMenuArbolTramite = "Solicitar Menu Arbol Tramite"
    chatData.descripcion = 'Se solicita el menu de tramite.'

    await modelChat.actualizar(idChat, solicitarMenuArbolTramite, chatData)

    return await getArbolPrincipal().crearMensaje(
        idChat,
        remitente,
        dataEstatica.configuracion.estadoMensaje.enviado,
        dataEstatica.configuracion.tipoMensaje.texto,
        dataEstatica.mensajes.solicitarMenuArbolTramite,
        chatData.descripcion,
    )
}

// todo: Procesar Menu Arbol Trámite
const procesarMenuArbolTramite = async (idChat, remitente, contenido, chatData) => {
    try {
        const contenidoNormalized = String(contenido).trim();

        const menuOpciones = {
            '1': 'factura_nombre',
            '2': 'inmueble_desocupado',
            '3': 'gestionar_medidor',
            '4': 'reportar_fraudes',
            '5': 'cambio_estrato',
            '6': 'info_pqrs'
        };

        // Si es una opción válida del menú
        if (menuOpciones[contenidoNormalized]) {
            return await mostrarSubmenu(idChat, remitente, menuOpciones[contenidoNormalized], chatData);
        }

        // Permitir REGRESAR (case-insensitive)
        if (contenidoNormalized.toUpperCase() === 'REGRESAR') {
            chatData.descripcion = 'Usuario escribió REGRESAR';
            return await getArbolPrincipal().solicitarMenuArbolPrincipal(idChat, remitente);
        }

        // Opción no válida
        const resultado = await getArbolPrincipal().manejarNoEntiendo(
            idChat, remitente,
            "Alerta No Entiendo - Solicitar Menu Arbol Tramite",
            dataEstatica.mensajes.alertaNoEntiendo
        );
        
        if (resultado) {
            return await solicitarMenuArbolTramite(idChat, remitente, chatData);
        }
        return false;

    } catch (error) {
        logger.error({ contexto: 'model', recurso: 'arbolTramite.procesarMenuArbolTramite',
            errorMensaje: error.message, errorStack: error.stack, idChat, remitente },
            'Error en procesarMenuArbolTramite');
        
        const api = 'Chat Web Triple A';
        const procesoApi = 'Procesar Menu Tramite';
        return await getArbolPrincipal().errorAPI(api, procesoApi, error, idChat, remitente);
    }
};





// todo: Mostrar Submenu 
const mostrarSubmenu = async (idChat, remitente, submenuId, chatData) => {
    const submenu = SUBMENUS_CONFIG[submenuId];
    
    if (!submenu) {
        logger.warn({
            contexto: 'model',
            recurso: 'arbolTramite.mostrarSubmenu',
            submenuId,
            idChat,
            remitente
        }, `Submenú no encontrado: ${submenuId}`);
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

        // 1) Actualizar estado del chat al paso del submenú PRIMERO
        // Esto asegura que cuando se cree el mensaje, el arbolActual sea el correcto
        await modelChat.actualizar(idChat, submenu.pasoArbol, chatData);

        // 2) Enviar el mensaje informativo del submenú (lista lo que se va a solicitar)
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

        // 3) Guardar la secuencia completa y el destino final
        chatData.inputsSecuencia = JSON.stringify(submenu.inputKey);
        chatData.submenuPendiente = submenu.siguiente;

        // Guardar mensajeContextoIA si existe y el siguiente paso es mensaje_asesor
        // Esto garantiza que la solicitud del cliente se envíe dinámicamente al servicio de soulchat
        if (submenu.mensajeContextoIA && submenu.siguiente === 'mensaje_asesor') {
            chatData.mensajeContextoIAPendiente = submenu.mensajeContextoIA;
            logger.info({
                contexto: 'model',
                recurso: 'arbolTramite.mostrarSubmenu',
                submenuId,
                mensajeContextoIA: submenu.mensajeContextoIA
            }, '💾 Guardando mensajeContextoIA para uso al pasar a agente');
        }

        // Para esta secuencia queremos que cada pregunta use la cabecera propia
        // del input (como en Factura Pago), no el mensaje introductorio del submenú.
        chatData.mensajePersonalizadoEnCurso = '-';

        // 4) Solicitar el primer input de la secuencia
        return await solicitarInputUsuario(
            idChat,
            remitente,
            submenu.inputKey[0],
            submenu.siguiente,
            chatData,
            'arbolTramite'
        );
    }

    // ===== CASO ESPECIAL: PASAR_AGENTE - NO mostrar mensaje aquí =====
    if (submenu.tipo === 'pasar_agente') {
        // Solo actualizar estado, el mensaje lo mostrará procesarRespuestaSubmenu
        await modelChat.actualizar(idChat, submenu.pasoArbol, chatData);
        
        // Llamar directamente a procesarRespuestaSubmenu para manejar el pasar_agente
        return await procesarRespuestaSubmenu(idChat, remitente, '', chatData, submenuId, 'arbolTramite');
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

    // ===== REQUIERE ADJUNTOS =====
    if (submenu.requiereAdjuntos === true) {
        const pasoArbol = `Esperando Adjuntos Tramite ${submenuId}`;
        chatData.descripcion = `Esperando adjuntos para ${submenuId}`;
        await modelChat.actualizar(idChat, pasoArbol, chatData);
        return true;
    }

    // Actualizar estado después de mostrar mensaje
    await modelChat.actualizar(idChat, submenu.pasoArbol, chatData);

    // ===== AVANCE AUTOMÁTICO =====
    if (submenu.avanceAutomatico) {
        logger.info({
            contexto: 'model',
            recurso: 'arbolTramite.mostrarSubmenu',
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
                contexto: 'model', recurso: 'arbolTramite.procesarRespuestaSubmenu',
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
                    recurso: 'arbolTramite.procesarRespuestaSubmenu',
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
                    tipoMensaje,
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
                    const mensajeContexto = `He indicado que no cuento con los documentos digitales para el cambio de nombre en la factura.`;
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

                    chatData.inputsSecuencia = JSON.stringify(opcion.inputKey);
                    chatData.submenuPendiente = opcion.siguiente;

                    // Guardar mensajeContextoIA si existe y el siguiente paso es mensaje_asesor
                    // Esto garantiza que la solicitud del cliente se envíe dinámicamente al servicio de soulchat
                    if (opcion.mensajeContextoIA && opcion.siguiente === 'mensaje_asesor') {
                        chatData.mensajeContextoIAPendiente = opcion.mensajeContextoIA;
                        logger.info({
                            contexto: 'model',
                            recurso: 'arbolTramite.procesarRespuestaSubmenu',
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
                    return await cerrarChatConDespedida(idChat, remitente, chatData, contextoArbol);
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
                if (opcion.siguiente === 'cerrar_chat') {
                    return await cerrarChatConDespedida(idChat, remitente, chatData, contextoArbol);
                }
                return await mostrarSubmenu(idChat, remitente, opcion.siguiente, chatData);
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
        const pasoArbol = `Solicitar Input Tramite ${inputConfig.campo}`;
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
        const procesoApi = `Solicitar Input Tramite - ${inputConfig.campo}`;
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

// todo: Procesar Adjuntos Enviados
const procesarAdjuntosEnviados = async (idChat, remitente, contenido, chatData, contextoArbol, submenuId = null) => {
    try {
        // Obtener información del chat actualizado
        const chat = await modelChat.filtrar(remitente);
        const rutaAdjuntos = chat[0].RUTA_ADJUNTOS || '-';

        // Verificar si hay adjuntos
        if (rutaAdjuntos && rutaAdjuntos !== '-') {
            // Solo mostrar al cliente los adjuntos que él mismo ha enviado (carpeta received)
            const enlaces = rutaAdjuntos
                .split('|')
                .map(e => e.trim())
                .filter(e => e);
            
            if (enlaces.length > 0) {
                // Hay adjuntos, mostrar confirmación
                const APP_URL = process.env.APP_URL || '';
                let mensajeConfirmacion = '<p class="confirmacionAdjuntosArbol">✅ <b>Hemos recibido tus documentos correctamente.</b><br/><br/>';
                mensajeConfirmacion += '<b>Archivos recibidos:</b><br/><br/>';
                
                enlaces.forEach(enlace => {
                    const nombreArchivo = enlace.split('/').pop();
                    let rutaEnlace = enlace;
                    
                    // Si la ruta no tiene /files/, agregarlo
                    if (!rutaEnlace.startsWith('/files/')) {
                        rutaEnlace = rutaEnlace.startsWith('/') ? `/files${rutaEnlace}` : `/files/${rutaEnlace}`;
                    }
                    
                    // Si la ruta apunta a send, no se debe mostrar en este mensaje (solo archivos del cliente)
                    if (rutaEnlace.includes('/send/')) {
                        return;
                    }

                    // Si la ruta no tiene /received/ ni /send/, asumir que es received (archivos del cliente)
                    if (!rutaEnlace.includes('/received/')) {
                        const partes = rutaEnlace.split('/');
                        const archivo = partes.pop();
                        rutaEnlace = partes.join('/') + '/received/' + archivo;
                    }
                    
                    const rutaCompleta = `${APP_URL}/uploads${rutaEnlace}`;
                    mensajeConfirmacion += `📄 <a href="${rutaCompleta}" target="_blank">${nombreArchivo}</a><br/>`;
                });
                
                mensajeConfirmacion += '<br/>🕵️‍♀️ En un momento validaremos tu información para continuar con tu solicitud.<br/><br/>';
                mensajeConfirmacion += '🔍👩‍💻Me encuentro localizando al primer agente disponible, no me tardo.</p>';

                chatData.descripcion = `Adjuntos recibidos para trámite: ${enlaces.length} archivo(s)`;
                chatData.adjuntos = 'Si';
                chatData.rutaAdjuntos = rutaAdjuntos;

                // Mostrar mensaje de confirmación (tipo Paso Agente porque indica paso a agente)
                await getArbolPrincipal().crearMensaje(
                    idChat,
                    remitente,
                    dataEstatica.configuracion.estadoMensaje.enviado,
                    dataEstatica.configuracion.tipoMensaje.pasoAgente,
                    mensajeConfirmacion,
                    chatData.descripcion
                );

                logger.info({
                    contexto: 'model',
                    recurso: `${contextoArbol}.procesarAdjuntosEnviados`,
                    idChat,
                    remitente,
                    cantidadArchivos: enlaces.length,
                    submenuId
                }, '✅ Adjuntos recibidos y confirmados');

                // Continuar con interacción AI Soul para pasar a agente
                // El resumen del flujo del árbol se construye automáticamente desde cht_conversacion
                // en procesarMensajeAISoul, así que solo pasamos un mensaje contextual básico
                let mensajeContexto = 'He enviado los documentos solicitados para mi trámite.';
                if (submenuId === 'inmueble_desocupado') {
                    mensajeContexto = 'He enviado la información y documentos para reportar mi inmueble como desocupado.';
                } else if (submenuId === 'cambio_nombre_factura') {
                    mensajeContexto = 'He enviado los documentos solicitados para el cambio de nombre en la factura.';
                }

                // Actualizar el árbol a Interaccion AI Soul antes de procesar
                const pasoArbol = "Interaccion AI Soul";
                await modelChat.actualizar(idChat, pasoArbol, chatData);

                // Procesar mensaje a AI Soul para pasar a agente
                return await getArbolPrincipal().procesarMensajeAISoul(
                    idChat,
                    remitente,
                    mensajeContexto,
                    chatData,
                    contextoArbol
                );
            }
        }

        // Si no hay adjuntos aún, esperar o mostrar mensaje de recordatorio
        const mensajeRecordatorio = '<p class="recordatorioAdjuntosArbol">📎 <b>Recuerda adjuntar los documentos necesarios.</b><br/><br/>' +
            'Por favor, utiliza el botón de adjuntar archivos para enviar tus documentos.<br/><br/>' +
            'Una vez que los envíes, continuaremos con tu solicitud.</p>';

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
    arbolTramite,
    solicitarMenuArbolTramite,
    procesarMenuArbolTramite,
    procesarAdjuntosEnviados,
};