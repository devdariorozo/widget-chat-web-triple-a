// ! ================================================================================================================================================
// !                                              SCRIPT DE TESTING - SOUL CHAT
// ! ================================================================================================================================================
// @autor Ramón Dario Rozo Torres
// @últimaModificación Ramón Dario Rozo Torres
// @versión 1.0.0
// v1/testing/testSoulChat.js

// ! REQUIRES
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const serviceSoulChat = require('../services/serviceSoulChat.service.js');
const logger = require('../logger');

// ! CONFIGURACIÓN
// * Número total de turnos de conversación (cada turno = mensaje usuario + respuesta IA)
const NUMERO_TURNOS = 20;

// * Número de usuarios simultáneos a simular (cambiar según necesidad)
const USUARIOS_SIMULTANEOS = 50;

// * Delay entre mensajes del usuario en milisegundos (opcional, para evitar saturar)
const DELAY_ENTRE_MENSAJES = 5000;

// * Tiempo de espera para la respuesta de la IA en milisegundos
const ESPERA_RESPUESTA_IA = 5000;

// * Mensajes de prueba predefinidos (para simular diferentes mensajes del usuario)
const MENSAJES_PRUEBA = [
    "Hola, necesito información sobre las votaciones en colombia.",
    "¿Cuándo son las próximas elecciones?",
    "¿Qué documentos necesito para votar?",
    "¿Dónde puedo consultar mi lugar de votación?",
    "Gracias por la información",
    "¿Hay algún requisito especial?",
    "Perfecto, eso me ayuda mucho",
    "¿Puedo cambiar mi lugar de votación?",
    "Entendido, gracias",
    "Muy bien, ya tengo toda la información que necesitaba"
];

// * Datos reales de la base de datos: IDs de chat y remitentes válidos
// Extraídos de la base de datos para usar en las pruebas
// Estos son datos reales que existen en la BD, permitiendo pruebas más realistas
const DATOS_REALES_BD = [
    { idChat: 1423, remitente: 'eafqizjlaiw' },  // Chat activo reciente
    { idChat: 363, remitente: '6rzg0wyp8mj' },   // Chat en interacción AI Soul
    { idChat: 314, remitente: 'vct284hu9qr' },   // Chat con datos completos
    { idChat: 311, remitente: 'bpdd7lzwnm5' },   // Chat con Message recived
    { idChat: 310, remitente: '56ggmsddbx' },    // Chat con datos formulario
    { idChat: 103, remitente: 'rnkkc7yojli' },   // Chat con datos completos
    { idChat: 72, remitente: 'dqdqi2sp7pc' },    // Chat con Message recived
    { idChat: 104, remitente: '2pbu1hz137e' },   // Chat con Message recived
    { idChat: 332, remitente: '64r650rll67' },   // Chat abierto
    { idChat: 333, remitente: 'bek8xj5loxr' },   // Chat abierto
    { idChat: 335, remitente: 'eybvb4qhvsl' },   // Chat abierto
    { idChat: 339, remitente: 'f2qrrgqcc8v' },   // Chat abierto
    { idChat: 342, remitente: 'm7l7kz9dzcp' },   // Chat abierto
    { idChat: 343, remitente: '6q8fw3sfqh' },    // Chat abierto
    { idChat: 346, remitente: 'lufno2uqeus' },   // Chat abierto
    { idChat: 347, remitente: 'q43qrihg0uq' },   // Chat abierto
    { idChat: 350, remitente: 'numsw9s12vf' },   // Chat abierto
    { idChat: 353, remitente: '0axp178im4l' },   // Chat abierto
    { idChat: 356, remitente: 'c4nh07isa16' },   // Chat abierto
    { idChat: 1, remitente: 'k4vo81mbjbc' },
    { idChat: 2, remitente: 'fyxjhdzrdms' },
    { idChat: 3, remitente: 't9bbanfjeof' },
    { idChat: 4, remitente: '17ofkrtwtlv' },
    { idChat: 5, remitente: '19movpafdtm' },
    { idChat: 6, remitente: 'b7hv1g65bsc' },
    { idChat: 7, remitente: '2214v8oe1zs' },
    { idChat: 8, remitente: 'wy1k2j07uo' },
    { idChat: 9, remitente: 'uear69tspa' },
    { idChat: 10, remitente: '18wipja2ip2' }
];

// * Función para obtener datos reales de BD (retorna un objeto aleatorio)
const obtenerDatosRealesBD = (index) => {
    // Si hay datos disponibles, usar uno basado en el índice
    if (DATOS_REALES_BD.length > 0) {
        const indice = index % DATOS_REALES_BD.length;
        return DATOS_REALES_BD[indice];
    }
    // Fallback: generar datos de prueba
    return {
        idChat: `TEST_CHAT_${Date.now()}_${index}`,
        remitente: `TEST_USER_${index}`
    };
};

