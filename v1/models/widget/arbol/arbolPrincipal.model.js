// ! ================================================================================================================================================
// !                                                      MODELOS PARA ARBOL CHAT BOT - PRINCIPAL
// ! ================================================================================================================================================
// @autor Ramón Dario Rozo Torres
// @últimaModificación Ramón Dario Rozo Torres
// @versión 1.0.0
// v1/models/widget/arbol/arbolPrincipal.model.js

// ! REQUIRES
const pool = require('../../../config/database.js');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config({ path: './../../../.env' });
const { decrypt } = require('../../../utils/cryptoData.js');
const modelChat = require('../chat.model.js');
const modelMensaje = require('../mensaje.model.js');
const dataEstatica = require('../../../seeds/dataEstatica.js');
const modelArbolControlServicio = require('./arbolControlServicio.model.js');
const modelArbolFacturaPago = require('./arbolFacturaPago.model.js');
const modelArbolTramite = require('./arbolTramite.model.js');
const modelArbolCreditoSeguro = require('./arbolCreditoSeguro.model.js');
const modelArbolEspAseo = require('./arbolEspAseo.model.js');
const modelArbolServicio = require('./arbolServicio.model.js');
const serviceSoulChat = require('../../../services/serviceSoulChat.service.js');
const logger = require('../../../logger/index.js');


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
    revisarFactura: '-',
    descripcionProblema: '-',
    calificacionEncuesta: '-',
    comentario: '-',
    encuesta: 'No',
};

// ! FUNCIONES HELPER
// * Construir resumen del flujo del árbol desde cht_conversacion
const construirResumenFlujoArbol = (conversacion) => {
    try {
        if (!conversacion || conversacion === '-' || conversacion === '[]') {
            return null;
        }

        // Parsear conversación (puede venir como string JSON o como objeto)
        let conversacionParsed = conversacion;
        if (typeof conversacion === 'string') {
            try {
                conversacionParsed = JSON.parse(conversacion);
            } catch (e) {
                return null;
            }
        }

        if (!Array.isArray(conversacionParsed) || conversacionParsed.length === 0) {
            return null;
        }

        // Extraer opciones del menú principal desde dataEstatica
        const obtenerNombreOpcionMenuPrincipal = (opcionNumero) => {
            try {
                const mensajeMenu = dataEstatica.mensajes.solicitarMenuArbolPrincipal || '';
                // Buscar la línea que contiene la opción específica (ej: <b>3.</b> Trámites y consultas)
                const regex = new RegExp(`<b>${opcionNumero}\\.</b>\\s*([^<]+)`, 'i');
                const match = mensajeMenu.match(regex);
                if (match && match[1]) {
                    // Limpiar el texto: remover emojis y espacios extra
                    return match[1].trim().replace(/[🔧🧾🔍🤩🧹🛠]/g, '').trim();
                }
            } catch (e) {
                // Si hay error, retornar null
            }
            return null;
        };

        // Mapeo de pasos del árbol a nombres legibles
        const mapeoArboles = {
            'Solicitar Menu Arbol Principal': 'Menú Principal', // Se reemplazará por la opción seleccionada si existe
            'Solicitar Menu Arbol Control Servicio': 'Control de Servicio',
            'Solicitar Menu Arbol Factura Pago': 'Factura y Pagos',
            'Solicitar Menu Arbol Tramite': 'Trámites',
            'Solicitar Arbol Credito Seguro': 'Créditos y Seguros',
            'Solicitar Arbol Esp Aseo': 'Recolección Especial Aseo',
            'Solicitar Arbol Servicio': 'Solicitar Servicio',
        };

        // Mapeo de submenús comunes (usar descripciones de SUBMENUS_CONFIG cuando sea posible)
        const mapeoSubmenus = {
            // Trámites
            'factura_nombre': 'Factura a tu nombre',
            'persona_natural': 'Persona natural',
            'persona_juridica': 'Persona jurídica',
            'persona_leasing_habitacional': 'Leasing habitacional',
            'inmueble_desocupado': 'Inmueble desocupado',
            'gestionar_medidor': 'Gestionar medidor',
            'reportar_fraudes': 'Reportar fraudes',
            'cambio_estrato': 'Cambio de estrato',
            'info_pqrs': 'Información PQRs',
            'cambio_nombre_factura': 'Cambio de nombre de factura',
            // Factura y Pagos
            'descargar_factura': 'Descargar factura',
            'saldo_factura': 'Saldo de factura',
            'acuerdo_pago': 'Acuerdo de pago',
            'aclaracion_factura': 'Aclaración de factura',
            'puntos_pago': 'Puntos de pago',
        };

        // Extraer pasos relevantes (filtrar mensajes de sistema, inactividad, etc.)
        const pasosRelevantes = [];
        const pasosIgnorar = [
            'Interaccion AI Soul',
            'Alerta No Entiendo',
            'Alerta Inactividad',
            'Cerrado Por Inactividad',
            'Error API',
            'Cliente Desiste',
            'Mensaje Asesor',
            'mensaje_asesor',
            'pasar_agente',
            'Paso Agente',
        ];

        // Mapeo inverso: de árbol secundario a opción del menú principal
        const mapeoArbolAOpcion = {
            'Solicitar Menu Arbol Control Servicio': 1,
            'Solicitar Menu Arbol Factura Pago': 2,
            'Solicitar Menu Arbol Tramite': 3,
            'Solicitar Arbol Credito Seguro': 4,
            'Solicitar Arbol Esp Aseo': 5,
            'Solicitar Arbol Servicio': 6,
        };

        for (let i = 0; i < conversacionParsed.length; i++) {
            const entrada = conversacionParsed[i];
            if (!entrada || !entrada.arbol) continue;

            const pasoArbol = entrada.arbol;

            // Ignorar pasos de sistema
            if (pasosIgnorar.some(ignorar => pasoArbol.includes(ignorar))) {
                continue;
            }

            // Si es el menú principal, verificar si tiene opción seleccionada
            if (pasoArbol === 'Solicitar Menu Arbol Principal') {
                // Si tiene opcionSeleccionada, usar el nombre de la opción desde dataEstatica
                if (entrada.opcionSeleccionada !== null && entrada.opcionSeleccionada !== undefined) {
                    const nombreOpcion = obtenerNombreOpcionMenuPrincipal(entrada.opcionSeleccionada);
                    if (nombreOpcion) {
                        pasosRelevantes.push(nombreOpcion);
                    }
                } else {
                    // Si no tiene opción seleccionada, buscar el siguiente paso del árbol para deducirla
                    let opcionDeducida = null;
                    for (let j = i + 1; j < conversacionParsed.length; j++) {
                        const siguienteEntrada = conversacionParsed[j];
                        if (!siguienteEntrada || !siguienteEntrada.arbol) continue;
                        
                        const siguienteArbol = siguienteEntrada.arbol;
                        // Si el siguiente paso es un menú secundario, deducir la opción
                        if (mapeoArbolAOpcion[siguienteArbol]) {
                            opcionDeducida = mapeoArbolAOpcion[siguienteArbol];
                            break;
                        }
                        // Si encontramos otro menú principal o un paso de sistema, detener la búsqueda
                        if (siguienteArbol === 'Solicitar Menu Arbol Principal' || 
                            pasosIgnorar.some(ignorar => siguienteArbol.includes(ignorar))) {
                            break;
                        }
                    }
                    
                    if (opcionDeducida) {
                        const nombreOpcion = obtenerNombreOpcionMenuPrincipal(opcionDeducida);
                        if (nombreOpcion) {
                            pasosRelevantes.push(nombreOpcion);
                        }
                    }
                }
            }
            // Si es otro menú principal, agregarlo solo si no es duplicado consecutivo
            else if (mapeoArboles[pasoArbol]) {
                const nombreArbol = mapeoArboles[pasoArbol];
                
                // Caso especial: Si es "Solicitar Menu Arbol Tramite", no agregarlo si ya tenemos "Trámites y consultas"
                // porque "Trámites y consultas" es más específico y viene del menú principal
                if (pasoArbol === 'Solicitar Menu Arbol Tramite') {
                    const ultimoPaso = pasosRelevantes.length > 0 ? pasosRelevantes[pasosRelevantes.length - 1] : '';
                    // Si el último paso es "Trámites y consultas", no agregar "Trámites" (es redundante)
                    if (ultimoPaso === 'Trámites y consultas') {
                        continue; // Saltar este paso, ya tenemos la información más específica
                    }
                }
                
                // Caso especial: Si es "Solicitar Menu Arbol Factura Pago", no agregarlo si ya tenemos "Factura y pagos"
                // porque "Factura y pagos" es más específico y viene del menú principal
                if (pasoArbol === 'Solicitar Menu Arbol Factura Pago') {
                    const ultimoPaso = pasosRelevantes.length > 0 ? pasosRelevantes[pasosRelevantes.length - 1] : '';
                    // Comparación case-insensitive para evitar duplicados por capitalización
                    if (ultimoPaso.toLowerCase() === 'factura y pagos' || ultimoPaso.toLowerCase() === 'factura y pago') {
                        continue; // Saltar este paso, ya tenemos la información más específica
                    }
                }
                
                // Evitar duplicación consecutiva: comparación case-insensitive para evitar duplicados por capitalización
                const ultimoPaso = pasosRelevantes.length > 0 ? pasosRelevantes[pasosRelevantes.length - 1] : '';
                const ultimoPasoLower = ultimoPaso.toLowerCase();
                const nombreArbolLower = nombreArbol.toLowerCase();
                
                if (ultimoPasoLower !== nombreArbolLower) {
                    pasosRelevantes.push(nombreArbol);
                }
            }
            // Si es un submenú de trámite, extraer el nombre del submenú
            else if (pasoArbol.includes('Procesar Submenu Tramite')) {
                const submenuId = pasoArbol.replace('Procesar Submenu Tramite ', '').trim();
                
                // Ignorar submenús técnicos de "mensaje asesor"
                if (submenuId.toLowerCase().includes('mensaje_asesor') || 
                    submenuId.toLowerCase().includes('mensaje asesor') ||
                    submenuId.toLowerCase().includes('pasar_agente')) {
                    continue;
                }
                
                // Usar el mapeo de submenús
                let nombreSubmenu = null;
                if (mapeoSubmenus[submenuId]) {
                    nombreSubmenu = mapeoSubmenus[submenuId];
                } else {
                    // Si no está en el mapeo, usar el ID formateado
                    nombreSubmenu = submenuId
                        .split('_')
                        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
                        .join(' ');
                }
                
                // Si tenemos un submenú específico, reemplazar "Trámites" si es el último paso
                // porque el submenú es más específico que el paso genérico
                if (nombreSubmenu) {
                    const ultimoPaso = pasosRelevantes.length > 0 ? pasosRelevantes[pasosRelevantes.length - 1] : '';
                    if (ultimoPaso === 'Trámites') {
                        pasosRelevantes.pop(); // Remover el paso genérico "Trámites"
                    }
                    pasosRelevantes.push(nombreSubmenu);
                }
            }
            // Si es un submenú de otros árboles (Factura Pago, etc.)
            else if (pasoArbol.includes('Procesar Submenu')) {
                const submenuId = pasoArbol.replace(/Procesar Submenu\s+/i, '').trim();
                
                // Ignorar submenús técnicos de "mensaje asesor"
                if (submenuId.toLowerCase().includes('mensaje_asesor') || 
                    submenuId.toLowerCase().includes('mensaje asesor') ||
                    submenuId.toLowerCase().includes('pasar_agente')) {
                    continue;
                }
                
                // Extraer solo el nombre del submenú, removiendo el nombre del árbol padre
                // Ejemplo: "Factura Pago descargar_factura" -> "descargar_factura"
                let nombreSubmenu = submenuId;
                
                // Remover nombres comunes de árboles padre
                const nombresArbolPadre = [
                    'Factura Pago',
                    'Factura Pago ',
                    'Control Servicio',
                    'Control Servicio ',
                    'Tramite',
                    'Tramite ',
                    'Credito Seguro',
                    'Credito Seguro ',
                    'Esp Aseo',
                    'Esp Aseo ',
                    'Servicio',
                    'Servicio ',
                ];
                
                for (const nombrePadre of nombresArbolPadre) {
                    if (nombreSubmenu.startsWith(nombrePadre)) {
                        nombreSubmenu = nombreSubmenu.replace(nombrePadre, '').trim();
                        break;
                    }
                }
                
                // Formatear el nombre del submenú
                // Primero verificar si está en el mapeo de submenús
                let submenuFormateado = null;
                if (mapeoSubmenus[nombreSubmenu]) {
                    submenuFormateado = mapeoSubmenus[nombreSubmenu];
                } else {
                    // Si no está en el mapeo, formatear automáticamente
                    submenuFormateado = nombreSubmenu
                        .split(/[\s_]+/)
                        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
                        .join(' ');
                }
                
                // Evitar duplicación con el menú principal
                if (submenuFormateado) {
                    const ultimoPaso = pasosRelevantes.length > 0 ? pasosRelevantes[pasosRelevantes.length - 1] : '';
                    const ultimoPasoLower = ultimoPaso.toLowerCase();
                    const submenuLower = submenuFormateado.toLowerCase();
                    
                    // Lista de nombres de menús principales para verificar si el último paso es un menú principal
                    // Incluir variaciones de capitalización para evitar problemas
                    const menusPrincipales = [
                        'factura y pagos',
                        'factura y pago',
                        'trámites y consultas',
                        'trámites y consulta',
                        'control de servicio',
                        'créditos y seguros',
                        'crédito y seguro',
                        'recolección especial aseo',
                        'recolección especial de aseo',
                        'solicitar servicio',
                        'menú principal',
                        'menu principal'
                    ];
                    
                    const ultimoPasoEsMenuPrincipal = menusPrincipales.some(menu => ultimoPasoLower === menu);
                    
                    // Solo evitar duplicación si:
                    // 1. El último paso es exactamente igual al submenú (duplicado exacto)
                    // 2. El último paso NO es un menú principal Y el submenú contiene el nombre del último paso
                    // 3. El último paso NO es un menú principal Y el último paso contiene el nombre del submenú
                    // Si el último paso ES un menú principal, SIEMPRE agregar el submenú (es la navegación esperada)
                    const esDuplicadoExacto = ultimoPasoLower === submenuLower;
                    const esDuplicadoPorContenido = !ultimoPasoEsMenuPrincipal && (
                        (ultimoPasoLower && submenuLower.includes(ultimoPasoLower)) ||
                        (submenuLower && ultimoPasoLower.includes(submenuLower))
                    );
                    
                    const esDuplicado = esDuplicadoExacto || esDuplicadoPorContenido;
                    
                    // Si no es duplicado y no está ya en la lista, agregarlo
                    if (!esDuplicado && !pasosRelevantes.includes(submenuFormateado)) {
                        pasosRelevantes.push(submenuFormateado);
                    }
                }
            }
            // Si contiene "Submenu" o "Submenú", intentar extraer información útil
            else if (pasoArbol.includes('Submenu') || pasoArbol.includes('Submenú')) {
                const partes = pasoArbol.split(' ');
                const ultimaParte = partes[partes.length - 1];
                if (mapeoSubmenus[ultimaParte]) {
                    pasosRelevantes.push(mapeoSubmenus[ultimaParte]);
                }
            }
            // Si tiene opcionSeleccionada, incluirla como contexto
            else if (entrada.opcionSeleccionada && entrada.opcionSeleccionada !== null) {
                // Ya tenemos el paso del árbol, solo agregar si no está duplicado
                const pasoFormateado = pasoArbol
                    .replace(/Procesar|Submenu|Tramite|Arbol/gi, '')
                    .trim()
                    .split(' ')
                    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
                    .join(' ');
                
                if (pasoFormateado && !pasosRelevantes.includes(pasoFormateado)) {
                    pasosRelevantes.push(pasoFormateado);
                }
            }
        }

        // Construir texto descriptivo
        if (pasosRelevantes.length === 0) {
            return null;
        }

        // Limpiar duplicados consecutivos
        const pasosUnicos = [];
        for (let i = 0; i < pasosRelevantes.length; i++) {
            if (i === 0 || pasosRelevantes[i] !== pasosRelevantes[i - 1]) {
                pasosUnicos.push(pasosRelevantes[i]);
            }
        }

        // Construir resumen: tomar todos los pasos relevantes (sin límite artificial)
        // El resumen debe reflejar completamente la navegación del usuario
        return pasosUnicos.join(' > ');

    } catch (error) {
        logger.error({
            contexto: 'model',
            recurso: 'arbolPrincipal.construirResumenFlujoArbol',
            errorMensaje: error.message,
            errorStack: error.stack,
        }, 'Error al construir resumen del flujo del árbol');
        return null;
    }
};

