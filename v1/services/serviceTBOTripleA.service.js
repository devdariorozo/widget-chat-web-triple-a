// ! ================================================================================================================================================
// !                                                    SERVICIO DE TBO TRIPLE A
// ! ================================================================================================================================================
// @autor Ramón Dario Rozo Torres
// @últimaModificación Ramón Dario Rozo Torres
// @versión 1.0.0
// v1/services/serviceTBOTripleA.service.js

// ! REQUIRES
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: './../../.env' });
const logger = require('../logger');


// * CONSUMO API
const procesarConsultaTBO = async (poliza, periodo) => {
    const urlBase = process.env.URL_TBO_TRIPLE_A ;
    const url = `${urlBase}/showClientData`;
    
    // Token de autorización
    const tokenAuth = process.env.TOKEN_TBO_TRIPLE_A;
    
    try {
        logger.info({
            contexto: 'service',
            recurso: 'serviceTBOTripleA.procesarConsultaTBO',
            url,
            poliza,
            periodo
        }, 'Iniciando consulta TBO Datos Cliente');
        
        const response = await axios.get(url, {
            headers: { 
                "Authorization": `Basic ${tokenAuth}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            params: {
                account: poliza,  
                period: periodo   
            },
            timeout: 30000, 
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            }
        });
        
        // Validar el tipo de contenido de la respuesta
        const contentType = response.headers['content-type'] || '';
        
        if (contentType.includes('text/html')) {
            logger.error({
                contexto: 'service',
                recurso: 'serviceTBOTripleA.procesarConsultaTBO',
                error: 'Se recibió HTML en lugar de JSON',
                url,
                status: response.status,
                poliza,
                periodo,
                responsePreview: typeof response.data === 'string' ? 
                    response.data.substring(0, 300) : 'No es string'
            }, 'La API TBO retornó HTML en lugar de JSON');
            
            throw new Error('El endpoint TBO no está disponible o la URL es incorrecta');
        }
        
        // Validar que la respuesta tenga datos
        if (!response.data) {
            logger.error({
                contexto: 'service',
                recurso: 'serviceTBOTripleA.procesarConsultaTBO',
                error: 'Respuesta vacía',
                status: response.status
            }, ' La API TBO retornó respuesta vacía');
            
            throw new Error('La API TBO retornó una respuesta vacía');
        }
        
        logger.info({
            contexto: 'service',
            recurso: 'serviceTBOTripleA.procesarConsultaTBO',
            status: response.status,
            poliza,
            periodo,
            hasData: !!response.data,
            dataType: typeof response.data,
            dataKeys: typeof response.data === 'object' ? Object.keys(response.data) : []
        }, '✅ Respuesta recibida de API TBO Datos Cliente');
        
        return response;
        
    } catch (error) {
        // Si es un error de axios
        if (error.response) {
            logger.error({
                contexto: 'service',
                recurso: 'serviceTBOTripleA.procesarConsultaTBO',
                codigoRespuesta: error.response.status,
                errorMensaje: error.message,
                url,
                poliza,
                periodo,
                responseHeaders: error.response.headers,
                responseDataType: typeof error.response.data,
                responseDataPreview: typeof error.response.data === 'string' ? 
                    error.response.data.substring(0, 300) : 
                    JSON.stringify(error.response.data).substring(0, 300)
            }, ' Error en respuesta de API TBO');
        } else if (error.request) {
            // La petición se hizo pero no hubo respuesta
            logger.error({
                contexto: 'service',
                recurso: 'serviceTBOTripleA.procesarConsultaTBO',
                errorMensaje: 'No se recibió respuesta del servidor',
                url,
                poliza,
                periodo,
                errorDetails: error.message
            }, ' Sin respuesta de API TBO');
        } else {
            // Error al configurar la petición
            logger.error({
                contexto: 'service',
                recurso: 'serviceTBOTripleA.procesarConsultaTBO',
                errorMensaje: error.message,
                errorStack: error.stack
            }, ' Error al configurar petición TBO');
        }
        
        throw error;
    }
};


// * CONSUMO API - TBO COPIA FACTURA PDF
const procesarConsultaTBOCopiaFactura = async (invoice) => {
    const urlBase = process.env.URL_TBO_TRIPLE_A ;
    const url = `${urlBase}/showInvoice`;
    
    // Token de autorización
    const tokenAuth = process.env.TOKEN_TBO_TRIPLE_A;

    try {
        logger.info({
            contexto: 'service',
            recurso: 'serviceTBOTripleA.procesarConsultaTBOCopiaFactura',
            url,
            invoice
        }, '🔄 Iniciando consulta TBO Copia Factura PDF');
        
        const response = await axios.get(url, {
            headers: { 
                "Authorization": `Basic ${tokenAuth}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            params: {
                invoice: invoice
            },
            timeout: 30000,
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            }
        });
        
        // Validar el tipo de contenido de la respuesta
        const contentType = response.headers['content-type'] || '';
        
        if (contentType.includes('text/html')) {
            logger.error({
                contexto: 'service',
                recurso: 'serviceTBOTripleA.procesarConsultaTBOCopiaFactura',
                error: 'Se recibió HTML en lugar de JSON',
                url,
                status: response.status,
                invoice
            }, '❌ La API TBO retornó HTML en lugar de JSON');
            
            throw new Error('El endpoint TBO Copia Factura no está disponible o la URL es incorrecta');
        }
        
        if (!response.data) {
            logger.error({
                contexto: 'service',
                recurso: 'serviceTBOTripleA.procesarConsultaTBOCopiaFactura',
                error: 'Respuesta vacía',
                status: response.status
            }, '❌ La API TBO retornó respuesta vacía');
            
            throw new Error('La API TBO retornó una respuesta vacía');
        }
        
        logger.info({
            contexto: 'service',
            recurso: 'serviceTBOTripleA.procesarConsultaTBOCopiaFactura',
            status: response.status,
            invoice,
            hasData: !!response.data,
            dataType: typeof response.data
        }, '✅ Respuesta recibida de API TBO Copia Factura');
        
        return response;
        
    } catch (error) {
        if (error.response) {
            logger.error({
                contexto: 'service',
                recurso: 'serviceTBOTripleA.procesarConsultaTBOCopiaFactura',
                codigoRespuesta: error.response.status,
                errorMensaje: error.message,
                url,
                invoice
            }, '❌ Error en respuesta de API TBO Copia Factura');
        } else if (error.request) {
            logger.error({
                contexto: 'service',
                recurso: 'serviceTBOTripleA.procesarConsultaTBOCopiaFactura',
                errorMensaje: 'No se recibió respuesta del servidor',
                url,
                invoice
            }, '❌ Sin respuesta de API TBO Copia Factura');
        } else {
            logger.error({
                contexto: 'service',
                recurso: 'serviceTBOTripleA.procesarConsultaTBOCopiaFactura',
                errorMensaje: error.message,
                errorStack: error.stack
            }, '❌ Error al configurar petición TBO Copia Factura');
        }
        
        throw error;
    }
};


// ! EXPORTACIONES
module.exports = {
    procesarConsultaTBO,
    procesarConsultaTBOCopiaFactura,
};