// ! FUNCIONES AUXILIARES
// * Generar un ID de chat único
const generarIdChat = (index) => {
    return `TEST_CHAT_${Date.now()}_${index}`;
};

// * Generar un remitente único
const generarRemitente = (index) => {
    return `TEST_USER_${index}`;
};

// * Obtener un mensaje aleatorio de la lista
const obtenerMensajeAleatorio = () => {
    return MENSAJES_PRUEBA[Math.floor(Math.random() * MENSAJES_PRUEBA.length)];
};

// * Crear estructura de mensaje para testing
const crearEstructuraMensaje = (idChat, remitente, mensaje, estado = 'START') => {
    // Extraer índice del remitente si es TEST_USER_X, sino usar un valor por defecto
    const remitenteIndex = remitente.includes('_') && remitente.split('_').length > 2 
        ? remitente.split('_')[2] 
        : remitente.substring(remitente.length - 1) || '0';
    
    return {
        provider: "web",
        canal: 3,
        idChat: idChat,
        remitente: remitente,
        estado: estado, // "START", "ATTENDING" o "END"
        mensaje: mensaje,
        type: "TEXT",
        // Campos opcionales (puedes agregar más datos de prueba si es necesario)
        numeroPoliza: `001${remitenteIndex}`,
        nombres: `Usuario ${remitenteIndex}`,
        apellidos: "Test",
        tipoDocumento: `CC`,
        numeroDocumento: `123456789${remitenteIndex}`,
        paisResidencia: "Colombia",
        ciudadResidencia: "Bogotá",
        indicativoPais: "+57",
        numeroContacto: `300000000${remitenteIndex}`,
        correoElectronico: `test${remitenteIndex}@example.com`,
        relacionPedido: "Cliente",
        autorizacionDatosPersonales: true,
        responsable: "Testing"
    };
};

// * Función para enviar un mensaje del usuario a la IA
const enviarMensaje = async (idChat, remitente, mensaje, numeroTurno, estado = 'START') => {
    const estructuraMensaje = crearEstructuraMensaje(idChat, remitente, mensaje, estado);
    
    try {
        const inicio = Date.now();
        const response = await serviceSoulChat.procesarMensajeAISoul(estructuraMensaje);
        const tiempo = Date.now() - inicio;
        
        return {
            success: true,
            numeroTurno,
            idChat,
            remitente,
            mensajeUsuario: mensaje,
            estado,
            status: response.status,
            tiempo: `${tiempo}ms`,
            respuestaIA: response.data || null,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            success: false,
            numeroTurno,
            idChat,
            remitente,
            mensajeUsuario: mensaje,
            estado,
            error: error.message,
            status: error.response?.status || 'N/A',
            errorData: error.response?.data || null,
            timestamp: new Date().toISOString()
        };
    }
};

// * Función para esperar la respuesta de la IA
const esperarRespuestaIA = async (tiempoEspera = ESPERA_RESPUESTA_IA) => {
    await new Promise(resolve => setTimeout(resolve, tiempoEspera));
};