// ! MODELOS
// * ARBOL CHAT BOT
const arbolPrincipal = async (remitente, contenido) => {

    // Variables
    const defaultData = '-';
    const chat = await modelChat.filtrar(remitente);

    const idChat = chat[0].ID_CHAT;
    const arbolChat = chat[0].ARBOL;
    const estadoGestionChat = chat[0].GESTION;

    // Deserializar los datos después de recuperarlos
    chatData.controlApi = chat[0].CONTROL_API || defaultData;
    chatData.controlPeticiones = parseInt(chat[0].CONTROL_PETICIONES) || 0;
    // Mantener resultadoApi como string para evitar problemas al guardar en MySQL
    // Si se necesita como objeto, parsearlo en el momento de uso
    chatData.resultadoApi = chat[0].RESULTADO_API || defaultData;
    chatData.conversacion = chat[0].CONVERSACION || defaultData;
    chatData.numeroPoliza = chat[0].NUMERO_POLIZA || defaultData;
    chatData.nombresApellidos = chat[0].NOMBRES_APELLIDOS || defaultData;
    chatData.tipoDocumento = chat[0].TIPO_DOCUMENTO || defaultData;
    chatData.numeroDocumento = chat[0].NUMERO_DOCUMENTO || defaultData;
    chatData.numeroContacto = chat[0].NUMERO_CONTACTO || defaultData;
    chatData.correoElectronico = chat[0].CORREO_ELECTRONICO || defaultData;
    chatData.relacionPedido = chat[0].RELACION_PEDIDO || defaultData;
    chatData.autorizacionDatosPersonales = chat[0].AUTORIZACION_DATOS_PERSONALES || defaultData;
    chatData.adjuntos = chat[0].ADJUNTOS || defaultData;
    chatData.rutaAdjuntos = chat[0].RUTA_ADJUNTOS || defaultData;
    chatData.encuesta = chat[0].ENCUESTA || defaultData;
    chatData.descripcion = chat[0].DESCRIPCION || defaultData;
    chatData.estadoRegistro = chat[0].REGISTRO || defaultData;
    chatData.responsable = chat[0].RESPONSABLE || defaultData;

    await registrarMensajeUsuario(idChat, remitente, contenido, arbolChat);

    if (estadoGestionChat !== 'Cerrado') {
        try {
            // todo: Saludo Arbol
            if (arbolChat === 'Saludo' || arbolChat === 'Alerta No Entiendo - Saludo') {
                if (contenido === "1") {
                    // todo: Solicitar Formulario Inicial
                    return await solicitarFormularioInicial(idChat, remitente);
                } else {
                    // Si no es válido, llamamos la función para cuando no entiende
                    const pasoArbol = 'Alerta No Entiendo - Saludo';
                    const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
                ⚠️ <i>Estamos trabajando en generar el formulario inicial.</i></p>`;

                    const resultado = await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);

                    if (resultado) {
                        // Mostrar nuevamente el mensaje de solicitud para que el usuario vea qué se le está pidiendo
                        const resultadoSolicitar = await solicitarFormularioInicial(idChat, remitente);
                        return resultadoSolicitar;
                    }
                    return false;
                }
            }

            // todo: Menú Principal Arbol
            if (arbolChat === "Solicitar Menu Arbol Principal" || arbolChat === "Alerta No Entiendo - Solicitar Menu Arbol Principal") {
                return await procesarMenuArbolPrincipal(idChat, remitente, contenido);
            }


            if (arbolChat.startsWith("Regresar Al Menu Principal Despues ")) {
                logger.info({
                    contexto: 'model',
                    recurso: 'arbolPrincipal.arbolPrincipal',
                    idChat,
                    remitente,
                    arbolChat,
                    contenido
                }, '🔄 Usuario respondió después de mensaje estático, regresando al menú principal');

                let mensajeSaludo = dataEstatica.mensajes.saludoUsuario;

                if (chatData.nombresApellidos && chatData.nombresApellidos !== '-') {
                    mensajeSaludo = mensajeSaludo.replace(
                        '{{NOMBRES_APELLIDOS}}',
                        chatData.nombresApellidos
                    );
                }

                chatData.descripcion = 'Se reenvía mensaje de saludo.';

                await crearMensaje(
                    idChat,
                    remitente,
                    dataEstatica.configuracion.estadoMensaje.enviado,
                    dataEstatica.configuracion.tipoMensaje.texto,
                    mensajeSaludo,
                    chatData.descripcion
                );

                return await solicitarMenuArbolPrincipal(idChat, remitente);
            }


            const modulesRouter = [
                {
                    name: "arbolControlServicio",
                    model: modelArbolControlServicio,
                    patterns: [
                        "Solicitar Arbol Control Servicio",
                        "Solicitar Menu Arbol Control Servicio",
                        "Alerta No Entiendo - Solicitar Arbol Control Servicio",
                        "Procesar Submenu Control Servicio",
                        "Alerta No Entiendo - Submenu Control Servicio",
                        "Solicitar Input Control Servicio",
                    ],
                },
                {
                    name: "arbolFacturaPago",
                    model: modelArbolFacturaPago,
                    patterns: [
                        "Solicitar Arbol Factura Pago",
                        "Solicitar Menu Arbol Factura Pago",
                        "Alerta No Entiendo - Solicitar Arbol Factura Pago",
                        "Procesar Submenu Factura Pago",
                        "Alerta No Entiendo - Submenu Factura Pago",
                        "Solicitar Input Factura Pago",
                    ],
                },
                {
                    name: "arbolTramite",
                    model: modelArbolTramite,
                    patterns: [
                        "Solicitar Arbol Tramite",
                        "Solicitar Menu Arbol Tramite",
                        "Alerta No Entiendo - Solicitar Arbol Tramite",
                        "Procesar Submenu Tramite",
                        "Alerta No Entiendo - Submenu Tramite",
                        "Solicitar Input Tramite",
                    ],
                },
                {
                    name: "arbolCreditoSeguro",
                    model: modelArbolCreditoSeguro,
                    patterns: [
                        "Solicitar Arbol Credito Seguro",
                        "Solicitar Menu Arbol Credito Seguro",
                        "Alerta No Entiendo - Solicitar Arbol Credito Seguro",
                        "Procesar Submenu Credito Seguro",
                        "Alerta No Entiendo - Submenu Credito Seguro",
                        "Solicitar Input Credito Seguro",
                    ],
                },
                {
                    name: "arbolEspAseo",
                    model: modelArbolEspAseo,
                    patterns: [
                        "Solicitar Arbol Esp Aseo",
                        "Solicitar Menu Arbol Esp Aseo",
                        "Alerta No Entiendo - Solicitar Arbol Esp Aseo",
                        "Procesar Submenu Esp Aseo",
                        "Alerta No Entiendo - Submenu Esp Aseo",
                        "Solicitar Input Esp Aseo",
                    ],
                },
                {
                    name: "arbolServicio",
                    model: modelArbolServicio,
                    patterns: [
                        "Solicitar Arbol Servicio",
                        "Solicitar Menu Arbol Servicio",
                        "Alerta No Entiendo - Solicitar Arbol Servicio",
                        "Procesar Submenu Servicio",
                        "Alerta No Entiendo - Submenu Servicio",
                        "Solicitar Input Servicio",
                    ],
                }
            ];


            const findModuleForArbol = (arbol) => {
                if (!arbol || typeof arbol !== "string") return null;
                const a = arbol.toLowerCase().trim();
                for (const m of modulesRouter) {
                    for (const p of m.patterns) {
                        const pattern = p.toLowerCase();
                        if (
                            a === pattern ||
                            a.startsWith(pattern) ||
                            a.startsWith(pattern + " ")
                        ) {
                            return m;
                        }
                    }
                }
                return null;
            };

            const delegadoModule = findModuleForArbol(arbolChat);
            if (
                delegadoModule &&
                delegadoModule.model &&
                typeof delegadoModule.model[delegadoModule.name] === "function"
            ) {
                return await delegadoModule.model[delegadoModule.name](
                    idChat,
                    remitente,
                    arbolChat,
                    contenido,
                    chatData
                );
            }

            // todo: Inicio Arbol
            // if (arbolChat === 'Inicio' || arbolChat === 'inicio' || contenido.toUpperCase() === 'INICIO') {
            //     const pasoArbol = dataEstatica.arbol[0];
            //     chatData.descripcion = 'Se empieza de nuevo el flujo del chat.';
            //     // Actualizar el chat
            //     await modelChat.actualizar(idChat, pasoArbol, chatData);
            //     return await modelMensaje.crear(idChat, remitente, dataEstatica.estadoMensaje[1], dataEstatica.tipoMensaje[0], dataEstatica.saludo, '-', dataEstatica.lecturaMensaje[0], 'Se crea el mensaje de bienvenida.', dataEstatica.estadoRegistro[0], dataEstatica.responsable);
            // }

            // todo: Interaccion AI Soul Arbol
            if (
                arbolChat === "Interaccion AI Soul" ||
                arbolChat === "Alerta No Entiendo"
            ) {
                // ! Se refiere a consumir el endpoint de interaccion AI Soul
                const result = await procesarMensajeAISoul(
                    idChat,
                    remitente,
                    contenido
                );
                return result || true; // Asegurar que siempre retorne algo válido
            }

            // todo: Procesar Encuesta Arbol
            if (
                arbolChat === dataEstatica.arbol.solicitoInicioEncuesta ||
                arbolChat === 'Alerta No Entiendo - Solicito Inicio Encuesta'
            ) {
                return await procesarEncuesta(idChat, remitente, contenido);
            }

            logger.warn(
                {
                    contexto: "model",
                    recurso: "arbolPrincipal.arbolPrincipal",
                    arbolChat,
                    idChat,
                    remitente,
                },
                "No se encontró condición válida para arbolChat"
            );
            return true;
        } catch (error) {
            // todo: Enviar mensaje de error por API
            const api = 'Widget Chat Web Triple A ';
            const procesoApi = 'Arbol Principal';
            logger.error({
                contexto: 'model',
                recurso: 'arbolPrincipal.arbolPrincipal',
                codigoRespuesta: 500,
                errorMensaje: error.message,
                errorStack: error.stack,
                idChat,
                remitente,
                api,
                procesoApi
            }, 'Error en v1/models/widget/arbolPrincipal.model.js → arbolPrincipal');
            return await errorAPI(api, procesoApi, error, idChat, remitente);
        }
    } else {
        return await chatCerrado(idChat, remitente);
    }
};

// ! FUNCIONES AUXILIARES
// todo: Solicitar Formulario Inicial Arbol
const solicitarFormularioInicial = async (idChat, remitente) => {
    const solicitarFormularioInicialArbol = dataEstatica.arbol.solicitarFormularioInicial;
    chatData.descripcion = 'Se solicita el formulario inicial.';
    await modelChat.actualizar(idChat, solicitarFormularioInicialArbol, chatData);
    return await crearMensaje(
        idChat,
        remitente,
        dataEstatica.configuracion.estadoMensaje.enviado,
        dataEstatica.configuracion.tipoMensaje.formulario,
        dataEstatica.mensajes.solicitarFormularioInicial,
        chatData.descripcion
    );
};

// todo: Solicitar Menu Arbol Principal
const solicitarMenuArbolPrincipal = async (idChat, remitente) => {
    try {
        const solicitarMenuArbolPrincipal = dataEstatica.arbol.solicitarMenuArbolPrincipal;
        chatData.descripcion = 'Se solicita el menú principal del árbol nuevamente.';
        const resultActualizar = await modelChat.actualizar(idChat, solicitarMenuArbolPrincipal, chatData);
        const resultCrearMensaje = await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.solicitarMenuArbolPrincipal, chatData.descripcion);
        return resultActualizar || resultCrearMensaje || true;
    } catch (error) {
        // ? Error api  
        const api = dataEstatica.configuracion.responsable;
        const procesoApi = 'Funcion solicitarMenuArbolPrincipal';
        console.log('❌ Error en v1/models/widget/arbolChatBot.model.js → solicitarMenuArbolPrincipal: ', error);
        return await errorAPI(api, procesoApi, error, idChat, remitente);
    }
};

// todo: Procesar Menu Arbol Principal
const procesarMenuArbolPrincipal = async (idChat, remitente, contenido) => {
    try {
        const contenidoNormalized = String(contenido).trim()

        // Opción 1: Estado / Reporte servicio
        if (contenidoNormalized === '1') {
            chatData.descripcion = 'Usuario seleccionó: Estado / Reporte servicio'
            const modulo = modelArbolControlServicio
            return await modulo.arbolControlServicio(
                idChat,
                remitente,
                'Solicitar Arbol Control Servicio',
                contenido,
                chatData
            )
        }

        // Opción 2: Factura y pagos
        if (contenidoNormalized === '2') {
            chatData.descripcion = 'Usuario seleccionó: Factura y pagos'
            const modulo = modelArbolFacturaPago
            return await modulo.arbolFacturaPago(
                idChat,
                remitente,
                'Solicitar Arbol Factura Pago',
                contenido,
                chatData
            )
        }

        // Opción 3: Trámites y consultas
        if (contenidoNormalized === '3') {
            chatData.descripcion = 'Usuario seleccionó: Trámites y consultas'
            const modulo = modelArbolTramite
            return await modulo.arbolTramite(
                idChat,
                remitente,
                'Solicitar Arbol Tramite',
                contenido,
                chatData
            )
        }

        // Opción 4: Créditos y seguros
        if (contenidoNormalized === '4') {
            chatData.descripcion = 'Usuario seleccionó: Créditos y seguros'
            const modulo = modelArbolCreditoSeguro
            return await modulo.arbolCreditoSeguro(
                idChat,
                remitente,
                'Solicitar Arbol Credito Seguro',
                contenido,
                chatData
            )
        }

        // Opción 5: Recolección especial aseo
        if (contenidoNormalized === '5') {
            chatData.descripcion = 'Usuario seleccionó: Recolección especial aseo'
            const modulo = modelArbolEspAseo
            return await modulo.arbolEspAseo(
                idChat,
                remitente,
                'Solicitar Arbol Esp Aseo',
                contenido,
                chatData
            )
        }

        // Opción 6: Solicitar servicio
        if (contenidoNormalized === '6') {
            chatData.descripcion = 'Usuario seleccionó: Solicitar servicio'
            const modulo = modelArbolServicio
            return await modulo.arbolServicio(
                idChat,
                remitente,
                'Solicitar Arbol Servicio',
                contenido,
                chatData
            )
        }

        // Opción no válida - Mostrar alerta y volver a solicitar menú
        const pasoArbol = "Alerta No Entiendo - Solicitar Menu Arbol Principal"
        const alertaNoEntiendo = dataEstatica.mensajes.alertaNoEntiendo

        const resultado = await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo)
        if (resultado) {
            return await solicitarMenuArbolPrincipal(idChat, remitente)
        }
        return false

    } catch (error) {
        const api = dataEstatica.configuracion.responsable
        const procesoApi = 'Procesar Menu Arbol Principal'
        logger.error({
            contexto: 'model',
            recurso: 'arbolPrincipal.procesarMenuArbolPrincipal',
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            api,
            procesoApi
        }, 'Error en v1/models/widget/arbolPrincipal.model.js → procesarMenuArbolPrincipal')
        return await errorAPI(api, procesoApi, error, idChat, remitente)
    }
}



// todo: Procesar Mensaje AI Soul Arbol
const procesarMensajeAISoul = async (idChat, remitente, contenido, chatDataParam = null, contextoArbol = 'arbolPrincipal') => {

    try {
        // Usar chatData pasado como parámetro o el global
        const chatDataToUse = chatDataParam || chatData;

        // Inicializar contador exclusivo para Soul Chat (no compartir con otros endpoints)
        if (
            chatDataToUse.controlPeticionesSoul === undefined ||
            chatDataToUse.controlPeticionesSoul === null ||
            chatDataToUse.controlPeticionesSoul === '-'
        ) {
            chatDataToUse.controlPeticionesSoul = 0;
        } else {
            chatDataToUse.controlPeticionesSoul = parseInt(chatDataToUse.controlPeticionesSoul) || 0;
        }
        
        // Cargar chatData actualizado desde la BD para asegurar que todos los datos estén actualizados
        // Obtener todos los datos del chat directamente usando una consulta por idChat
        const poolDB = require('../../../config/database.js');
        const connMySQL = await poolDB.getConnection();
        let rutaAdjuntosBD = '-'; // Variable para guardar rutaAdjuntos de BD fuera del scope
        try {
            const [rows] = await connMySQL.query(
                `SELECT 
                    cht_numero_poliza AS NUMERO_POLIZA,
                    cht_nombres_apellidos AS NOMBRES_APELLIDOS,
                    cht_tipo_documento AS TIPO_DOCUMENTO,
                    cht_numero_documento AS NUMERO_DOCUMENTO,
                    cht_numero_contacto AS NUMERO_CONTACTO,
                    cht_correo_electronico AS CORREO_ELECTRONICO,
                    cht_relacion_pedido AS RELACION_PEDIDO,
                    cht_autorizacion_datos_personales AS AUTORIZACION_DATOS_PERSONALES,
                    cht_adjuntos AS ADJUNTOS,
                    cht_ruta_adjuntos AS RUTA_ADJUNTOS,
                    cht_conversacion AS CONVERSACION
                FROM tbl_chat WHERE cht_id = ?`,
                [idChat]
            );
            if (rows && rows.length > 0) {
                const row = rows[0];
                
                // Actualizar datos del cliente desde BD
                if (row.NUMERO_POLIZA) chatDataToUse.numeroPoliza = row.NUMERO_POLIZA;
                if (row.NOMBRES_APELLIDOS) chatDataToUse.nombresApellidos = row.NOMBRES_APELLIDOS;
                if (row.TIPO_DOCUMENTO) chatDataToUse.tipoDocumento = row.TIPO_DOCUMENTO;
                if (row.NUMERO_DOCUMENTO) chatDataToUse.numeroDocumento = row.NUMERO_DOCUMENTO;
                if (row.NUMERO_CONTACTO) chatDataToUse.numeroContacto = row.NUMERO_CONTACTO;
                if (row.CORREO_ELECTRONICO) chatDataToUse.correoElectronico = row.CORREO_ELECTRONICO;
                if (row.RELACION_PEDIDO) chatDataToUse.relacionPedido = row.RELACION_PEDIDO;
                if (row.AUTORIZACION_DATOS_PERSONALES) chatDataToUse.autorizacionDatosPersonales = row.AUTORIZACION_DATOS_PERSONALES;
                
                // Actualizar adjuntos
                const adjuntosBD = row.ADJUNTOS || '-';
                rutaAdjuntosBD = row.RUTA_ADJUNTOS || '-';
                
                // IMPORTANTE: Si chatDataParam tiene rutaAdjuntos específica (viene del mensaje actual),
                // NO sobrescribirla con los datos de BD. Esto permite enviar solo los adjuntos del mensaje actual.
                // Solo actualizar desde BD si no hay rutaAdjuntos específica en chatDataParam
                if (chatDataParam && chatDataParam.rutaAdjuntos && chatDataParam.rutaAdjuntos !== '-') {
                    // Mantener los adjuntos específicos del mensaje actual que vienen en chatDataParam
                    chatDataToUse.adjuntos = chatDataParam.adjuntos || 'Si';
                    chatDataToUse.rutaAdjuntos = chatDataParam.rutaAdjuntos;
                } else {
                    // Si no hay adjuntos específicos en chatDataParam, usar los de BD
                    if (adjuntosBD === 'Si' && rutaAdjuntosBD && rutaAdjuntosBD !== '-') {
                        chatDataToUse.adjuntos = 'Si';
                        chatDataToUse.rutaAdjuntos = rutaAdjuntosBD;
                    } else {
                        chatDataToUse.adjuntos = 'No';
                        chatDataToUse.rutaAdjuntos = '-';
                    }
                }
                
                // Actualizar conversación
                if (row.CONVERSACION) {
                    chatDataToUse.conversacion = row.CONVERSACION;
                }
            } else {
                chatDataToUse.adjuntos = 'No';
                chatDataToUse.rutaAdjuntos = '-';
            }
        } finally {
            connMySQL.release();
        }
        
        // Determinar si ya se envió (y fue aceptado) el START a Soul Chat.
        // Se marca mediante chatData.resultadoApi persistiéndose como JSON con { soulChatStart: 'ok' }.
        let resultadoApiParsed = null;
        if (typeof chatDataToUse.resultadoApi === 'object') {
            resultadoApiParsed = chatDataToUse.resultadoApi;
        } else if (typeof chatDataToUse.resultadoApi === 'string' && chatDataToUse.resultadoApi !== '-') {
            try {
                resultadoApiParsed = JSON.parse(chatDataToUse.resultadoApi);
            } catch (e) {
                // Si no es JSON válido, intentar verificar directamente
                resultadoApiParsed = null;
            }
        }
        const startAceptado = !!(resultadoApiParsed && resultadoApiParsed.soulChatStart === 'ok') || 
                              chatDataToUse.resultadoApi === 'Message recived!' ||
                              (typeof chatDataToUse.resultadoApi === 'string' && chatDataToUse.resultadoApi.includes('soulChatStart'));

        // Verificar si hay adjuntos para enviar
        const tieneAdjuntos = chatDataToUse.adjuntos === 'Si' && chatDataToUse.rutaAdjuntos && chatDataToUse.rutaAdjuntos !== '-';

        // El árbol de decisión ya determina cuándo pasar a agente.
        // Si llegamos aquí, es porque el árbol decidió pasar a agente.
        // Si NO se ha enviado START antes, entonces es el mensaje inicial y se envía como START con todos los datos del cliente.
        // Si ya se envió START antes, entonces es un mensaje ATTENDING (siguiente mensaje en la conversación).
        const esMensajeInicial = !startAceptado;

        // Construir resumen del flujo del árbol desde la conversación
        let resumenFlujoArbol = null;
        if (chatDataToUse.conversacion) {
            resumenFlujoArbol = construirResumenFlujoArbol(chatDataToUse.conversacion);
        }

        // Determinar la solicitud del cliente:
        // 1. Prioridad: resumen del flujo del árbol (si existe)
        // 2. Fallback: contenido del mensaje actual (solo si es relevante y no genérico)
        let solicitudCliente = null;
        
        // Frases genéricas que NO deben agregarse al resumen
        const frasesGenericas = [
            'El usuario necesita asistencia',
            'Pasando a agente',
            'Usuario solicita asesor',
            'Contexto:',
            'Usuario requiere asesor',
            'El Usuario ha solicitado',
        ];
        
        const esContenidoGenerico = contenido && typeof contenido === 'string' && 
            frasesGenericas.some(frase => contenido.includes(frase));
        
        if (resumenFlujoArbol) {
            solicitudCliente = resumenFlujoArbol;
            // Solo agregar contenido adicional si es relevante y no genérico
            if (contenido && typeof contenido === 'string' && contenido.trim() && 
                !esContenidoGenerico &&
                !contenido.includes('He enviado los documentos') && 
                !contenido.includes('He adjuntado')) {
                solicitudCliente = `${resumenFlujoArbol}. ${contenido}`;
            }
        } else {
            // Si no hay resumen del flujo, usar el contenido solo si no es genérico
            if (!esContenidoGenerico) {
                solicitudCliente = typeof contenido === 'string' ? contenido : `${contenido}`;
            } else {
                solicitudCliente = 'Cliente requiere asistencia';
            }
        }

        // Si aún no tenemos nada útil, usar un mensaje genérico
        if (!solicitudCliente || solicitudCliente.trim() === '' || solicitudCliente === 'null') {
            solicitudCliente = 'Cliente requiere asistencia';
        }

        const mensajeDatosCliente = [
            'Cliente solicita su ayuda, estos son los datos del cliente:',
            `• Número de póliza: ${chatDataToUse.numeroPoliza || '-'}`,
            `• Nombres y apellidos: ${chatDataToUse.nombresApellidos || '-'}`,
            `• Tipo de documento: ${chatDataToUse.tipoDocumento || '-'}`,
            `• Número de documento: ${chatDataToUse.numeroDocumento || '-'}`,
            `• Número de contacto: ${chatDataToUse.numeroContacto || '-'}`,
            `• Correo Electrónico: ${chatDataToUse.correoElectronico || '-'}`,
            `• Relación con el pedido: ${chatDataToUse.relacionPedido || '-'}`,
            `• Autorización datos personales: ${chatDataToUse.autorizacionDatosPersonales || '-'}`,
            `• Adjuntos: ${chatDataToUse.adjuntos || 'No'}`,
            `• Solicitud del cliente: ${solicitudCliente}`,
        ].join('\n');

        // Función para capitalizar la primera letra del contenido
        const capitalizarPrimeraLetra = (str) => {
            if (!str || typeof str !== 'string') return str;
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        const mensajeAEnviar = esMensajeInicial ? mensajeDatosCliente : capitalizarPrimeraLetra(typeof contenido === 'string' ? contenido : `${contenido}`);

        // Construir estructura base del mensaje
        const estructuraMensaje = {
            provider: "web",
            canal: 3,
            idChat: idChat,
            remitente: remitente,  // Este es el valor del remitente
            estado: esMensajeInicial ? "START" : "ATTENDING",  // Estado del mensaje, "START" para inicial, "ATTENDING" para siguientes
            mensaje: mensajeAEnviar,  // El mensaje que envías
            type: "TEXT",  // Tipo de mensaje, por ejemplo, "TEXT" o "MEDIA" o "VOICE"
            responsable: dataEstatica.configuracion.responsable // responsable del cliente
        };

        // Solo incluir los datos del cliente si es el mensaje inicial
        if (esMensajeInicial) {
            estructuraMensaje.numeroPoliza = chatDataToUse.numeroPoliza || '-'; // número de póliza del cliente
            estructuraMensaje.nombresApellidos = chatDataToUse.nombresApellidos || '-'; // nombres y apellidos del cliente
            estructuraMensaje.tipoDocumento = chatDataToUse.tipoDocumento || '-'; // tipo de documento del cliente
            estructuraMensaje.numeroDocumento = chatDataToUse.numeroDocumento || '-'; // numero de documento del cliente
            estructuraMensaje.numeroContacto = chatDataToUse.numeroContacto || '-'; // numero de celular del cliente
            estructuraMensaje.correoElectronico = chatDataToUse.correoElectronico || '-'; // correo electronico del cliente
            estructuraMensaje.relacionPedido = chatDataToUse.relacionPedido || '-'; // relacion con el pedido del cliente
            estructuraMensaje.autorizacionDatosPersonales = chatDataToUse.autorizacionDatosPersonales || '-'; // autorizacion de datos personales del cliente
            estructuraMensaje.adjuntos = chatDataToUse.adjuntos || 'No'; // adjuntos del cliente
        }

        // Verificar si hay adjuntos para enviar (en mensaje inicial o en mensajes ATTENDING)
        let mensajeFinal = estructuraMensaje;

        // Si hay adjuntos (en mensaje inicial o en mensajes ATTENDING), construir FormData con los archivos
        if (tieneAdjuntos) {
            try {
                const formData = new FormData();
                
                // Agregar todos los campos del mensaje al FormData
                formData.append('provider', estructuraMensaje.provider);
                formData.append('canal', estructuraMensaje.canal);
                formData.append('idChat', estructuraMensaje.idChat);
                formData.append('remitente', estructuraMensaje.remitente);
                formData.append('estado', estructuraMensaje.estado);
                formData.append('mensaje', estructuraMensaje.mensaje);
                formData.append('type', estructuraMensaje.type);
                formData.append('responsable', estructuraMensaje.responsable);

                // Agregar datos del cliente si es mensaje inicial
                if (esMensajeInicial) {
                    if (estructuraMensaje.numeroPoliza) formData.append('numeroPoliza', estructuraMensaje.numeroPoliza);
                    if (estructuraMensaje.nombresApellidos) formData.append('nombresApellidos', estructuraMensaje.nombresApellidos);
                    if (estructuraMensaje.tipoDocumento) formData.append('tipoDocumento', estructuraMensaje.tipoDocumento);
                    if (estructuraMensaje.numeroDocumento) formData.append('numeroDocumento', estructuraMensaje.numeroDocumento);
                    if (estructuraMensaje.numeroContacto) formData.append('numeroContacto', estructuraMensaje.numeroContacto);
                    if (estructuraMensaje.correoElectronico) formData.append('correoElectronico', estructuraMensaje.correoElectronico);
                    if (estructuraMensaje.relacionPedido) formData.append('relacionPedido', estructuraMensaje.relacionPedido);
                    if (estructuraMensaje.autorizacionDatosPersonales) formData.append('autorizacionDatosPersonales', estructuraMensaje.autorizacionDatosPersonales);
                    if (estructuraMensaje.adjuntos) formData.append('adjuntos', estructuraMensaje.adjuntos);
                } else {
                    // En mensajes ATTENDING, también incluir el campo adjuntos si hay
                    if (chatDataToUse.adjuntos === 'Si') {
                        formData.append('adjuntos', 'Si');
                    }
                }

                // Determinar qué adjuntos enviar según el tipo de mensaje
                let rutasAdjuntosAEnviar = [];
                
                if (esMensajeInicial) {
                    // En mensaje inicial (START): enviar todos los adjuntos received acumulados hasta el momento
                    // Filtrar solo los adjuntos received (del cliente), excluir los send (del agente)
                    const todasLasRutas = chatDataToUse.rutaAdjuntos.split('|').filter(r => r && r.trim() !== '-');
                    rutasAdjuntosAEnviar = todasLasRutas.filter(ruta => {
                        const rutaNormalizada = ruta.trim();
                        // Solo incluir rutas que contengan /received/ (adjuntos del cliente)
                        // Excluir rutas que contengan /send/ (adjuntos del agente)
                        return rutaNormalizada.includes('/received/') && !rutaNormalizada.includes('/send/');
                    });
                    
                    logger.info({
                        contexto: 'model',
                        recurso: `${contextoArbol}.procesarMensajeAISoul`,
                        idChat,
                        remitente,
                        tipoMensaje: 'START',
                        totalAdjuntosAcumulados: todasLasRutas.length,
                        adjuntosReceivedAEnviar: rutasAdjuntosAEnviar.length
                    }, '📎 Mensaje inicial: Enviando todos los adjuntos received acumulados');
                } else {
                    // En mensajes ATTENDING: solo enviar los adjuntos del mensaje actual del cliente
                    // Prioridad 1: Si chatDataParam tiene rutaAdjuntos específica (viene del mensaje actual), usarla directamente
                    // Prioridad 2: Obtener el último mensaje del cliente para obtener sus adjuntos específicos
                    // Prioridad 3: Usar los adjuntos de chatData como fallback
                    
                    // Verificar si chatDataParam tiene adjuntos específicos del mensaje actual
                    // Si chatDataParam tiene rutaAdjuntos y es diferente de los acumulados en BD, son adjuntos específicos del mensaje actual
                    const tieneAdjuntosEspecificos = chatDataParam && 
                                                     chatDataParam.rutaAdjuntos && 
                                                     chatDataParam.rutaAdjuntos !== '-' &&
                                                     chatDataParam.rutaAdjuntos !== rutaAdjuntosBD;
                    
                    if (tieneAdjuntosEspecificos) {
                        // Usar directamente los adjuntos específicos que vienen en chatDataParam
                        const rutasChatDataParam = chatDataParam.rutaAdjuntos.split('|').filter(r => r && r.trim() !== '-');
                        rutasAdjuntosAEnviar = rutasChatDataParam.filter(ruta => {
                            const rutaNormalizada = ruta.trim();
                            return rutaNormalizada.includes('/received/') && !rutaNormalizada.includes('/send/');
                        });
                        
                        logger.info({
                            contexto: 'model',
                            recurso: `${contextoArbol}.procesarMensajeAISoul`,
                            idChat,
                            remitente,
                            tipoMensaje: 'ATTENDING',
                            adjuntosDesdeChatDataParam: rutasAdjuntosAEnviar.length,
                            rutaAdjuntosParam: chatDataParam.rutaAdjuntos,
                            rutaAdjuntosBD: rutaAdjuntosBD
                        }, '📎 Mensaje ATTENDING: Usando adjuntos específicos del mensaje actual desde chatDataParam');
                    } else {
                        // Si no hay adjuntos específicos en chatDataParam, obtener del último mensaje
                        try {
                            const ultimoMensaje = await modelMensaje.filtrarUltimoMensaje(remitente);
                            if (ultimoMensaje && ultimoMensaje.ENLACES && ultimoMensaje.ENLACES !== '-') {
                                // Obtener solo los adjuntos del último mensaje
                                const adjuntosUltimoMensaje = ultimoMensaje.ENLACES.split('|').filter(r => r && r.trim() !== '-');
                                // Filtrar solo los received (del cliente), excluir los send (del agente)
                                rutasAdjuntosAEnviar = adjuntosUltimoMensaje.filter(ruta => {
                                    const rutaNormalizada = ruta.trim();
                                    return rutaNormalizada.includes('/received/') && !rutaNormalizada.includes('/send/');
                                });
                                
                                logger.info({
                                    contexto: 'model',
                                    recurso: `${contextoArbol}.procesarMensajeAISoul`,
                                    idChat,
                                    remitente,
                                    tipoMensaje: 'ATTENDING',
                                    adjuntosUltimoMensaje: adjuntosUltimoMensaje.length,
                                    adjuntosReceivedAEnviar: rutasAdjuntosAEnviar.length
                                }, '📎 Mensaje ATTENDING: Enviando solo adjuntos del último mensaje');
                            } else {
                                // Si no hay adjuntos en el último mensaje, usar los que vienen en chatData
                                const rutasChatData = chatDataToUse.rutaAdjuntos.split('|').filter(r => r && r.trim() !== '-');
                                rutasAdjuntosAEnviar = rutasChatData.filter(ruta => {
                                    const rutaNormalizada = ruta.trim();
                                    return rutaNormalizada.includes('/received/') && !rutaNormalizada.includes('/send/');
                                });
                                
                                logger.info({
                                    contexto: 'model',
                                    recurso: `${contextoArbol}.procesarMensajeAISoul`,
                                    idChat,
                                    remitente,
                                    tipoMensaje: 'ATTENDING',
                                    adjuntosDesdeChatData: rutasAdjuntosAEnviar.length
                                }, '📎 Mensaje ATTENDING: Usando adjuntos desde chatData (fallback)');
                            }
                        } catch (error) {
                            logger.error({
                                contexto: 'model',
                                recurso: `${contextoArbol}.procesarMensajeAISoul`,
                                idChat,
                                remitente,
                                errorMensaje: error.message,
                                errorStack: error.stack
                            }, '❌ Error al obtener último mensaje, usando adjuntos de chatData');
                            // Fallback: usar los adjuntos de chatData
                            const rutasChatData = chatDataToUse.rutaAdjuntos.split('|').filter(r => r && r.trim() !== '-');
                            rutasAdjuntosAEnviar = rutasChatData.filter(ruta => {
                                const rutaNormalizada = ruta.trim();
                                return rutaNormalizada.includes('/received/') && !rutaNormalizada.includes('/send/');
                            });
                        }
                    }
                }
                
                // Si no hay adjuntos para enviar, continuar sin adjuntos
                if (rutasAdjuntosAEnviar.length === 0) {
                    logger.info({
                        contexto: 'model',
                        recurso: `${contextoArbol}.procesarMensajeAISoul`,
                        idChat,
                        remitente,
                        tipoMensaje: esMensajeInicial ? 'START' : 'ATTENDING'
                    }, 'ℹ️ No hay adjuntos received para enviar, continuando sin adjuntos');
                    mensajeFinal = estructuraMensaje;
                } else {
                    // El API de Soul Chat acepta el campo 'files' para enviar uno o más archivos
                    // Agregar cada archivo al FormData usando el campo 'files'
                    rutasAdjuntosAEnviar.forEach((rutaArchivo, index) => {
                    // Normalizar la ruta: puede venir como /files/... o files/...
                    let rutaNormalizada = rutaArchivo.trim();
                    if (!rutaNormalizada.startsWith('/')) {
                        rutaNormalizada = '/' + rutaNormalizada;
                    }
                    
                    // Construir la ruta completa del archivo en el servidor
                    const rutaCompleta = path.join(__dirname, '../../../uploads', rutaNormalizada);
                    
                    // Verificar que el archivo existe
                    if (fs.existsSync(rutaCompleta)) {
                        // Obtener el nombre del archivo desde la ruta
                        const nombreArchivo = path.basename(rutaCompleta);
                        
                        // El API de Soul Chat espera el campo 'files' para los archivos adjuntos
                        // Permite enviar uno o más archivos usando el mismo nombre de campo
                        const nombreCampo = 'files';
                        
                        // Agregar el archivo al FormData
                        formData.append(nombreCampo, fs.createReadStream(rutaCompleta), nombreArchivo);
                        
                        logger.info({
                            contexto: 'model',
                            recurso: `${contextoArbol}.procesarMensajeAISoul`,
                            idChat,
                            remitente,
                            archivo: nombreArchivo,
                            ruta: rutaCompleta,
                            nombreCampo: nombreCampo,
                            indice: index + 1,
                            totalArchivos: rutasAdjuntosAEnviar.length
                        }, '📎 Archivo adjunto agregado al FormData');
                    } else {
                        logger.warn({
                            contexto: 'model',
                            recurso: `${contextoArbol}.procesarMensajeAISoul`,
                            idChat,
                            remitente,
                            ruta: rutaCompleta
                        }, `⚠️ Archivo no encontrado: ${rutaCompleta}`);
                    }
                });

                    mensajeFinal = formData;
                    
                    logger.info({
                        contexto: 'model',
                        recurso: `${contextoArbol}.procesarMensajeAISoul`,
                        idChat,
                        remitente,
                        cantidadArchivos: rutasAdjuntosAEnviar.length
                    }, '📎 Enviando mensaje con adjuntos usando FormData');
                }
            } catch (error) {
                logger.error({
                    contexto: 'model',
                    recurso: `${contextoArbol}.procesarMensajeAISoul`,
                    idChat,
                    remitente,
                    errorMensaje: error.message,
                    errorStack: error.stack
                }, '❌ Error al construir FormData con adjuntos, enviando sin adjuntos');
                // Si hay error al construir FormData, enviar sin adjuntos
                mensajeFinal = estructuraMensaje;
            }
        }

        // Control de intentos SOLO para Soul Chat
        if (chatDataToUse.controlPeticionesSoul <= 5) {

            // ? Consumir servicio de AI Soul
            const response = await serviceSoulChat.procesarMensajeAISoul(mensajeFinal);
            chatDataToUse.resultadoApi = response.data;

            // Si la respuesta tiene status 200 o 202
            if (response.status === 200 || response.status === 202) {
                // Variables
                const pasoArbol = dataEstatica.arbol.interaccionAISoul;
                chatDataToUse.controlApi = dataEstatica.configuracion.controlApi.success;
                chatDataToUse.descripcion = esMensajeInicial
                    ? 'AI Soul ha recibido los datos del cliente (START).'
                    : 'AI Soul ha recibido el mensaje del cliente.';

                // Actualizar el chat
                // Persistimos un flag de inicio exitoso para diferenciar los siguientes mensajes
                try {
                    const persisted = {
                        soulChatStart: esMensajeInicial ? 'ok' : (startAceptado ? 'ok' : 'pending'),
                        response: response.data
                    };
                    chatDataToUse.resultadoApi = persisted;
                } catch (e) {
                    // Si no se puede envolver, dejamos el data crudo
                    chatDataToUse.resultadoApi = response.data;
                }
                const updateResult = await modelChat.actualizar(idChat, pasoArbol, chatDataToUse);
                return updateResult || true; // Asegurar que siempre retorne algo válido
            } else {
                // Variables
                const pasoArbol = dataEstatica.arbol.interaccionAISoul;
                chatDataToUse.controlPeticionesSoul++;
                chatDataToUse.descripcion = 'AI Soul esta presentando una novedad o incidencia técnica.';

                // Sincronizar contador genérico solo para fines de auditoría/log
                chatDataToUse.controlPeticiones = chatDataToUse.controlPeticionesSoul;

                // Actualizar el chat
                await modelChat.actualizar(idChat, pasoArbol, chatDataToUse);

                // todo: Enviar mensaje de error por API
                const api = 'Soul Chat';
                const procesoApi = 'Procesar Mensaje AI';
                const error = response;
                const errorResult = await errorAPI(api, procesoApi, error, idChat, remitente);
                return errorResult || false;
            }

        } else {
            // Se superó el límite de intentos de Soul Chat
            // Mantener sincronizado el contador genérico antes de cerrar
            chatDataToUse.controlPeticiones = chatDataToUse.controlPeticionesSoul;
            return await cerrarNovedadTecnicaLimiteIntentos(idChat, remitente);
        }

    } catch (error) {
        // Variables
        const pasoArbol = dataEstatica.arbol.interaccionAISoul;
        const chatDataToUse = chatDataParam || chatData;

        // Incrementar solo el contador específico de Soul Chat
        chatDataToUse.controlPeticionesSoul = (parseInt(chatDataToUse.controlPeticionesSoul) || 0) + 1;
        chatDataToUse.descripcion = 'AI Soul esta presentando una novedad o incidencia técnica.';

        // Sincronizar contador genérico solo para log
        chatDataToUse.controlPeticiones = chatDataToUse.controlPeticionesSoul;

        // Actualizar el chat
        await modelChat.actualizar(idChat, pasoArbol, chatDataToUse);

        const api = 'Soul Chat';
        const procesoApi = 'Procesar Mensaje AI';
        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.procesarMensajeAISoul`,
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            api,
            procesoApi,
            controlPeticiones: chatDataToUse.controlPeticionesSoul
        }, `Error en v1/models/widget/${contextoArbol}.model.js → procesarMensajeAISoul`);
        const errorResult = await errorAPI(api, procesoApi, error, idChat, remitente);
        // Si al incrementar el contador se superó el límite, cerrar inmediatamente
        if (chatDataToUse.controlPeticiones > 5) {
            return await cerrarNovedadTecnicaLimiteIntentos(idChat, remitente);
        }
        return errorResult || false;
    }
};

// todo: Solicitar Condicion Adjuntos Arbol
const solicitarCondicionAdjuntos = async (idChat, remitente, contenido) => {
    const solicitarCondicionAdjuntosArbol = dataEstatica.arbol[17];
    const descripcion = 'Se solicita adjuntar documentos.';
    await actualizarChat(idChat, solicitarCondicionAdjuntosArbol, descripcion, chatData);
    return await crearMensaje(idChat, remitente, dataEstatica.estadoMensaje[1], dataEstatica.tipoMensaje[0], dataEstatica.condicionAdjuntos, descripcion);
};

// todo: Procesar Condicion Adjuntos Arbol
const procesarCondicionAdjuntos = async (idChat, remitente, contenido) => {
    if (contenido === '1') {
        chatData.adjuntos = 'Si';
        return await solicitarConfirmarAdjuntos(idChat, remitente, contenido);
    } else if (contenido === '2') {
        chatData.adjuntos = 'No';
        chatData.rutaAdjuntos = '-';
        return await solicitarConfirmarEspacioAgendamiento(idChat, remitente);
    } else {
        return await manejarNoEntiendoYReintentar(idChat, remitente, 'Condicion Adjuntos');
    }
};

// todo: Solicitar Confirmar Adjuntos Arbol
const solicitarConfirmarAdjuntos = async (idChat, remitente, contenido) => {
    const solicitarConfirmarAdjuntosArbol = dataEstatica.arbol[18];
    const descripcion = 'Se solicita adjuntar documentos.';
    await actualizarChat(idChat, solicitarConfirmarAdjuntosArbol, descripcion, chatData);
    return await crearMensaje(idChat, remitente, dataEstatica.estadoMensaje[1], dataEstatica.tipoMensaje[1], dataEstatica.confirmarAdjuntos, descripcion);
};

// todo: Enviar los archivos adjuntos
const procesarArchivosAdjuntos = async (idChat, remitente, contenido) => {
    try {
        const enlacesChat = await modelChat.filtrarEnlaces(idChat);
        const rutaAdjuntos = enlacesChat.RUTA_ADJUNTOS;
        
        if (!rutaAdjuntos || rutaAdjuntos === '-') {
            logger.warn({
                contexto: 'model',
                recurso: 'arbolPrincipal.procesarArchivosAdjuntos',
                idChat,
                remitente
            }, 'No hay adjuntos para procesar');
            return true;
        }

        const APP_URL = process.env.APP_URL ? decrypt(process.env.APP_URL) : '';
        // Solo mostrar al cliente los adjuntos que él mismo ha enviado (carpeta received)
        const enlaces = rutaAdjuntos
            .split('|')
            .map(e => e.trim())
            .filter(e => e);        
        
        // Pasar el valor a la variable global
        chatData.rutaAdjuntos = rutaAdjuntos;

        let mensajeEnlaces = '<p id="archivosAdjuntosClienteArbol">✅ <b>Hemos recibido los siguientes archivos adjuntos:</b><br/><br/>';

        enlaces.forEach(enlace => {
            const nombreArchivo = enlace.split('/').pop();
            // Normalizar la ruta: asegurar formato /files/{idChat}-{remitente}/received/
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
            
            mensajeEnlaces += `📄 <a href="${APP_URL}/uploads${rutaEnlace}" target="_blank">${nombreArchivo}</a><br/><br/>`;
        });

        mensajeEnlaces += '</p>';

        const descripcion = 'Enlaces de archivos adjuntos enviados.';
        await crearMensaje(
            idChat, 
            remitente, 
            dataEstatica.configuracion.estadoMensaje.enviado, 
            dataEstatica.configuracion.tipoMensaje.multimedia, 
            mensajeEnlaces, 
            descripcion
        );

        // Retornar true - el flujo continuará según el estado del árbol actual
        return true;
    } catch (error) {
        logger.error({
            contexto: 'model',
            recurso: 'arbolPrincipal.procesarArchivosAdjuntos',
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente
        }, 'Error en procesarArchivosAdjuntos');
        return false;
    }
};

// todo: Actualizar ruta de adjuntos en chat
const actualizarRutaAdjuntos = async (idChat, enlaces) => {
    // Si hay enlaces, actualizar adjuntos a 'Si', sino mantener el valor actual
    const adjuntos = (enlaces && enlaces !== '-' && enlaces.trim() !== '') ? 'Si' : 'No';
    const query = `
        UPDATE tbl_chat
        SET cht_ruta_adjuntos = ?,
            cht_adjuntos = ?
        WHERE cht_id = ?;
    `;
    return await pool.query(query, [enlaces, adjuntos, idChat]);
};

// todo: Manejar no entender
const manejarNoEntiendo = async (idChat, remitente, pasoArbol, alertaNoEntiendo) => {
    try {
        chatData.descripcion = 'Se notifica que no se entiende el mensaje.';
        // Marcar el control de API como Warning en este caso
        chatData.controlApi = dataEstatica.configuracion.controlApi.warning;

        const result = await modelChat.actualizar(idChat, pasoArbol, chatData);

        const resultMensaje = await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, alertaNoEntiendo, chatData.descripcion);
        return true;
    } catch (error) {
        // todo: Enviar mensaje de error por API
        const api = 'Widget Chat Web Triple A';
        const procesoApi = 'Funcion manejarNoEntiendo';
        logger.error({
            contexto: 'model',
            recurso: 'arbolPrincipal.manejarNoEntiendo',
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            api,
            procesoApi
        }, 'Error en v1/models/widget/arbolPrincipal.model.js → manejarNoEntiendo');
        await errorAPI(api, procesoApi, error, idChat, remitente);
        return false;
    }
};


