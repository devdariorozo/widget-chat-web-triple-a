// ! ================================================================================================================================================
// !                                                    SERVICIO DE API TRIPLE A
// ! ================================================================================================================================================
// @autor Ramón Dario Rozo Torres
// @últimaModificación Ramón Dario Rozo Torres
// @versión 1.0.0
// v1/services/serviceTripleA.service.js

// ! REQUIRES
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: './../../.env' });
const logger = require('../logger');

// * CONSUMO API
const procesarConsultaTripleA = async (estructuraMensaje) => {
    // URL base de la API Triple A
    const urlBase = process.env.URL_API_TRIPLE_A;
    const url = `${urlBase}/generalscriptservice/rest/generalScriptRest/execute`;
    
    // Token de autorización (usar variable de entorno o el valor por defecto)
    const tokenAuth = process.env.TOKEN_API_TRIPLE_A;
    
    try {
        const response = await axios.post(url, estructuraMensaje, {
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Basic ${tokenAuth}` 
            }
        });
        
        // Log detallado de la respuesta para debugging
        logger.info({
            contexto: 'service',
            recurso: 'serviceTripleA.procesarConsultaTripleA',
            status: response.status,
            dataStructure: {
                hasData: !!response.data,
                hasResults: !!(response.data && response.data.results),
                resultsLength: response.data?.results?.length || 0,
                firstResult: response.data?.results?.[0] || null
            },
            estructuraMensaje: {
                scriptName: estructuraMensaje.scriptName,
                poliza: estructuraMensaje.poliza
            }
        }, '✅ Respuesta recibida de API Triple A');
        
        // Retornar la respuesta de la API
        return response;
    } catch (error) {
        logger.error({
            contexto: 'service',
            recurso: 'serviceTripleA.procesarConsultaTripleA',
            codigoRespuesta: error.response?.status || 500,
            errorMensaje: error.message || error.response?.data?.message || 'Error desconocido',
            errorStack: error.stack,
            url,
            estructuraMensaje: {
                idChat: estructuraMensaje.idChat,
                remitente: estructuraMensaje.remitente,
                estado: estructuraMensaje.estado,
                type: estructuraMensaje.type
            },
            errorResponse: error.response?.data || null
        }, 'Error al procesar consulta API Triple A');
        throw error;
    }
};



// ! EXPORTACIONES
module.exports = {
    procesarConsultaTripleA,
};