// * Función para simular un usuario en una conversación completa con la IA
const simularUsuario = async (usuarioIndex, turnosPorUsuario) => {
    // Obtener datos reales de la base de datos
    const datosReales = obtenerDatosRealesBD(usuarioIndex);
    const idChat = datosReales.idChat;
    const remitente = datosReales.remitente;
    const resultados = [];
    
    logger.info({
        contexto: 'testing',
        recurso: 'testSoulChat.simularUsuario',
        usuarioIndex,
        idChat,
        remitente,
        turnosPorUsuario
    }, `🔄 Iniciando simulación de conversación - Usuario ${usuarioIndex + 1} (${remitente})`);
    
    // Primer turno: mensaje inicial con estado START
    for (let turno = 0; turno < turnosPorUsuario; turno++) {
        const numeroTurno = turno + 1;
        const mensaje = turno === 0 
            ? MENSAJES_PRUEBA[0] // Primer mensaje siempre es el inicial
            : obtenerMensajeAleatorio(); // Mensajes siguientes aleatorios
        
        // Determinar estado: START para el primero, ATTENDING para los demás
        const estado = turno === 0 ? 'START' : 'ATTENDING';
        
        // 1. Enviar mensaje del usuario
        console.log(`   👤 Usuario ${usuarioIndex + 1} [Turno ${numeroTurno}/${turnosPorUsuario}] → Enviando: "${mensaje.substring(0, 50)}${mensaje.length > 50 ? '...' : ''}"`);
        
        const resultado = await enviarMensaje(idChat, remitente, mensaje, numeroTurno, estado);
        resultados.push(resultado);
        
        if (resultado.success) {
            logger.info({
                contexto: 'testing',
                recurso: 'testSoulChat.simularUsuario',
                usuarioIndex,
                numeroTurno,
                estado,
                status: resultado.status,
                tiempo: resultado.tiempo
            }, `✓ Usuario ${usuarioIndex + 1} - Turno ${numeroTurno}/${turnosPorUsuario} enviado exitosamente`);
            
            // Mostrar respuesta de la IA si está disponible
            if (resultado.respuestaIA) {
                const respuestaTexto = JSON.stringify(resultado.respuestaIA).substring(0, 100);
                console.log(`   🤖 IA [Turno ${numeroTurno}] → Respuesta recibida: ${respuestaTexto}...`);
                logger.info({
                    contexto: 'testing',
                    recurso: 'testSoulChat.simularUsuario',
                    usuarioIndex,
                    numeroTurno,
                    respuestaIA: resultado.respuestaIA
                }, `Respuesta de IA recibida para turno ${numeroTurno}`);
            } else {
                console.log(`   ⏳ IA [Turno ${numeroTurno}] → Procesando respuesta...`);
            }
            
            // 2. Esperar respuesta de la IA (simulación) antes del siguiente mensaje
            if (turno < turnosPorUsuario - 1) {
                console.log(`   ⏱️  Esperando ${ESPERA_RESPUESTA_IA}ms para que la IA procese la respuesta...`);
                await esperarRespuestaIA();
            }
            
        } else {
            logger.error({
                contexto: 'testing',
                recurso: 'testSoulChat.simularUsuario',
                usuarioIndex,
                numeroTurno,
                error: resultado.error,
                status: resultado.status
            }, `✗ Usuario ${usuarioIndex + 1} - Turno ${numeroTurno}/${turnosPorUsuario} falló`);
            
            console.log(`   ❌ Error en turno ${numeroTurno}: ${resultado.error}`);
            
            // Si hay error, esperar un poco antes de continuar
            if (turno < turnosPorUsuario - 1) {
                await new Promise(resolve => setTimeout(resolve, DELAY_ENTRE_MENSAJES));
            }
        }
        
        // Delay entre turnos del mismo usuario (para simular tiempo de pensamiento)
        if (turno < turnosPorUsuario - 1 && DELAY_ENTRE_MENSAJES > 0) {
            await new Promise(resolve => setTimeout(resolve, DELAY_ENTRE_MENSAJES));
        }
    }
    
    // Opcional: Cerrar la conversación con estado END
    // const mensajeCierre = "Gracias, hasta luego";
    // const resultadoCierre = await enviarMensaje(idChat, remitente, mensajeCierre, turnosPorUsuario + 1, 'END');
    // resultados.push(resultadoCierre);
    
    console.log(`   ✅ Usuario ${usuarioIndex + 1} - Conversación completada (${turnosPorUsuario} turnos)\n`);
    
    return resultados;
};