// todo: Crear mensaje del bot
const crearMensaje = async (idChat, remitente, estadoMensaje, tipoMensaje, contenido, descripcion) => {
    const enlaces = '-';
    const lectura = dataEstatica.configuracion.lecturaMensaje.noLeido;
    const estadoRegistro = dataEstatica.configuracion.estadoRegistro.activo;
    const responsable = dataEstatica.configuracion.responsable;

    try {
        let conversacionArr = [];
        if (chatData.conversacion && chatData.conversacion !== '-' && chatData.conversacion !== null) {
            try {
                conversacionArr = typeof chatData.conversacion === 'string'
                    ? JSON.parse(chatData.conversacion)
                    : chatData.conversacion;
                if (!Array.isArray(conversacionArr)) conversacionArr = [];
            } catch (e) {
                conversacionArr = [];
            }
        }

        // Obtener árbol actual ANTES de crear mensaje
        const chat = await modelChat.filtrar(remitente);
        let arbolActual = '-';
        if (chat && chat.length > 0) {
            arbolActual = chat[0].ARBOL || '-';
        }

        // ===== CLASIFICAR TIPOS DE MENSAJE =====

        // Mensajes con opciones (menús y submenús)
        const esMenuConOpciones = arbolActual && (
            arbolActual === 'Solicitar Menu Arbol Principal' ||
            arbolActual === 'Solicitar Menu Arbol Control Servicio' ||
            arbolActual === 'Solicitar Menu Arbol Factura Pago' ||
            arbolActual === 'Solicitar Menu Arbol Tramite' ||
            arbolActual === 'Solicitar Menu Arbol Credito Seguro' ||
            arbolActual === 'Solicitar Menu Arbol Esp Aseo' ||
            arbolActual === 'Solicitar Menu Arbol Servicio' ||
            arbolActual.startsWith('Procesar Submenu ')
        );

        // Mensajes de alerta (sin opciones)
        const esMensajeAlerta = arbolActual && (
            arbolActual.startsWith('Alerta No Entiendo')
        );

        // Mensajes estáticos informativos (sin opciones)
        const esMensajeEstatico = arbolActual && (
            arbolActual === 'Interrupciones Y Cierres' ||
            arbolActual === 'Regresar Al Menu Principal Despues IA' ||
            arbolActual === 'Interaccion AI Soul' ||
            tipoMensaje === dataEstatica.configuracion.tipoMensaje.finChat ||
            tipoMensaje === dataEstatica.configuracion.tipoMensaje.inactividad ||
            tipoMensaje === dataEstatica.configuracion.tipoMensaje.errorApi
        );

        // Mensajes de input (sin opciones)
        const esMensajeInput = arbolActual && arbolActual.startsWith('Solicitar Input ');

        // ===== CONSTRUIR ENTRADA BASE =====
        const entrada = {
            arbol: arbolActual,
            fecha: new Date().toISOString(),
            contenido: typeof contenido === 'string' ? contenido : String(contenido),
            idMensaje: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            remitente: remitente,
            tipoMensaje: tipoMensaje,
            estadoMensaje: estadoMensaje
        };

        // ===== AGREGAR CAMPO opcionSeleccionada SOLO SI ES MENÚ =====
        // Solo agregar opcionSeleccionada si es menú con opciones (y no es alerta/estático/input)
        if (esMenuConOpciones && !esMensajeAlerta && !esMensajeEstatico && !esMensajeInput) {
            entrada.opcionSeleccionada = null;
        }

        conversacionArr.push(entrada);
        chatData.conversacion = JSON.stringify(conversacionArr);

        try {
            await modelChat.appendConversacion(idChat, JSON.stringify(entrada));
        } catch (e) {
            await modelChat.actualizarConversacion(idChat, chatData.conversacion);
        }

        logger.info({
            contexto: 'model',
            recurso: 'arbolPrincipal.crearMensaje',
            idChat,
            remitente,
            tipoMensaje,
            arbol: arbolActual,
            esMenuConOpciones,
            esMensajeAlerta,
            esMensajeEstatico,
            esMensajeInput,
            tieneOpcionSeleccionada: entrada.hasOwnProperty('opcionSeleccionada')
        }, '🤖 Mensaje del bot creado');

    } catch (e) {
        logger.warn({
            contexto: 'model',
            recurso: 'arbolPrincipal.crearMensaje',
            error: e.message,
            idChat,
            remitente
        }, '⚠️ Error al actualizar conversación JSON');
    }

    return await modelMensaje.crear(
        idChat, remitente, estadoMensaje, tipoMensaje,
        contenido, enlaces, lectura, descripcion,
        estadoRegistro, responsable
    );
};

