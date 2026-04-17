// ! ================================================================================================================================================
// !                                                    SERVICIO DE CHAT AI SOUL
// ! ================================================================================================================================================
// @autor Ramón Dario Rozo Torres
// @últimaModificación Ramón Dario Rozo Torres
// @versión 1.0.0
// v1/services/serviceSoulChat.service.js

// ! REQUIRES
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
require('dotenv').config({ path: './../../.env' });
const logger = require('../logger');

// ! PROCESAR MENSAJE AI SOUL
// * CONSUMO API
// * estructuraMensaje puede ser un objeto JSON o un FormData (cuando hay adjuntos)
const procesarMensajeAISoul = async (estructuraMensaje) => {

    const url = `${process.env.URL_API_SOUL_CHAT}/v1/messenger/in-message`;
    
    try {
        // Verificar si estructuraMensaje es FormData (tiene el método getHeaders)
        const esFormData = estructuraMensaje && typeof estructuraMensaje.getHeaders === 'function';
        
        let config;
        if (esFormData) {
            // Si es FormData, usar multipart/form-data
            config = {
                headers: {
                    ...estructuraMensaje.getHeaders()
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity
            };
        } else {
            // Si es objeto JSON, usar application/json
            config = {
                headers: { "Content-Type": "application/json" }
            };
        }

        const response = await axios.post(url, estructuraMensaje, config);
        logger.info({
            contexto: 'Service Soul Chat',
            recurso: 'serviceSoulChat.procesarMensajeAISoul',
            response: response.data
        }, '✅ Respuesta procesarMensajeAISoul');
        
        // const response = {
        //     status: 200,
        //     data: {
        //         message: 'Mensaje procesado correctamente'
        //     }
        // };
        // console.log('response procesarMensajeAISoul ==> ', response);
        // Retornar la respuesta de la API
        return response;
    } catch (error) {
        // Verificar si estructuraMensaje es FormData para el log
        const esFormData = estructuraMensaje && typeof estructuraMensaje.getHeaders === 'function';
        
        logger.error({
            contexto: 'Service Soul Chat',
            recurso: 'serviceSoulChat.procesarMensajeAISoul',
            codigoRespuesta: error.response?.status || 500,
            errorMensaje: error.message || error.response?.data?.message || 'Error desconocido',
            errorStack: error.stack,
            url,
            estructuraMensaje: esFormData ? 'FormData (con archivos)' : {
                idChat: estructuraMensaje?.idChat,
                remitente: estructuraMensaje?.remitente,
                estado: estructuraMensaje?.estado,
                type: estructuraMensaje?.type
            },
            errorResponse: error.response?.data || null
        }, 'Error al procesar mensaje AI Soul');
        throw error;
    }
};


// ! EXPORTACIONES
module.exports = {
    procesarMensajeAISoul,
};