// ! FUNCIÓN PRINCIPAL
const ejecutarTest = async () => {
    console.log('\n========================================================================================');
    console.log('                           ♦♦♦ TESTING SOUL CHAT - INICIANDO ♦♦♦');
    console.log('========================================================================================\n');
    
    console.log('📋 Configuración:');
    console.log(`   • Total de turnos por usuario: ${NUMERO_TURNOS}`);
    console.log(`   • Usuarios simultáneos: ${USUARIOS_SIMULTANEOS}`);
    console.log(`   • Delay entre mensajes: ${DELAY_ENTRE_MENSAJES}ms`);
    console.log(`   • Espera respuesta IA: ${ESPERA_RESPUESTA_IA}ms`);
    console.log(`   • URL API: ${process.env.URL_API_SOUL_CHAT}/v1/messenger/in-message`);
    console.log('\n');
    
    const inicioTotal = Date.now();
    const todosLosResultados = [];
    
    logger.info({
        contexto: 'testing',
        recurso: 'testSoulChat.ejecutarTest',
        configuracion: {
            numeroTurnos: NUMERO_TURNOS,
            usuariosSimultaneos: USUARIOS_SIMULTANEOS,
            delayEntreMensajes: DELAY_ENTRE_MENSAJES,
            esperaRespuestaIA: ESPERA_RESPUESTA_IA
        }
    }, 'Iniciando testing de Soul Chat - Modo conversación');
    
    // Crear array de promesas para simular usuarios en paralelo
    const promesasUsuarios = [];
    for (let i = 0; i < USUARIOS_SIMULTANEOS; i++) {
        promesasUsuarios.push(simularUsuario(i, NUMERO_TURNOS));
    }
    
    // Ejecutar todas las simulaciones en paralelo
    const resultadosPorUsuario = await Promise.all(promesasUsuarios);
    
    // Consolidar todos los resultados
    resultadosPorUsuario.forEach(resultados => {
        todosLosResultados.push(...resultados);
    });
    
    const resultadosFinales = todosLosResultados;
    
    const tiempoTotal = Date.now() - inicioTotal;
    
    // Calcular estadísticas
    const exitosos = resultadosFinales.filter(r => r.success).length;
    const fallidos = resultadosFinales.filter(r => !r.success).length;
    const tasaExito = ((exitosos / resultadosFinales.length) * 100).toFixed(2);
    
    // Calcular tiempos promedio
    const tiemposExitosos = resultadosFinales
        .filter(r => r.success && r.tiempo)
        .map(r => parseInt(r.tiempo.replace('ms', '')));
    const tiempoPromedio = tiemposExitosos.length > 0
        ? (tiemposExitosos.reduce((a, b) => a + b, 0) / tiemposExitosos.length).toFixed(2)
        : 0;
    
    // Mostrar resultados
    console.log('\n========================================================================================');
    console.log('                           ♦♦♦ TESTING SOUL CHAT - RESULTADOS ♦♦♦');
    console.log('========================================================================================\n');
    
    console.log('📊 Estadísticas:');
    console.log(`   • Total de turnos de conversación: ${resultadosFinales.length}`);
    console.log(`   • Turnos exitosos: ${exitosos} (${tasaExito}%)`);
    console.log(`   • Turnos fallidos: ${fallidos}`);
    console.log(`   • Tiempo total: ${tiempoTotal}ms (${(tiempoTotal / 1000).toFixed(2)}s)`);
    console.log(`   • Tiempo promedio por turno: ${tiempoPromedio}ms`);
    console.log(`   • Usuarios simulados: ${USUARIOS_SIMULTANEOS}`);
    console.log(`   • Turnos por usuario: ${NUMERO_TURNOS}`);
    console.log('\n');
    
    // Mostrar detalles de errores si los hay
    if (fallidos > 0) {
        console.log('❌ Errores encontrados:');
        resultadosFinales
            .filter(r => !r.success)
            .forEach((resultado, index) => {
                console.log(`   ${index + 1}. Usuario: ${resultado.remitente} | Chat: ${resultado.idChat}`);
                console.log(`      Turno: ${resultado.numeroTurno} | Estado: ${resultado.estado}`);
                console.log(`      Mensaje: ${resultado.mensajeUsuario}`);
                console.log(`      Error: ${resultado.error}`);
                console.log(`      Status: ${resultado.status}`);
                console.log('');
            });
    }
    
    // Mostrar resumen por usuario
    console.log('👥 Resumen por usuario:');
    const usuariosUnicos = [...new Set(resultadosFinales.map(r => r.remitente))];
    usuariosUnicos.forEach(remitente => {
        const resultadosUsuario = resultadosFinales.filter(r => r.remitente === remitente);
        const exitososUsuario = resultadosUsuario.filter(r => r.success).length;
        const fallidosUsuario = resultadosUsuario.filter(r => !r.success).length;
        console.log(`   • ${remitente}: ${exitososUsuario} exitosos, ${fallidosUsuario} fallidos`);
    });
    
    console.log('\n========================================================================================\n');
    
    logger.info({
        contexto: 'testing',
        recurso: 'testSoulChat.ejecutarTest',
        estadisticas: {
            total: resultadosFinales.length,
            exitosos,
            fallidos,
            tasaExito: `${tasaExito}%`,
            tiempoTotal: `${tiempoTotal}ms`,
            tiempoPromedio: `${tiempoPromedio}ms`
        }
    }, 'Testing de Soul Chat completado');
    
    return {
        total: resultadosFinales.length,
        exitosos,
        fallidos,
        tasaExito: parseFloat(tasaExito),
        tiempoTotal,
        tiempoPromedio: parseFloat(tiempoPromedio),
        resultados: resultadosFinales
    };
};

// ! EJECUTAR SI SE LLAMA DIRECTAMENTE
if (require.main === module) {
    ejecutarTest()
        .then(() => {
            console.log('✅ Testing completado exitosamente');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Error ejecutando testing:', error);
            logger.error({
                contexto: 'testing',
                recurso: 'testSoulChat',
                errorMensaje: error.message,
                errorStack: error.stack
            }, 'Error ejecutando testing de Soul Chat');
            process.exit(1);
        });
}

// ! EXPORTACIONES
module.exports = {
    ejecutarTest,
    enviarMensaje,
    simularUsuario,
    crearEstructuraMensaje,
    esperarRespuestaIA
};