// todo: Cliente Desiste Arbol
const clienteDesiste = async (idChat, remitente) => {
    try {
        const pasoArbol = dataEstatica.arbol.clienteDesiste;
        chatData.descripcion = 'Cliente desiste de continuar con la atención en el sistema.';

        await modelChat.actualizar(idChat, pasoArbol, chatData);

        await crearMensaje(
            idChat,
            remitente,
            dataEstatica.configuracion.estadoMensaje.enviado,
            dataEstatica.configuracion.tipoMensaje.texto,
            dataEstatica.mensajes.clienteDesiste,
            chatData.descripcion
        );

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

        chatData.descripcion = 'Se envía mensaje de despedida.';
        return await crearMensaje(
            idChat,
            remitente,
            dataEstatica.configuracion.estadoMensaje.enviado,
            dataEstatica.configuracion.tipoMensaje.finChat,
            dataEstatica.mensajes.despedida,
            chatData.descripcion
        );
    } catch (error) {
        // todo: Enviar mensaje de error por API
        const api = 'Widget Chat Web Triple A ';
        const procesoApi = 'Cliente Desiste';
        logger.error({
            contexto: 'model',
            recurso: 'arbolPrincipal.clienteDesiste',
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            api,
            procesoApi
        }, 'Error en v1/models/widget/arbolPrincipal.model.js → clienteDesiste');
        return await errorAPI(api, procesoApi, error, idChat, remitente);
    }
};

// todo: Función para manejar errores de API
const errorAPI = async (api, procesoApi, error, idChat, remitente) => {
    // Variables
    let estadoMensaje = dataEstatica.configuracion.estadoMensaje.enviado;
    let tipoMensaje = dataEstatica.configuracion.tipoMensaje.errorApi;
    let contenidoAlertaErrorAPI = dataEstatica.mensajes.alertaErrorAPI;
    let descripcion = '';
    let resultadoApi = {};

    // Formatear el error dependiendo de la respuesta
    if (error.response && error.response.data) {
        descripcion = `API ${api} → ${error.response.data.title || procesoApi} - ${error.response.data.message || 'Error desconocido'} - Presenta novedad.`;
        resultadoApi = JSON.stringify({
            status: error.response.status,
            message: error.response.data.message,
            error: error.response.data.error,
            api: error.response.data.api
        });
    } else {
        descripcion = `API ${api} → ${procesoApi} - Presenta novedad.`;
        resultadoApi = JSON.stringify({
            status: error.status || 500,
            message: error.message || error.data || 'Error desconocido',
            error: error.toString()
        });
    }

    // todo: Actualizar chat
    const controlApi = dataEstatica.configuracion.controlApi.error;
    let connMySQL;
    try {
        // todo: Obtener conexión del pool
        connMySQL = await pool.getConnection();

        // Leer y actualizar contador de intentos (cht_control_peticiones)
        let nuevoControlPeticiones = 1;
        try {
            const [rows] = await connMySQL.query(
                'SELECT cht_control_peticiones AS CONTROL_PETICIONES FROM tbl_chat WHERE cht_id = ?',
                [idChat]
            );
            if (rows && rows.length > 0) {
                const actual = parseInt(rows[0].CONTROL_PETICIONES) || 0;
                nuevoControlPeticiones = actual + 1;
            }
        } catch (e) {
            // Si falla la lectura, usar valor por defecto = 1
            nuevoControlPeticiones = 1;
        }

        const query = `
            UPDATE tbl_chat
            SET 
                cht_descripcion = ?, 
                cht_control_api = ?,
                cht_resultado_api = ?,
                cht_control_peticiones = ?
            WHERE cht_id = ?;
        `;
        await connMySQL.query(query, [descripcion, controlApi, resultadoApi, nuevoControlPeticiones, idChat]);

        await crearMensaje(idChat, remitente, estadoMensaje, tipoMensaje, contenidoAlertaErrorAPI, descripcion);
    } catch (error) {
        logger.error({
            contexto: 'model',
            recurso: 'arbolPrincipal.errorAPI',
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            api,
            procesoApi
        }, 'Error en v1/models/widget/arbolPrincipal.model.js → errorAPI');
    } finally {
        // todo: Liberar conexión al pool
        if (connMySQL) connMySQL.release();
    }
    return false;
};

// todo: Cerrar por límite de intentos con mensaje de novedad técnica (Fin Chat)
const cerrarNovedadTecnicaLimiteIntentos = async (idChat, remitente) => {
    try {
        chatData.descripcion = 'Se presenta novedad con el servicio de Soul Chat, se procede a cerrar el chat por limite de intentos.';
        // Log informativo previo al cierre
        logger.info({
            contexto: 'model',
            recurso: 'arbolPrincipal.cerrarNovedadTecnicaLimiteIntentos',
            idChat,
            remitente,
            controlPeticiones: chatData.controlPeticiones,
            descripcion: chatData.descripcion
        }, 'Cierre por límite de intentos');
        await crearMensaje(
            idChat,
            remitente,
            dataEstatica.configuracion.estadoMensaje.enviado,
            dataEstatica.configuracion.tipoMensaje.finChat,
            dataEstatica.mensajes.novedadIncidenciaTecnica,
            chatData.descripcion
        );
        await modelChat.cerrar(
            remitente,
            dataEstatica.configuracion.estadoChat.recibido,
            dataEstatica.configuracion.estadoGestion.cerrado,
            dataEstatica.arbol.despedida,
            dataEstatica.configuracion.controlApi.error,
            chatData.descripcion,
            dataEstatica.configuracion.estadoRegistro.activo,
            dataEstatica.configuracion.responsable
        );
        // Log de éxito de cierre
        logger.info({
            contexto: 'model',
            recurso: 'arbolPrincipal.cerrarNovedadTecnicaLimiteIntentos',
            idChat,
            remitente,
            resultado: 'cerrado'
        }, 'Chat cerrado por límite de intentos');
        return false;
    } catch (error) {
        logger.error({
            contexto: 'model',
            recurso: 'arbolPrincipal.cerrarNovedadTecnicaLimiteIntentos',
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente
        }, 'Error en v1/models/widget/arbolPrincipal.model.js → cerrarNovedadTecnicaLimiteIntentos');
        return false;
    }
};

// todo: Crear alerta de inactividad
const crearAlertaInactividad = async (idChatWeb, descripcion, nombreCliente = null) => {
    const chat = await modelChat.filtrar(idChatWeb);
    if (chat.length > 0) {
        const idChat = chat[0].ID_CHAT;
        const remitente = idChatWeb;
        const estadoMensaje = dataEstatica.configuracion.estadoMensaje.enviado;
        const tipoMensaje = dataEstatica.configuracion.tipoMensaje.inactividad;

        // Validar si el nombre del cliente es válido
        const esNombreValido = nombreCliente && nombreCliente.trim() && nombreCliente !== '-';

        // Construir el contenido del mensaje según el tiempo de inactividad
        let contenido;
        if (descripcion.includes('2 minutos')) {
            contenido = esNombreValido
                ? `<p class=\"alertaInactividadArbol\"><b>Inactividad de 2 minutos.</b><br/><br/>
                    ⏳ Apreciado(a) ${nombreCliente}, hemos notado que lleva 2 minutos de inactividad.<br/><br/>
                    🤔 ¿Necesita ayuda? <br/><br/>
                    💬 Estamos aquí para asistirle. <br/><br/> 
                    👉 Por favor, responda a su última interacción para continuar. 😊</p>`
                : `<p class=\"alertaInactividadArbol\"><b>Inactividad de 2 minutos.</b><br/><br/>
                    ⏳ Apreciado Usuario, hemos notado que lleva 2 minutos de inactividad.<br/><br/>
                    🤔 ¿Necesita ayuda? <br/><br/> 
                    💬 Estamos aquí para asistirle. <br/><br/> 
                    👉 Por favor, responda a su última interacción para continuar. 😊</p>`;
        } else if (descripcion.includes('3 minutos')) {
            contenido = esNombreValido
                ? `<p class=\"alertaInactividadArbol\"><b>Inactividad de 3 minutos.</b><br/><br/>
                    ⏳ Apreciado(a) ${nombreCliente}, lleva 3 minutos de inactividad.<br/><br/>
                    ⚠️ Recuerde que si no responde, la sesión se cerrará automáticamente.<br/><br/>
                    💬 Responda por favor para mantener la conversación activa.</p>`
                : `<p class=\"alertaInactividadArbol\"><b>Inactividad de 3 minutos.</b><br/><br/>
                    ⏳ Apreciado Usuario, lleva 3 minutos de inactividad.<br/><br/>
                    ⚠️ Recuerde que si no responde, la sesión se cerrará automáticamente.<br/><br/>
                    💬 Responda por favor para mantener la conversación activa.</p>`;
        } else if (descripcion.includes('4 minutos')) {
            contenido = esNombreValido
                ? `<p class=\"alertaInactividadArbol\"><b>Inactividad de 4 minutos.</b><br/><br/>
                    ⚠️ Apreciado(a) ${nombreCliente}, su sesión se cerrará en 1 minuto por inactividad.<br/><br/>
                    🚨 ¡Última advertencia! <br/><br/>
                    💬 Responda por favor ahora para mantener la conversación activa. <br/><br/>
                    👉 Si no responde, el chat se cerrará automáticamente. 😔</p>`
                : `<p class=\"alertaInactividadArbol\"><b>Inactividad de 4 minutos.</b><br/><br/>
                    ⚠️ Apreciado Usuario, su sesión se cerrará en 1 minuto por inactividad.<br/><br/>
                    🚨 ¡Última advertencia! <br/><br/>
                    💬 Responda por favor ahora para mantener la conversación activa. <br/><br/>
                    👉 Si no responde, el chat se cerrará automáticamente. 😔</p>`;
        }

        await crearMensaje(idChat, remitente, estadoMensaje, tipoMensaje, contenido, descripcion);
    }
};

// todo: Crear mensaje de cierre por inactividad
const crearMensajeCierreInactividad = async (idChatWeb) => {
    const chat = await modelChat.filtrar(idChatWeb);
    if (chat.length > 0) {
        const idChat = chat[0].ID_CHAT;
        const remitente = idChatWeb;
        const estadoMensaje = dataEstatica.configuracion.estadoMensaje.enviado;
        const tipoMensaje = dataEstatica.configuracion.tipoMensaje.finChat;
        const contenido = `<p class=\"mensajeCierreInactividadArbol\"><b>Chat cerrado por inactividad</b><br/><br/>
        🚫 Su sesión ha finalizado debido a un periodo prolongado de inactividad (5 minutos). <br/><br/>
        💬 ¡Estamos aquí para ayudarle! 😊<br/><br/>
        👉 <b>Por favor, cierre esta ventana y vuelva a abrir el chat para iniciar una nueva conversación.</b></p>`;
        const enlaces = '-';
        const lectura = dataEstatica.configuracion.lecturaMensaje.noLeido;
        const estadoRegistro = dataEstatica.configuracion.estadoRegistro.activo;
        const responsable = dataEstatica.configuracion.responsable;
        const descripcion = 'Chat cerrado por inactividad.';

        await modelMensaje.crear(idChat, remitente, estadoMensaje, tipoMensaje, contenido, enlaces, lectura, descripcion, estadoRegistro, responsable);
    }
};

// todo: Chat cerrado
const chatCerrado = async (idChat, remitente) => {
    const enlaces = '-';
    const lectura = dataEstatica.configuracion.lecturaMensaje.noLeido;
    const estadoRegistro = dataEstatica.configuracion.estadoRegistro.activo;
    const responsable = dataEstatica.configuracion.responsable;
    const descripcion = 'Este chat está actualmente cerrado.'
    return await crearMensaje(
        idChat,
        remitente,
        dataEstatica.configuracion.estadoMensaje.enviado,
        dataEstatica.configuracion.tipoMensaje.finChat,
        dataEstatica.mensajes.chatDiferenteAbierto,
        descripcion,
        enlaces,
        lectura,
        estadoRegistro,
        responsable
    );
};





const procesarVolver = async (idChat, remitente, destinoVolver, chatData, contextoArbol) => {
    try {
        chatData.descripcion = `Usuario solicita volver a: ${destinoVolver}`

        // Volver al menú principal
        if (destinoVolver === 'menu_principal') {
            await modelChat.actualizar(idChat, dataEstatica.arbol.solicitarMenuArbolPrincipal, chatData)
            return await solicitarMenuArbolPrincipal(idChat, remitente)
        }

        // Volver a Control de Servicio
        if (destinoVolver === 'control_servicio') {
            const modulo = modelArbolControlServicio
            return await modulo.solicitarMenuArbolControlServicio(idChat, remitente, chatData)
        }

        // Volver a Factura y Pago
        if (destinoVolver === 'factura_pago') {
            const modulo = modelArbolFacturaPago
            return await modulo.solicitarMenuArbolFacturaPago(idChat, remitente, chatData)
        }

        // Volver a Trámite
        if (destinoVolver === 'tramite') {
            const modulo = modelArbolTramite
            return await modulo.solicitarMenuArbolTramite(idChat, remitente, chatData)
        }

        // Destino no reconocido - volver al menú principal por defecto
        logger.warn({
            contexto: 'model',
            recurso: `${contextoArbol}.procesarVolver`,
            destinoVolver,
            idChat,
            remitente
        }, `Destino de volver no encontrado: ${destinoVolver}, redirigiendo a menú principal`)

        await modelChat.actualizar(idChat, dataEstatica.arbol.solicitarMenuArbolPrincipal, chatData)
        return await solicitarMenuArbolPrincipal(idChat, remitente)

    } catch (error) {
        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.procesarVolver`,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            destinoVolver
        }, 'Error en procesarVolver')
        throw error
    }
}



// todo: Registrar mensaje del usuario en la conversación
const registrarMensajeUsuario = async (idChat, remitente, contenido, arbolChat) => {
    try {
        let conversacionArr = [];
        if (chatData.conversacion && chatData.conversacion !== '-' && chatData.conversacion !== null) {
            try {
                conversacionArr = typeof chatData.conversacion === 'string'
                    ? JSON.parse(chatData.conversacion)
                    : chatData.conversacion;
                if (!Array.isArray(conversacionArr)) conversacionArr = [];
            } catch (e) {
                conversacionArr = [];
            }
        }

        // ===== BUSCAR ÚLTIMO MENSAJE DEL BOT *SIN* OPCIÓN YA ASIGNADA =====
        const ultimoMensajeBot = conversacionArr
            .slice()
            .reverse()
            .find(msg =>
                msg.estadoMensaje === "Enviado" &&
                msg.hasOwnProperty('opcionSeleccionada') &&
                msg.opcionSeleccionada === null  // ⭐ SOLO SI AÚN NO TIENE OPCIÓN
            );

        // DETECTAR SI ES OPCIÓN NUMÉRICA 
        const contenidoTrimmed = String(contenido).trim();
        const esOpcionNumerica = /^\d+$/.test(contenidoTrimmed);

        // VERIFICAR CONTEXTO DE MENÚ 
        const esContextoMenu = arbolChat && (
            arbolChat.includes('Menu Arbol') ||
            arbolChat.startsWith('Procesar Submenu') ||
            arbolChat === 'Solicitar Menu Arbol Principal'
        );

        // ACTUALIZAR OPCIÓN EN ÚLTIMO MENSAJE DEL BOT 
        if (ultimoMensajeBot && esOpcionNumerica && esContextoMenu) {
            ultimoMensajeBot.opcionSeleccionada = parseInt(contenidoTrimmed);

            // Actualizar en BD
            chatData.conversacion = JSON.stringify(conversacionArr);
            await modelChat.actualizarConversacion(idChat, chatData.conversacion);

            logger.info({
                contexto: 'model',
                recurso: 'arbolPrincipal.registrarMensajeUsuario',
                idChat,
                remitente,
                accion: 'actualizar_opcion',
                opcionSeleccionada: parseInt(contenidoTrimmed),
                mensajeBotId: ultimoMensajeBot.idMensaje,
                arbolChat
            }, '✅ Opción actualizada en último mensaje del bot');

            return true;
        }

        // SI NO ES OPCIÓN VÁLIDA, CREAR NUEVO REGISTRO DE MENSAJE
        const entradaUsuario = {
            arbol: arbolChat || '-',
            fecha: new Date().toISOString(),
            contenido: typeof contenido === 'string' ? contenido : String(contenido),
            idMensaje: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            remitente: remitente,
            tipoMensaje: 'Texto',
            estadoMensaje: 'Recibido'
        };

        conversacionArr.push(entradaUsuario);
        chatData.conversacion = JSON.stringify(conversacionArr);

        try {
            await modelChat.appendConversacion(idChat, JSON.stringify(entradaUsuario));
        } catch (e) {
            await modelChat.actualizarConversacion(idChat, chatData.conversacion);
        }

        logger.info({
            contexto: 'model',
            recurso: 'arbolPrincipal.registrarMensajeUsuario',
            idChat,
            remitente,
            accion: 'nuevo_mensaje',
            contenido: contenidoTrimmed,
            arbolChat
        }, '📝 Mensaje de texto libre registrado');

        return true;
    } catch (e) {
        logger.warn({
            contexto: 'model',
            recurso: 'arbolPrincipal.registrarMensajeUsuario',
            error: e.message,
            idChat,
            remitente
        }, '⚠️ No se pudo registrar mensaje del usuario');
        return false;
    }
};







// ! VALIDADORES
const validadores = {
    // Validar tipo numérico
    esNumerico: (valor) => /^\d+$/.test(valor),

    // Validar tipo texto (solo letras y espacios)
    esTexto: (valor) => !/^\d+$/.test(valor) && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor),

    // Validar tipo alfanumérico
    esAlfanumerico: (valor) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/.test(valor),


    // Validar dirección (permite #, -, /, etc.)
    esDireccion: (valor) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s#\-\/.,()]+$/.test(valor),


    // Validar nombre propio (sin números, mínimo palabras, etc)
    esNombreValido: (valor, minPalabras = 2) => {
        if (/\d/.test(valor)) return { valido: false, mensaje: 'El nombre no debe contener números.' };
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) return { valido: false, mensaje: 'El nombre solo debe contener letras y espacios.' };

        const palabras = valor.split(/\s+/).filter(p => p.length > 0);
        if (palabras.length < minPalabras) return { valido: false, mensaje: `Por favor ingresa al menos ${minPalabras} palabras (nombre y apellido).` };

        const palabrasCortas = palabras.filter(p => p.length < 2);
        if (palabrasCortas.length > 0) return { valido: false, mensaje: 'Cada nombre o apellido debe tener al menos 2 letras.' };

        return { valido: true };
    },

    // Formatear nombre propio (Primera letra mayúscula)
    formatearNombre: (valor) => {
        return valor
            .toLowerCase()
            .split(' ')
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
            .join(' ');
    }
};

// ! FUNCIÓN AUXILIAR PARA MOSTRAR ALERTA Y REINTENTAR
const mostrarAlertaYReintentar = async (
    idChat,
    remitente,
    mensaje,
    campoEnCurso,
    submenuSiguiente,
    chatData,
    contextoArbol,
    solicitarInputFn,
    mensajePersonalizado = null
) => {

    await crearMensaje(
        idChat,
        remitente,
        dataEstatica.configuracion.estadoMensaje.enviado,
        dataEstatica.configuracion.tipoMensaje.texto,
        `<p class="alertaArbol">⚠️ <b>Formato inválido.</b><br/><br/>${mensaje}</p>`,
        'Alerta validación'
    );

    return await solicitarInputFn(
        idChat,
        remitente,
        campoEnCurso,
        submenuSiguiente,
        chatData,
        contextoArbol,
        mensajePersonalizado
    );
};

// ! FUNCIÓN PRINCIPAL DE PROCESAMIENTO DE INPUTS
const procesarInputUsuario = async (
    idChat,
    remitente,
    contenido,
    chatData,
    contextoArbol,
    solicitarInputFn,
    mostrarSubmenuFn
) => {
    try {
        const campoEnCurso = chatData.inputEnCurso;
        const submenuSiguiente = chatData.submenuPendiente;

        if (!campoEnCurso || campoEnCurso === '-') {
            throw new Error('No hay contexto de input activo');
        }

        const inputConfig = dataEstatica.inputsConfig[campoEnCurso];
        if (!inputConfig) {
            throw new Error(`Configuración no encontrada para campo: ${campoEnCurso}`);
        }

        const contenidoNormalizado = String(contenido).trim();

        // ===== VALIDACIONES POR TIPO =====
        switch (inputConfig.tipo) {
            case 'numerico':
                if (!validadores.esNumerico(contenidoNormalizado)) {
                    return await mostrarAlertaYReintentar(
                        idChat, remitente,
                        'Por favor ingrese solo números.',
                        campoEnCurso, submenuSiguiente, chatData, contextoArbol,
                        solicitarInputFn,
                        chatData.mensajePersonalizadoEnCurso
                    );
                }
                break;

            case 'texto':
                if (!validadores.esTexto(contenidoNormalizado)) {
                    return await mostrarAlertaYReintentar(
                        idChat, remitente,
                        'El texto solo debe contener letras y espacios.',
                        campoEnCurso, submenuSiguiente, chatData, contextoArbol,
                        solicitarInputFn,
                        chatData.mensajePersonalizadoEnCurso
                    );
                }
                break;

            case 'texto_alfanumerico':
                if (!validadores.esAlfanumerico(contenidoNormalizado)) {
                    return await mostrarAlertaYReintentar(
                        idChat, remitente,
                        'Solo se permiten letras, números y espacios.',
                        campoEnCurso, submenuSiguiente, chatData, contextoArbol,
                        solicitarInputFn,
                        chatData.mensajePersonalizadoEnCurso
                    );
                }
                break;


            case 'texto_direccion':
                if (!validadores.esDireccion(contenidoNormalizado)) {
                    return await mostrarAlertaYReintentar(
                        idChat, remitente,
                        'La dirección solo puede contener letras, números, espacios y los caracteres: # - / . , ( )',
                        campoEnCurso, submenuSiguiente, chatData, contextoArbol,
                        solicitarInputFn,
                        chatData.mensajePersonalizadoEnCurso
                    );
                }
                break;

            case 'texto_nombre':
                const resultadoNombre = validadores.esNombreValido(contenidoNormalizado, inputConfig.minPalabras);
                if (!resultadoNombre.valido) {
                    return await mostrarAlertaYReintentar(
                        idChat, remitente,
                        resultadoNombre.mensaje,
                        campoEnCurso, submenuSiguiente, chatData, contextoArbol,
                        solicitarInputFn,
                        chatData.mensajePersonalizadoEnCurso
                    );
                }
                break;
        }

        // ===== VALIDACIÓN DE LONGITUD =====
        if (inputConfig.minCaracteres && contenidoNormalizado.length < inputConfig.minCaracteres) {
            const alertaMin = dataEstatica.mensajes.mensajesValidacion.alertaLongitudMinima(
                inputConfig.campo,
                inputConfig.minCaracteres
            );
            await crearMensaje(
                idChat, remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.texto,
                alertaMin,
                'Alerta longitud mínima'
            );
            return await solicitarInputFn(idChat, remitente, campoEnCurso, submenuSiguiente, chatData, contextoArbol, chatData.mensajePersonalizadoEnCurso);
        }

        if (inputConfig.maxCaracteres && contenidoNormalizado.length > inputConfig.maxCaracteres) {
            const alertaMax = dataEstatica.mensajes.mensajesValidacion.alertaLongitudMaxima(
                inputConfig.campo,
                inputConfig.maxCaracteres
            );
            await crearMensaje(
                idChat, remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.texto,
                alertaMax,
                'Alerta longitud máxima'
            );
            return await solicitarInputFn(idChat, remitente, campoEnCurso, submenuSiguiente, chatData, contextoArbol, chatData.mensajePersonalizadoEnCurso);
        }

        // ===== FORMATEAR Y GUARDAR =====
        let valorFinal = contenidoNormalizado;
        if (inputConfig.tipo === 'texto_nombre') {
            valorFinal = validadores.formatearNombre(contenidoNormalizado);
        }

        chatData[inputConfig.campo] = valorFinal;
        chatData.descripcion = `Usuario ingresó ${inputConfig.campo}: ${valorFinal}`;
        chatData.inputEnCurso = '-';
        chatData.submenuPendiente = '-';
        chatData.mensajePersonalizadoEnCurso = '-';

        await modelChat.actualizar(idChat, `Input Recibido ${inputConfig.campo}`, chatData);

        logger.info({
            contexto: 'model',
            recurso: `${contextoArbol}.procesarInputUsuario`,
            idChat,
            remitente,
            campo: inputConfig.campo,
            valor: valorFinal
        }, 'Input validado y guardado correctamente');

        // ===== CONTINUAR SECUENCIA O IR AL SIGUIENTE PASO =====
        if (chatData.inputsSecuencia && chatData.inputsSecuencia !== '-') {
            try {
                const secuencia = JSON.parse(chatData.inputsSecuencia);
                const indexActual = secuencia.indexOf(campoEnCurso);

                if (indexActual !== -1 && indexActual < secuencia.length - 1) {
                    const siguienteCampo = secuencia[indexActual + 1];

                    logger.info({
                        contexto: 'model',
                        recurso: `${contextoArbol}.procesarInputUsuario`,
                        campoActual: campoEnCurso,
                        siguienteCampo
                    }, 'Continuando secuencia de inputs');

                    return await solicitarInputFn(
                        idChat,
                        remitente,
                        siguienteCampo,
                        submenuSiguiente,
                        chatData,
                        contextoArbol,
                        null  // No pasar mensaje personalizado para los siguientes inputs de la secuencia
                    );
                } else {
                    chatData.inputsSecuencia = '-';
                    await modelChat.actualizar(idChat, 'Secuencia Inputs Completada', chatData);
                }
            } catch (e) {
                logger.warn({ error: e.message }, 'Error parseando secuencia de inputs');
            }
        }

        if (submenuSiguiente && submenuSiguiente !== '-') {
            return await mostrarSubmenuFn(idChat, remitente, submenuSiguiente, chatData, contextoArbol);
        }

        return true;

    } catch (error) {
        logger.error({
            contexto: 'model',
            recurso: `${contextoArbol}.procesarInputUsuario`,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente
        }, 'Error en procesarInputUsuario');

        const api = 'Chat Web Triple A';
        const procesoApi = 'Procesar Input Usuario';
        return await errorAPI(api, procesoApi, error, idChat, remitente);
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
        return await crearMensaje(
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
        return await errorAPI(api, procesoApi, error, idChat, remitente);
    }
};

// todo: Procesar Encuesta Arbol
const procesarEncuesta = async (idChat, remitente, contenido) => {
    try {
        const respuesta = typeof contenido === 'string' ? contenido.trim() : '';
        const respuestaNumerica = parseInt(respuesta);

        // Validar que sea un número entre 1 y 5
        if (!isNaN(respuestaNumerica) && respuestaNumerica >= 1 && respuestaNumerica <= 5) {
            // Mapeo de opciones a texto descriptivo
            const opcionesEncuesta = {
                1: 'Muy insatisfecho',
                2: 'Insatisfecho',
                3: 'Indiferente',
                4: 'Satisfecho',
                5: 'Muy satisfecho'
            };

            const calificacionTexto = opcionesEncuesta[respuestaNumerica] || `Opción ${respuestaNumerica}`;

            // Guardar calificación en chatData
            chatData.calificacionEncuesta = respuestaNumerica;
            chatData.encuesta = String(respuestaNumerica); // Guardar como string para el campo cht_encuesta
            chatData.comentario = calificacionTexto;
            chatData.descripcion = `Encuesta de satisfacción finalizada. Calificación: ${respuestaNumerica} - ${calificacionTexto}. Se cierra el chat.`;

            // Actualizar el chat con los datos finales de la encuesta
            await modelChat.actualizar(idChat, dataEstatica.arbol.solicitoInicioEncuesta, chatData);

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

            // Enviar mensaje de despedida (Fin Chat)
            return await crearMensaje(
                idChat,
                remitente,
                dataEstatica.configuracion.estadoMensaje.enviado,
                dataEstatica.configuracion.tipoMensaje.finChat,
                dataEstatica.mensajes.despedida,
                chatData.descripcion
            );
        } else {
            const pasoArbol = 'Alerta No Entiendo - Solicito Inicio Encuesta';
            const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
            ⚠️ <i>Por favor seleccione una opción válida del 1 al 5 para calificar su satisfacción.</i></p>`;

            const resultado = await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);

            if (resultado) {
                // Mostrar nuevamente el mensaje de encuesta
                chatData.descripcion = 'Se solicita nuevamente la encuesta.';
                await modelChat.actualizar(idChat, dataEstatica.arbol.solicitoInicioEncuesta, chatData);
                return await crearMensaje(
                    idChat,
                    remitente,
                    dataEstatica.configuracion.estadoMensaje.enviado,
                    dataEstatica.configuracion.tipoMensaje.texto,
                    dataEstatica.mensajes.solicitoInicioEncuesta,
                    chatData.descripcion
                );
            }
            return false;
        }
    } catch (error) {
        const api = dataEstatica.configuracion.responsable;
        const procesoApi = 'Funcion procesarEncuesta';
        logger.error({
            contexto: 'model',
            recurso: 'arbolPrincipal.procesarEncuesta',
            codigoRespuesta: 500,
            errorMensaje: error.message,
            errorStack: error.stack,
            idChat,
            remitente,
            api,
            procesoApi
        }, 'Error en v1/models/widget/arbol/arbolPrincipal.model.js → procesarEncuesta');
        return await errorAPI(api, procesoApi, error, idChat, remitente);
    }
};


// ! EXPORTACIONES
module.exports = {
    arbolPrincipal,
    manejarNoEntiendo,
    clienteDesiste,
    errorAPI,
    cerrarNovedadTecnicaLimiteIntentos,
    solicitarFormularioInicial,
    solicitarMenuArbolPrincipal,
    procesarMenuArbolPrincipal,
    crearAlertaInactividad,
    crearMensajeCierreInactividad,
    chatCerrado,
    crearMensaje,
    procesarVolver,
    registrarMensajeUsuario,
    validadores,
    procesarInputUsuario,
    mostrarAlertaYReintentar,
    actualizarRutaAdjuntos,
    procesarArchivosAdjuntos,
    procesarMensajeAISoul,
    cerrarChatConDespedida,
    procesarEncuesta
};