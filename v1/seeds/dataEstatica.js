// ! ================================================================================================================================================
// !                                                          SEEDS DE DATOS ESTATICOS
// ! ================================================================================================================================================
// @author Ramón Dario Rozo Torres
// @lastModified Ramón Dario Rozo Torres
// @version 1.0.0
// v1/seeds/dataEstatica.js

// ! VALORES ESTATICOS
// * TIPO DE GESTION
const tipoGestion = {
  inbound: "Inbound",
  outbound: "Outbound",
};

// * ESTADO DE CHAT
const estadoChat = {
  recibido: "Recibido",
  enviado: "Enviado",
};

// * ESTADO DE GESTION
const estadoGestion = {
  abierto: "Abierto",
  cerrado: "Cerrado",
};

// * ARBOL
const arbol = {
  saludo: "Saludo",
  despedida: "Despedida",
  instrucciones: "Instrucciones",
  inicio: "Inicio",
  solicitarFormularioInicial: "Solicitar Formulario Inicial",
  procesarFormularioInicial: "Procesar Formulario Inicial",
  saludoUsuario: "Saludo Usuario",

  //ARBOL PRINCIPAL
  solicitarMenuArbolPrincipal: "Solicitar Menu Arbol Principal",



  //ARBOL CONTROL SERVICIO
  solicitarMenuArbolControlServicio: "Solicitar Menu Arbol Control Servicio",
  interrupcionesYCierres: "Interrupciones Y Cierres",
  verificarPoliza: "Verificar Poliza",
  numeroPolizaControlServicio: "Numero Poliza Control Servicio",
  // confirmarInformacion: "Confirmar Informacion",
  sinPoliza: "Sin Poliza",
  mensajeFinalArbolControlServicio: "Mensaje Final Arbol Control Servicio",






  //ARBOL FACTURA PAGO
  solicitarMenuArbolFacturaPago: "Solicitar Menu Arbol Factura Pago",
  numeroPolizaFactura: "Numero Poliza Factura",
  opcionesSaldoFactura: "Opciones Saldo Factura",
  mensajeErrorFactura: "Mensaje Error Factura",
  msgFinalFactura: "Mensaje Final Factura",
  msgExitoTBODatosCliente: "Mensaje Exito TBO Datos Cliente",
  msgExitoTBOCopiaFacturaPDF: "Mensaje Exito TBO Copia Factura PDF",
  acuerdoPago: "Acuerdo Pago",
  aclaracionFactura: "Aclaracion Factura",
  puntosDePago: "Puntos De Pago",





  //ARBOL TRAMITE
  solicitarMenuArbolTramite: "Solicitar Menu Arbol Tramite",
  facturaNombre: "Factura Nombre Tipo Persona",
  personaNatural: "Persona Natural",
  personaNaturalDocumentosSi: "Persona Natural Documentos Si",
  personaNaturalDocumentosNo: "Persona Natural Documentos No",
  personaJuridica: "Persona Juridica",
  personaJuridicaDocumentosSi: "Persona Juridica Documentos Si",
  personaJuridicaDocumentosNo: "Persona Juridica Documentos No",
  personaLeasingHabitacional: "Persona Leasing Habitacional",
  personaLeasingHabitacionalDocumentosSi: "Persona Leasing Habitacional Documentos Si",
  personaLeasingHabitacionalDocumentosNo: "Persona Leasing Habitacional Documentos No",
  inmuebleDesocupado: "Inmueble Desocupado",
  gestionarMedidor: "Gestionar Medidor",
  gestionarMedidorAgente: "Gestionar Medidor Agente",
  reportarFraudes: "Reportar Fraudes",
  reportarFraudesAgente: "Reportar Fraudes Agente",
  cambioEstrato: "Cambio Estrato",
  cambioEstratoOtraConsulta: "Cambio Estrato Otra Consulta",
  cambioEstratoOtraConsultaNo: "Cambio Estrato Otra Consulta No",
  infoPqrs: "Info Pqrs",
  infoPqrsOtraConsulta: "Info Pqrs Otra Consulta",
  infoPqrsOtraConsultaNo: "Info Pqrs Otra Consulta No",




  //ARBOL CREDITO SEGURO
  solicitarMenuArbolCreditoSeguro: "Solicitar Arbol Credito Seguro",
  financiacionNoBancaria: "Financiacion No Bancaria",
  consultarCupoDisponible: "Consultar Cupo Disponible",
  solicitarAsesorFinanciacionNoBancaria: "Solicitar Asesor Financiacion No Bancaria",
  todoSobreDILO: "Todo Sobre DILO",
  segurosFamiliaSegura: "Seguros Familia Segura",
  infoActivacionSeguros: "Info Activacion Seguros",
  ampliarInfoProductos: "Ampliar Info Productos",
  solicitudIndemnizacion: "Solicitud Indemnizacion",
  planPrevisionExequial: "Plan Prevision Exequial",
  conocerActivarPlanes: "Conocer Activar Planes",
  ampliarInfoProductosPrevision: "Ampliar Info Productos Prevision",




  //ARBOL RECOLECCION ESPECIAL ASEO
  solicitarMenuArbolEspAseo: "Solicitar Arbol Esp Aseo",
  escombros: "Escombros",
  ingresoNumeroPoliza: "Ingreso Numero Poliza",
  confirmarInformacion: "Confirmar Informacion",
  recolecciónPodas: "Recolección Podas",
  recolecciónTroncos: "Recolección Troncos",
  otrosResiduosEspeciales: "Otros Residuos Especiales",
  finIVRSolicitudes: "Fin IVR Solicitudes",



  //ARBOL SOLICITAR SERVICIO
  solicitarMenuArbolServicio: "Solicitar Arbol Servicio",
  presupuestarContratacion: "Presupuestar Contratacion",
  contratacionInmediata: "Contratacion Inmediata",


  mensajeAsesor: "Mensaje Asesor",
  interaccionAISoul: "Interaccion AI Soul",
  regresarAlMenuPrincipalDespuesIA: "Regresar Al Menu Principal Despues IA",
  condicionAdjuntos: "Condicion Adjuntos",
  confirmarAdjuntos: "Confirmar Adjuntos",
  alertaNoEntiendo: "Alerta No Entiendo",
  // * ARBOL ENCUESTA
  solicitoInicioEncuesta: 'Solicito Inicio Encuesta',
  errorApi: "Error API",
  clienteDesiste: "Cliente Desiste",
  alertaInactividad: "Alerta Inactividad",
  cerradoPorInactividad: "Cerrado Por Inactividad",
};

const alertaLimiteCaracteres = (maxCaracteres) => {
  return `<p class="alertaArbol">
    ⚠️ <b>Texto demasiado largo.</b><br/><br/>
    Por favor ingrese máximo ${maxCaracteres} caracteres.
  </p>`;
}

// * CONTROL DE ARBOL
const controlApi = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Info",
};

// * MENSAJES
// TODO: MENSAJE DE SALUDO
const saludo = `<p class="saludoChat">
                    🙋‍♂️ Hola. <br/>
                    ¡Triple A, está más cerca de ti! soy Pau y es un gusto tenerte en nuestro canal oficial.<br/><br/>
                    
                    📄 Por favor completa la siguiente información para ser atendido.
                </p>`;

// TODO: MENSAJE DE DESPEDIDA
const despedida = `<p class="despedidaChat">🌟 ¡Gracias por haber utilizado nuestro servicio!<br/><br/>
                    😊 Esperamos haberle ayudado.<br/>
                    <b>¡Estamos para servirle!</b> 👋</p>`;

// TODO: MENSAJE DE INSTRUCCIONES
const instrucciones = `<p class="instruccionesArbol">Hola,<br/><br/>
                        📝 <b>En el momento que desee volver a empezar, por favor escriba <b>inicio</b> o <b>INICIO</b> para regresar al menú principal🔄</b></p>`;

// TODO: MENSAJE SOLICITANDO FORMULARIO INICIAL
const solicitarFormularioInicial = `  <p class="solicitarFormularioInicialArbol">📝 <b>Formulario inicial.</b><br/><br/>
    <div id="content_form">
         <!-- Numero de Póliza -->
         <div class="input-field col s12 m6 l4">
          <input type="text" 
           name="txt_numeroPoliza" 
           id="txt_numeroPoliza" 
           maxlength="50" 
           data-length="50" 
           class="campo-formulario" 
           onkeyup="valida_txt_numeroPoliza();" 
           onclick="valida_txt_numeroPoliza();" 
           autocomplete="off">
          <label for="txt_numeroPoliza" class="label-widget">Número de Póliza</label>
            <div class="invalid-feedback"></div>
        </div>

         <!-- Nombres y Apellidos (un solo campo) -->
        <div class="input-field col s12 m6 l6">
          <input type="text" name="txt_nombresApellidos" id="txt_nombresApellidos" maxlength="45" data-length="45" class="campo-formulario" onkeyup="valida_txt_nombresApellidos();" onclick="valida_txt_nombresApellidos();" autocomplete="off">
          <label for="txt_nombresApellidos" class="label-widget">Nombres y Apellidos</label>
            <div class="invalid-feedback"></div>
        </div>

        <!-- Tipo de documento -->
        <div class="input-field col s12 m6 l4">
            <select name="txt_tipoDocumento" id="txt_tipoDocumento" class="campo-formulario select2 browser-default" autocomplete="off">
                <option value=""></option>
                <option value="CC">CC</option>
                <option value="CE">CE</option>
                <option value="PEP">PEP</option>
                <option value="PPT">PPT</option>
                <option value="Pasaporte">Pasaporte</option>
            </select>
            <label for="txt_tipoDocumento" class="select2-label">Seleccione un tipo de documento</label>
            <div class="invalid-feedback"></div>
        </div>

          <!-- Número de documento -->
        <div class="input-field col s12 m6 l4">
            <input type="text" name="txt_numeroDocumento" id="txt_numeroDocumento" maxlength="12" data-length="12" class="campo-formulario" onkeyup="valida_txt_numeroDocumento();" onclick="valida_txt_numeroDocumento();" autocomplete="off">
            <label for="txt_numeroDocumento" class="label-widget">Número de Documento</label>
            <div class="invalid-feedback"></div>
        </div>

        <!-- Número de celular teléfono-->
        <div class="input-field col s12 m6 l4">
            <input type="text" name="txt_numeroContacto" id="txt_numeroContacto" maxlength="15" data-length="15" class="campo-formulario" onkeyup="valida_txt_numeroContacto();" onclick="valida_txt_numeroContacto();" autocomplete="off">
            <label for="txt_numeroContacto" class="label-widget">Número de celular o teléfono</label>
            <div class="invalid-feedback"></div>
        </div>

        <!-- Correo electrónico -->
        <div class="input-field col s12 m6 l4">
            <input type="email" name="txt_correoElectronico" id="txt_correoElectronico" maxlength="44" data-length="44" class="campo-formulario" onkeyup="valida_txt_correoElectronico();" onclick="valida_txt_correoElectronico();" autocomplete="off">
            <label for="txt_correoElectronico" class="label-widget">Correo electrónico</label>
            <div class="invalid-feedback"></div>
        </div>

        <!-- Relación con el Pedido -->
        <div class="input-field col s12">
          <textarea 
          id="txt_relacionPedido" 
          name="txt_relacionPedido"
          class="materialize-textarea campo-formulario"
          maxlength="500"
          data-length="500"
          onkeyup="valida_txt_relacionPedido();" 
          onclick="valida_txt_relacionPedido();"
          autocomplete="off"></textarea>
         <label for="txt_relacionPedido" class="label-widget">Relación con el Pedido</label>
        <div class="invalid-feedback"></div>
        </div>

         <p class="tratamientoDatosArbol">
        🔔 <b>Al continuar, autoriza el tratamiento de datos personales y acepta los términos y condiciones de nuestro canal de atención digital.</b><br/><br/>

        📄 Puede consultarlos en el siguiente enlace: 
        <a href="https://goto.now/NqJAd" target="_blank">Abrir términos y condiciones</a><br/><br/>

        📢 <i>Al continuar en este chat está aceptando nuestra política de datos personales y la grabación de su video atención.</i><br/><br/>

        ✍️ Ahora, para continuar, por favor diligencie su información de contacto.
        </p>

        <label class="form-checkbox">
            <input type="checkbox" id="txt_autorizacionDatosPersonales" name="txt_autorizacionDatosPersonales" required>
            <span class="label-widget">Autorizo el tratamiento de mis datos personales</span>
        </label></br></br>

        <div class="center mt-2">
            <button id="btn_Continuar" class="btn waves-effect waves-light blue darken-1 mb-2">
                <i class="material-icons left">arrow_forward</i>Continuar
            </button>
        </div>
    </div>
</p>`;

const saludoUsuario = `
    <p class="saludoUsuario">¡Hola! 😊, <b>{{NOMBRES_APELLIDOS}}</b> <br/><br/>
       Soy Pau, asistente virtual de Triple A. <br/> 
       ¡Qué bueno tenerte por aquí! 💙<br/><br/>

       Para radicar PQRS ingresa al enlace ➡️ <a href="https://www.aaa.com.co/cudpes/" target="_blank">https://www.aaa.com.co/cudpes/</a><br/><br/> 
       Al seguir en este chat, aceptas nuestra política de tratamiento de datos personal publicada en 👉 <a href="https://www.aaa.com.co/aviso-privacidad/" target="_blank">https://www.aaa.com.co/aviso-privacidad/</a><br/><br/>
    </p>
`;

// TODO: MENSAJE SOLICITANDO MENÚ ÁRBOL PRINCIPAL
const solicitarMenuArbolPrincipal = `
<p class="solicitarMenuArbolPrincipal"> <b>¡Es un placer atenderte! Cuéntame, ¿en qué puedo ayudarte hoy? 👇</b> <br/><br/>

  <b>1.</b> Estado / Reporte servicio 🔧<br/>
  <b>2.</b> Factura y pagos 🧾 <br/>
  <b>3.</b> Trámites y consultas 🔍 <br/>
  <b>4.</b> Créditos y seguros 🤩 <br/>
  <b>5.</b> Recolección especial aseo 🧹 <br/>
  <b>6.</b> Solicitar servicio 🛠 <br/><br/>
                                
  <i>Por favor, seleccione una opción para continuar.</i>
</p>
`;

// TODO: MENSAJE SOLICITANDO MENÚ ÁRBOL CONTROL SERVICIO
const solicitarMenuArbolControlServicio = `
<p class="menuArbolControlServicio"><b>📢 Consulta el estado del servicio, conoce los cierres e interrupciones programadas 🚰 o reporta cualquier problema que afecte tu suministro ✋</b>.<br/><br/>

<b>1.</b> Interrupciones y cierres 📋<br/>
<b>2.</b> Sin agua en casa 🏡<br/>
<b>3.</b> Baja presión sector ⚠️<br/>
<b>4.</b> Fuga de agua 💧<br/>
<b>5.</b> Fuga de alcantarillado🔧<br/><br/>

<i>Por favor, seleccione una opción para continuar.</i><br/><br/>

Escribe <b>“REGRESAR”</b> para volver al menú principal.🛠</b>
</p>
`;


// TODO: SUBMENÚ - INTERRUPCIONES Y CIERRES - ARBOL CONTROL SERVICIO - OPCION 1
const interrupcionesYCierres = `
<p class="interrupcionesYCierres">

🚧🛑 <b>Estas son las interrupciones y cierres programados en el servicio.</b><br/>
Te compartimos la información actualizada para que puedas anticiparte a cualquier afectación. 🔍📅<br/><br/>

<b>Noviembre 27 de 2025</b><br/><br/>

<b>1.</b> Barranquilla – Desde las 08:10 a.m. (duración: 3 a 4 horas)<br/>
<b>Sectores afectados:</b> Juan Mina<br/>
<b>Tipo de trabajo:</b> Reparación de fuga de 4".<br/><br/>

<b>2.</b> Puerto Colombia – Desde las 09:30 a.m. (duración: 3 horas)<br/>
<b>Sectores afectados:</b> Campo de Salgar<br/>
<b>Tipo de trabajo:</b> Reparación de fuga de 4".<br/><br/>

<b>3.</b> Barranquilla – Desde las 10:00 a.m. (duración: 3 horas)<br/>
<b>Sectores afectados:</b> Las Palmas<br/>
<b>Tipo de trabajo:</b> Reparación de fuga de 4".<br/><br/>

<b>4.</b> Barranquilla – Desde las 02:00 p.m. (duración: 2 a 3 horas)<br/>
<b>Sectores afectados:</b> El Por Fin y Los Olivos<br/>
<b>Tipo de trabajo:</b> Reparación de fuga de 4".<br/><br/>

<b>5.</b> Barranquilla – Desde las 03:48 p.m. (duración: 3 a 4 horas)<br/>
<b>Sectores afectados:</b> Buena Esperanza, El Valle y Villate<br/>
<b>Tipo de trabajo:</b> Reparación de fuga de 4".<br/>

</p>
`;



// TODO: SUBMENÚ - SIN AGUA EN CASA - ARBOL CONTROL SERVICIO - OPCION 2
const verificarPoliza = `
<p class="sinAguaVerificarPoliza"> <b>📝 Para continuar, necesitamos el número de tu póliza 🔢</b> <br/><br/>

  <b>1.</b> Continuar<br/>
  <b>2.</b> Sin póliza ❌ <br/>
</p>
`;


//continuar
const numeroPolizaControlServicio = `
<p>
🔢 Por favor, ingresa únicamente el número de tu póliza para seguir.
</p>

`;

//ENDPOINT Información Cliente IVR -> RESPUESTA ENDPOINT

//PASO AUTOMATICO 
//🢃🢃🢃🢃 


//MISMO MENSAJE DE CONFIRMAR INFORMACION 1.CONFIRMAR 2.CORREGIR 
// = confirmarInformacion


//2. SE DEVUELVE A INGRESO NUMERO POLIZA
//🢃🢃🢃🢃 1 CONFIRMAR


//ENDPOINT IVRSinAguaEnCasa
//endpoint -> IVRSinAguaEnCasa -> RESPUESTA ENDPOINT
//ENDPOINT IVRSinAguaEnCasa

//PASO AUTOMATICO 
//🢃🢃🢃🢃 


//PASO FINAL

const mensajeFinalArbolControlServicio = `
<p class="mensajeFinalArbolControlServicio">
🚛 👷‍♂️ <b>Próximamente estaremos visitando tu predio o contactándote para revisar tu reporte.</b><br/><br/>

  <i>Te mantendremos informado.</i>
</p>
`

// Dirección asociada a póliza
const direccionAsociadaPoliza = (direccion) => `
<p class="direccionAsociadaPoliza">
🏠 La dirección asociada a tu servicio es: ${direccion}
</p>
`

// Mensaje éxito endpoint IVR
const mensajeExitoIVR = (codigo) => `
<p class="mensajeExitoIVR">
✅ Hemos registrado tu solicitud con éxito.<br/><br/>
📄 Tu número de reporte es: ${codigo}
</p>
`

// Sin póliza
const sinPoliza = `
<p class="sinPoliza"> <b> ⌛ Para ayudarte mejor estoy asignando un agente para ti, por favor dime:</b> <br/><br/>
 
1️⃣Tu nombre ✍️<br/>
2️⃣ Dirección del reporte 📍<br/>
3️⃣ Cuéntanos qué ocurre: 💬
</p>
`



// TODO: SUBMENÚ - BAJA PRESIÓN SECTOR - ARBOL CONTROL SERVICIO - OPCION 3


// VERIFICAR POLIZA MISMA QUE OPCION 2
// = verificarPoliza 


//continuar - MISMA QUE OPCION 2
// = numeroPolizaControlServicio 



//ENDPOINT Información Cliente IVR -> RESPUESTA ENDPOINT

//PASO AUTOMATICO 
//🢃🢃🢃🢃 


//MISMO MENSAJE DE CONFIRMAR INFORMACION 1.CONFIRMAR 2.CORREGIR 
// = confirmarInformacion


//2. SE DEVUELVE A INGRESO NUMERO POLIZA
//🢃🢃🢃🢃 1 CONFIRMAR


//ENDPOINT IVRBajaPresionSector
//endpoint -> IVRBajaPresionSector -> RESPUESTA ENDPOINT
//ENDPOINT IVRBajaPresionSector

//PASO AUTOMATICO 
//🢃🢃🢃🢃 


//PASO FINAL
// = mensajeFinalArbolControlServicio 



// Sin póliza
// = sinPolizaAgente












// TODO: SUBMENÚ - FUGA DE AGUA - ARBOL CONTROL SERVICIO - OPCION 4


// VERIFICAR POLIZA MISMA QUE OPCION 2
// = verificarPoliza 


//continuar - MISMA QUE OPCION 2
// = numeroPolizaControlServicio 



//ENDPOINT Información Cliente IVR -> RESPUESTA ENDPOINT

//PASO AUTOMATICO 
//🢃🢃🢃🢃 


//MISMO MENSAJE DE CONFIRMAR INFORMACION 1.CONFIRMAR 2.CORREGIR 
// = confirmarInformacion


//2. SE DEVUELVE A INGRESO NUMERO POLIZA
//🢃🢃🢃🢃 1 CONFIRMAR


//ENDPOINT IVRFugaAgua
//endpoint -> IVRFugaAgua -> RESPUESTA ENDPOINT
//ENDPOINT IVRFugaAgua

//PASO AUTOMATICO 
//🢃🢃🢃🢃 


//PASO FINAL
// = mensajeFinalArbolControlServicio 



// Sin póliza
// = sinPolizaAgente
















// TODO: SUBMENÚ - FUGA DE ALCANTARILLADO - ARBOL CONTROL SERVICIO - OPCION 5


// VERIFICAR POLIZA MISMA QUE OPCION 2
// = verificarPoliza 


//continuar - MISMA QUE OPCION 2
// = numeroPolizaControlServicio 



//ENDPOINT Información Cliente IVR -> RESPUESTA ENDPOINT

//PASO AUTOMATICO 
//🢃🢃🢃🢃 


//MISMO MENSAJE DE CONFIRMAR INFORMACION 1.CONFIRMAR 2.CORREGIR 
// = confirmarInformacion


//2. SE DEVUELVE A INGRESO NUMERO POLIZA
//🢃🢃🢃🢃 1 CONFIRMAR


//ENDPOINT IVRFugaAlcantarillado
//endpoint -> IVRFugaAlcantarillado -> RESPUESTA ENDPOINT
//ENDPOINT IVRFugaAlcantarillado

//PASO AUTOMATICO 
//🢃🢃🢃🢃 


//PASO FINAL
// = mensajeFinalArbolControlServicio 



// Sin póliza
// = sinPolizaAgente





// TODO: MENSAJE SOLICITANDO MENÚ ÁRBOL FACTURA PAGO
const solicitarMenuArbolFacturaPago = `
<p class="solicitarMenuArbolFacturaPago"> <b>💰 Gestiona tu factura, consulta saldo, descarga duplicados, realiza acuerdos de pago y mucho más.</b> <br/><br/>

  <b>1.</b> Saldo de tu factura 💰 <br/>
  <b>2.</b> Descargar factura 🧾 <br/>
  <b>3.</b> Acuerdo de pago 🤝 <br/>
  <b>4.</b> Aclaración factura 🧑‍🏫 <br/>
  <b>5.</b> Puntos de pago 📍 <br/><br/>   

  <i>Por favor, seleccione una opción para continuar.</i>
</p>
`;



// TODO: SUBMENÚ - SALDO DE TU FACTURA - ARBOL FACTURA PAGO

//ENDPOINT INGRESO NUMERO POLIZA
const numeroPolizaFactura = `
<p>
💬 Para conocer el valor de tu última factura, ingresa tu número de póliza sin puntos ni signos.
</p>
`
//ENDPOINT Información Cliente IVR -> RESPUESTA ENDPOINT


//PASO AUTOMATICO 
//🢃🢃🢃🢃 
//MISMO MENSAJE DE CONFIRMAR INFORMACION 1.CONFIRMAR 2.CORREGIR 
// = confirmarInformacion

//2. SE DEVUELVE A INGRESO NUMERO POLIZA
//🢃🢃🢃🢃 1 CONFIRMAR


//ENDPOINT IVR ESTADO CUENTA 
//endpoint -> IVREstadoCuenta -> RESPUESTA ENDPOINT
//ENDPOINT IVR ESTADO CUENTA


// Mensaje éxito Estado Cuenta (Factura Pago)
const mensajeExitoEstadoCuenta = ({
  valUltFactura,
  valorPendiente,
  ultFactura,
  fechaVencimiento,
  ultPeriodo
}) => {
  return `
<p class="mensajeExitoEstadoCuenta">
📢 <b>Tu última factura está lista:</b><br/><br/>

💰 <b>Valor factura:</b> $${valUltFactura}<br/>
💰 <b>Valor pendiente:</b> $${valorPendiente}<br/>
📑 <b>Código de factura para pago:</b> ${ultFactura}<br/>
📅 <b>Vence el:</b> ${fechaVencimiento}<br/>
📆 <b>Mes facturado:</b> ${ultPeriodo}<br/><br/>

💳 <b>Págala fácil ingresando al enlace 👉</b> 
<a href="https://gp.aaa.com.co/Pago" target="_blank">gp.aaa.com.co/Pago</a> 
<b>utilizando el campo "Factura"</b>
</p>
`;
};



//MensajeError Estado Cuenta (Factura Pago)
const mensajeErrorFactura =  `
<p class="sinPoliza"> <b> ⌛ Para ayudarte mejor estoy asignando un agente para ti, por favor dime:</b> <br/><br/>
 
1️⃣Tu nombre ✍️<br/>
2️⃣ Dirección de tu inmueble<br/>
</p>
`

//PASO AUTOMATICO
//🢃🢃🢃🢃  
const opcionesSaldoFactura = `
<p><b>Selecciona una opción</b><br/><br/>

<b>1.</b> Consulta otra póliza<br/>
<b>2.</b> Menú principal<br/>
<b>3.</b> Finalizar
</p>
`




//OPCION 1 ME LLEVA A LA LISTA DEL SUBMENÚ - ARBOL FACTURA PAGO 
//2 MENU PRINCIPAL
//3 🢃🢃🢃🢃 

const msgFinalFactura = `
<p>🤝 Gracias por pasarte por aquí.  Si en otro momento necesitas ayuda, solo escríbeme. ¡Nos vemos pronto! 🚀<br/><br/>
</p>
`



// TODO: SUBMENÚ - DESCARGAR FACTURA - ARBOL FACTURA PAGO

//ENDPOINT INGRESO NUMERO POLIZA
//= numeroPolizaFactura
//ENDPOINT Información Cliente IVR -> RESPUESTA ENDPOINT


//PASO AUTOMATICO 
//🢃🢃🢃🢃 
//MISMO MENSAJE DE CONFIRMAR INFORMACION 1.CONFIRMAR 2.CORREGIR 
// = confirmarInformacion

//2. SE DEVUELVE A INGRESO NUMERO POLIZA
//🢃🢃🢃🢃 1 CONFIRMAR


//ENDPOINT TBO DATOS CLIENTE 
//endpoint -> TBODatosCliente -> RESPUESTA ENDPOINT
//ENDPOINT TBO DATOS CLIENTE


function msgExitoTBODatosCliente({
  numeroPoliza,
  nombreCliente,
  direccionCliente,
  fechaEmision,
  periodoFacturado,
  totalPagar,
  cuponPagos
}) {
  return `
<p class="mensajeExitoTBODatos">
📑 <b>Aquí tienes la información de tu factura y el duplicado:</b><br/><br/>

📌 <b>Póliza:</b> ${numeroPoliza}<br/>
👤 <b>Nombre:</b> ${nombreCliente}<br/>
📍 <b>Dirección:</b> ${direccionCliente}<br/>
📆 <b>Fecha de generación:</b> ${fechaEmision}<br/>
🗓️ <b>Periodo facturado:</b> ${periodoFacturado}<br/>
💰 <b>Total a pagar:</b> $${totalPagar}<br/>
🔢 <b>Número de cupón para pago:</b> ${cuponPagos}<br/><br/>

💳 Paga fácil ingresando al enlace 👉 
<a href="https://gp.aaa.com.co/Pago" target="_blank">gp.aaa.com.co/Pago</a> 
utilizando el campo "Factura"
</p>
`;
}

//PASO AUTOMATICO
//🢃🢃🢃🢃  


//ENDPOINT TBO COPIA FACTURA PDF
//endpoint -> TBOCopiaFacturaPDF -> RESPUESTA ENDPOINT
//ENDPOINT TBO COPIA FACTURA PDF
const msgExitoTBOCopiaFacturaPDF = ({ rutaCompleta, nombreArchivo }) => {
return `
<p class="mensajeExitoTBOCopiaFactura"><b>📄 ¡Tu factura en PDF está lista!</b><br/><br/>
👉 <a href="${rutaCompleta}" target="_blank">${nombreArchivo}</a></p>`
}

//PASO AUTOMATICO
//🢃🢃🢃🢃  
//MISMO MENSAJE DE OPCIONES SALDO FACTURA
//OPCION 1 ME LLEVA A LA LISTA DEL SUBMENÚ - ARBOL FACTURA PAGO 
//2 MENU PRINCIPAL
//3 🢃🢃🢃🢃 
//= opcionesSaldoFactura 

//OPCION - 3 
//MISMO MENSAJE FINAL FACTURA
//= msgFinalFactura



// TODO: SUBMENÚ - ACUERDO DE PAGO - ARBOL FACTURA PAGO
const acuerdoPago = `
<p><b>¡Es un gusto atenderte! Para ayudarte mejor, por favor envíame estos datos:</b><br/><br/>

1️⃣ Número de póliza del predio<br/>
2️⃣ Tu nombre<br/>
3️⃣ Tu cédula<br/>
4️⃣ Relación con el predio (Propietario, inquilino o administrador)
</p>
`



// TODO: SUBMENÚ - ACLARACION FACTURA - ARBOL FACTURA PAGO
const aclaracionFactura = `
<p>
<b>¡Revisemos juntos tu factura! Para ayudarte mejor, envíame estos datos:</b><br/><br/>

👉 Número de póliza del predio<br/>
👉 Tu nombre y cédula<br/>
👉 Relación con el predio (Propietario, inquilino o administrador)<br/>
👉 ¿Qué te gustaría revisar de tu factura?
</p>
`

//PASO ASESOR
// = mensajeAsesor



// TODO: SUBMENÚ - PUNTOS DE PAGO - ARBOL FACTURA PAGO
const puntosDePago = `
<p><b>💰 Opciones de pago disponibles</b><br/><br/>

<b>📌 Pago en efectivo o cheque de gerencia en bancos:</b><br/>
👉 Occidente, Caja Social, Itaú, Popular, Sudameris, Bogotá, AV Villas<br/><br/>

<b>📌 Pago en efectivo en puntos no bancarios:</b><br/>
👉 Efecty, Punto de Pago, SuperEfectivo, Jumbo, Surtimax, Éxito, Olímpica, Carulla, SuperGiros<br/><br/>

<b>📌 Otros puntos físicos:</b><br/>
👉 Farmatodo, Gana, Tiendas Oxxo<br/><br/>

<b>📌 Pago electrónico o billeteras digitales:</b><br/>
👉 PSE, App Triple A, dale!, Nequi, Daviplata, Tpaga, RappiPay<br/>
👉 Código QR en factura, red de cajeros bancarios<br/>
👉 Domiciliación bancaria<br/><br/>

<b>📌 Pago con tarjeta de crédito:</b><br/>
👉 Oficinas de atención al público en Barranquilla y Soledad<br/><br/>

<a href="https://gp.aaa.com.co/Pago#/List" target="_blank">https://gp.aaa.com.co/Pago#/List</a><br/><br/>

⚡ Elige la opción que mejor se adapte a ti y mantén tu servicio al día.
</p>

`





// TODO: MENSAJE SOLICITANDO MENÚ ÁRBOL TRAMITE
const solicitarMenuArbolTramite = `
<p class="solicitarMenuArbolTramite"> En esta opción podrás solicitar📝 el cambio de nombre de tu factura, reportar un inmueble como 
desocupado, gestionar el medidos y consultar 🔍 procedimientos.<br/><br/>

Opciones👇<br/>
  <b>1.</b> Factura a tu nombre 🔄<br/>
  <b>2.</b> Inmueble desocupado 🏠 <br/>
  <b>3.</b> Gestionar tu medidor 🔢 <br/>
  <b>4.</b> Reportar fraudes 🕵️‍♂️ <br/>
  <b>5.</b> Cambio de estrato 🔄<br/>
  <b>6.</b> ¿Qué son las PQRs? ❓<br/><br/>

<i>Escribe <b>“REGRESAR”</b> para volver al menú principal.</i>
</p>
`;



// TODO: SUBMENÚ - FACTURA A TU NOMBRE - TIPO PERSONA - ARBOL TRAMITE
const facturaNombre = `
<p class="facturaNombreTipoPersona"> <b>🙋‍♀️ Desde aquí puedes poner tu factura Triple A a tu nombre.</b> <br/><br/>
  <i>Solo asegúrate de tener en tu celular los documentos necesarios según tu caso 📲.</i><br/><br/>

  <b>1.</b> 🧍 Persona natural <br/>
  <b>2.</b> 🏢 Jurídica <br/>
  <b>3.</b> 🏠 Leasing habitacional <br/><br/>
                                
  <i>Por favor, seleccione una opción para continuar.</i>
</p>
`;

// TODO: SUBMENÚ - PERSONA NATURAL - DOCUMENTOS
const personaNatural = `
<p class="personaNaturalDocumentos"> <b>📄 Documentos necesarios:</b> <br/><br/>

  1️⃣ Certificado de libertad y tradición (no mayor a 30 días) 📄 <br/>
  2️⃣ Copia de la cédula del propietario en formato PDF 🪪 <br/>
  3️⃣ Número de la póliza del predio 🔢 <br/><br/>
  
  <b>¿Cuentas con los documentos digitales?</b> <br/>
  <b>1.</b> Sí <br/>
  <b>2.</b> No <br/>      

</p>
`;

const personaNaturalDocumentosSi = `
<p class="personaNaturalDocumentosSi">
📎 Ahora puedes enviar los documentos directamente en este chat.<br/><br/>

🕵️‍♀️ En un momento validaremos tu información para continuar con tu solicitud.
</p>
`

const personaNaturalDocumentosNo = `
<p class="personaNaturalDocumentosNo">
📎 📌 Para continuar con el cambio de nombre en la factura, es necesario contar con todos los documentos requeridos.<br/><br/>

🕐 Cuando los tengas listos, puedes volver a este canal y retomamos.<br/>

🙋‍♀️ Estoy aquí para ayudarte cuando lo necesites.<br/><br/>

¡Te espero pronto!
</p>
`;


//TODO SUBMENU PERSONA JURIDICA

const personaJuridica = `
<p class="personaJuridica">
  <b>🔎 Requisitos para persona juridica:</b><br/><br/>

  1️⃣ Certificado de libertad y tradición (no mayor a 30 días) 📄<br/>
  2️⃣ Cámara de comercio 📁<br/>
  3️⃣ RUT actualizado 🧾<br/>
  4️⃣ Copia de la cédula del representante legal en formato PDF 🪪<br/>
  5️⃣ Número de la póliza del predio 🔢<br/><br/>

  <b>¿Cuentas con los documentos digitales?</b> <br/>
    <b>1.</b> Sí <br/>
    <b>2.</b> No <br/>      
</p>
`


const personaJuridicaDocumentosSi = `
<p class="personaJuridicaDocumentosSi">
  📎 Ahora puedes enviar los documentos directamente en este chat.<br/><br/>

  🕵️‍♀️ En un momento validaremos tu información para continuar con tu solicitud.
</p>
`

const personaJuridicaDocumentosNo = `
<p class="personaJuridicaDocumentosNo">
  📎 📌 Para continuar con el cambio de nombre en la factura, es necesario contar con todos los documentos requeridos.<br/><br/>

  🕐 Cuando los tengas listos, puedes volver a este canal y retomamos.<br/>

  🙋‍♀️ Estoy aquí para ayudarte cuando lo necesites.<br/><br/>

  ¡Te espero pronto!
</p>
`;


// TODO: PERSONA LEASING HABITACIONAL
const personaLeasingHabitacional = `
<p class="personaLeasingHabitacional">
  <b>🔎 Requisitos para Leasing habitacional:</b><br/><br/>

  1️⃣ Certificado de libertad y tradición (no mayor a 30 días) 📄<br/>
  2️⃣ Copia de la cédula del solicitante en formato PDF 🪪<br/>
  3️⃣ Contrato de Leasing Habitacional firmado con una entidad financiera 🏦<br/>
  4️⃣ Carta de autorización o poder expedido por la entidad financiera 📝<br/>
  5️⃣ Número de la póliza del predio 🔢<br/><br/>

  <b>¿Cuentas con los documentos digitales?</b> <br/>
    <b>1.</b> Sí <br/>
    <b>2.</b> No <br/>   
</p>
`

const personaLeasingHabitacionalDocumentosSi = `
<p class="personaLeasingHabitacionalDocumentosSi">
📎 Ahora puedes enviar los documentos directamente en este chat.<br/><br/>

🕵️‍♀️ En un momento validaremos tu información para continuar con tu solicitud.
</p>
`

const personaLeasingHabitacionalDocumentosNo = `
<p class="personaLeasingHabitacionalDocumentosNo">
📎 📌 Para continuar con el cambio de nombre en la factura, es necesario contar con todos los documentos requeridos.<br/><br/>

🕐 Cuando los tengas listos, puedes volver a este canal y retomamos.<br/>

🙋‍♀️ Estoy aquí para ayudarte cuando lo necesites.<br/><br/>

¡Te espero pronto!
</p>
`;


// TODO: SUBMENÚ - INMUEBLE DESOCUPADO - ARBOL TRAMITE
const inmuebleDesocupado = `<p class="inmuebleDesocupado">🏡 <b>¿Tu inmueble está desocupado?</b><br/><br/>

Si no estás usando el predio actualmente, puedes reportarlo como desocupado para dejar constancia.<br/>
📅 Este reporte solo puede realizarse 1 vez cada 3 meses.<br/><br/>

<i>👉 Para continuar, por favor comparte:</i><br/><br/>

1️⃣ Número de la póliza del predio 🔢<br/>
2️⃣ Tu nombre completo ✍️<br/>
3️⃣ Tu número de cédula 🪪<br/>
4️⃣ Relación con el predio (Propietario, inquilino o administrador) 🤝<br/><br/>

<i>✉️ Una vez envíes esta información, uno de nuestros agentes digitales te atenderá para registrar tu solicitud.</i>
</p>`


const mensajeAsesor = `<p>🔍👩‍💻Me encuentro localizando al primer agente de experiencia disponible, no me tardo.</p>`



// TODO: SUBMENÚ - GESTIONAR TU MEDIDOR - ARBOL TRAMITE
const gestionarMedidor = `<p class="gestionarMedidor">🔧 <b> ¿Necesitas hacer una revisión, cambio o reubicación de tu medidor de agua?</b><br/><br/>

Desde aquí puedes iniciar el proceso 🧰.<br/>
Para continuar, comparte estos datos:<br/><br/>

1️⃣ Número de la póliza del predio 🔢<br/>
2️⃣ Tu nombre completo ✍️<br/>
3️⃣ Tu número de cédula 🪪<br/>
4️⃣ Relación con el predio (Propietario, inquilino o administrador) 🤝<br/><br/>

<i>✉️ Una vez recibamos esta información, un agente de experiencia digital te ayudará con tu solicitud.</i>
</p>`




//TODO: SUBMENÚ - REPORTAR FRAUDES - ARBOL TRAMITE
const reportarFraudes = `<p class="reportarFraudes">🕵️‍♂️ <b>¿Quieres reportar un fraude o una conexión ilegal?</b><br/><br/>

Gracias por ayudarnos a cuidar el servicio de todos 💧<br/><br/>

Para continuar, por favor indícanos:<br/><br/>

1️⃣ Dirección donde ocurre el posible fraude 📍<br/>
2️⃣ Tu nombre completo ✍️<br/><br/>

<i>✉️ En un momento con esta información, un agente de experiencia digital tomará tu caso y te acompañará en el proceso.</i>
`


const reportarFraudesAgente = `<p>🔍👩‍💻Me encuentro localizando al primer agente de experiencia disponible, no me tardo.</p>`




const cambioEstrato = `<p class="cambioEstrato"><b>¡Realiza tu solicitud de cambio de estrato de forma fácil y rápida! 🙌</b><br/><br/>


📄 Solo necesitas contar con el Certificado de estratificación socioeconómica emitido por la Secretaría de Planeación.<br/>
¡Una vez radicada tu solicitud por el portal, nuestro equipo la revisará y te responderemos lo antes posible! ✅ <br/><br/>

Puedes realizar este tramite  en línea ingresando al siguiente enlace 👇<br/>
<a href="https://www.aaa.com.co/formulario-de-presentacion-de-pqr/ " target="_blank">https://www.aaa.com.co/formulario-de-presentacion-de-pqr/</a><br/><br/>
</p>
`


const cambioEstratoOtraConsulta = `
<p>
¿Tienes otra consulta en la que te pueda colaborar 🤖?<br/><br/>

  <b>1.</b> Sí <br/>
  <b>2.</b> No  
</p>
`;


//TODO: SUBMENÚ - QUE SON LAS PQRS - ARBOL TRAMITE

const infoPqrs = `
<p><b>📌 ¿Qué son las PQRs? ¡Infórmate aquí!</b></p>

<p>¿Tienes algo que decirnos? Conoce los mecanismos disponibles que tenemos para ayudarte: ✅</p>

<p><b>🔹 Petición:</b><br/>
Cuando necesitas información o que realicemos alguna acción relacionada con nuestros servicios, sin que exista una inconformidad.</p>

<p><b>🔹 Queja:</b><br/>
Úsala si no estás conforme con la atención recibida o con la prestación del servicio.</p>

<p><b>🔹 Reclamo:</b><br/>
Si deseas que revisemos tu factura o cobros, este es el canal indicado.</p>

<p><b>🔹 Recurso de Reposición:</b><br/>
Si no estás de acuerdo con una decisión tomada por Triple A, puedes solicitar que la revisemos nuevamente.</p>

<p><b>🔹 Recurso de Apelación:</b><br/>
Si no estás de acuerdo con una decisión tomada por Triple A, puedes pedir que la Superintendencia de Servicios Públicos Domiciliarios también la revise.</p>

<p><b>📲 Puedes radicar tu PQR desde nuestro portal 👇</b></p>

<p><a href="https://www.aaa.com.co/formularios-presentacion-pqrs/" target="_blank">https://www.aaa.com.co/formularios-presentacion-pqrs/</a></p>

<p>¡Estamos listos para ayudarte! 💙</p>
`;



const infoPqrsOtraConsulta = `
<p>
¿Tienes otra consulta en la que te pueda colaborar 🤖?<br/><br/>
  <b>1.</b> Sí <br/>
  <b>2.</b> No  
</p>
`

const infoPqrsOtraConsultaNo = `
<p>🤝 Gracias por pasarte por aquí.  Si en otro momento necesitas ayuda, solo escríbeme. ¡Nos vemos pronto! 🚀<br/><br/>
</p>
`



// TODO: MENSAJE SOLICITANDO MENÚ ÁRBOL CREDITO SEGURO 
const solicitarMenuArbolCreditoSeguro = `
<p class="solicitarMenuArbolCreditoSeguro"> <b>📦 ¡Tenemos más beneficios para ti!
Selecciona una de estas opciones para conocer más sobre nuestros servicios adicionales 
disponibles… ¡y lo mejor de todo es que puedes pagarlos en tu factura Triple A! 💧💳</b> <br/><br/>

  <b>1.</b> Financiación No Bancaria <br/>
  <b>2.</b> Seguros Familia Segura <br/> 
  <b>3.</b> Plan Previsión Exequial                  
</p>
`;



//TODO: SUBMENÚ - FINANCIACION NO BANCARIA - ÁRBOL CREDITO SEGURO 

const financiacionNoBancaria = `
<p> <b>🔹 Financiación No Bancaria - DILO</b> <br/><br/>
Selecciona una opción para continuar: <br/><br/>

  <b>1.</b> Consultar mi cupo disponible <br/>
  <b>2.</b> Quiero que un asesor me llame para continuar el proceso 📞 <br/>
  <b>3.</b> Conoce todo sobre DILO                
</p>
`


const consultarCupoDisponible = `
<p>📄 <b>Para consultar tu cupo disponible, por favor envíame la siguiente información:</b><br/><br/>
🔹 Número de tu póliza<br/>
🔹 Tu nombre completo<br/>
🔹 Relación con el predio (propietario, arrendatario, familiar, etc.)<br/><br/>

 💬 ¡Te leo para continuar!          
</p>
`



const solicitarAsesorFinanciacionNoBancaria = `
<p> <b>🙌 ¡Tomaste una excelente decisión!
Ahora para avanzar y recibir una asesoría personalizada, por favor envíame:</b><br/><br/>
🔹 Tu nombre completo<br/>
🔹 Número de tu póliza<br/></br>

💬 Recuerda: El crédito es pre-aprobado para los usuarios que cumplan con las políticas internas definidas por Triple A y se asigna según el estrato del predio.
✨ ¡Un asesor continuará atendiéndote por este chat para acompañarte en todo el proceso!
</p>
`


const todoSobreDILO = `
<p class="todoSobreDILO">

🎉 <b>¡En Triple A premiamos tu fidelidad y buen comportamiento de pago!</b><br/>
Ahora puedes acceder a nuestra línea de crédito de Financiación No Bancaria, con la que podrás realizar tus proyectos soñados.<br/><br/>

<b>💳 ¿Qué es?</b><br/>
Un crédito pre-aprobado para usuarios con mínimo un año de buen comportamiento de pago, sin convenios vigentes, suspensiones o fraudes.<br/><br/>

<b>🔹 ¿Cómo funciona?</b><br/>
Si eres propietario y la factura está a tu nombre, podrás activar tu crédito con nuestros aliados y financiar productos o servicios, ¡pagándolos cómodamente en tu factura Triple A! 🧾<br/><br/>

<b>🏬 Aliados:</b> Éxito, AO, Yego, Ultracem, ElectroAS, Distri Todo, entre otros.<br/><br/>

👉 Para más información visita:<br/>
<a href="https://www.aaa.com.co/adquiere-tu-seguro/" target="_blank">https://www.aaa.com.co/adquiere-tu-seguro/</a>

</p>
`


//TODO: SUBMENÚ - SEGUROS FAMILIA SEGURA - ÁRBOL CREDITO SEGURO 
const segurosFamiliaSegura = `
<p><b>🛡️ Escoge una opción relacionada con tus seguros
Te acompañamos con opciones de protección para ti, tu salud y tu hogar, gracias a nuestra alianza con SBS Seguros.</b> <br/><br/>

  <b>1.</b> Información activación seguros <br/>
  <b>2.</b> Ampliar información de tus productos<br/>
  <b>3.</b> Solicitud de indemnización              
</p>
`

const infoActivacionSeguros = `
<p> <b>💬 ¡Gracias por tu interés en activar uno de nuestros seguros!
Un agente de experiencia digital te acompañará en este proceso para darte toda la información.</b><br/><br/>

📌 Para comenzar, por favor escribe en este chat:<br/><br/>
1️⃣ Tu número de póliza<br/>
2️⃣ Tu nombre completo
</p>
`


const ampliarInfoProductos = `
<p> <b>📞 ¿Quieres más información sobre tus seguros o necesitas ayuda con alguno de los servicios?
Te invitamos a comunicarte con la línea de atención gratuita de SBS Seguros:</b><br/><br/>

📱 Línea nacional gratuita: 01 8000 517 920
📧 Correo electrónico: serviciotriplea@sbseguros.co

📌 Allí podrás:<br/>
1️⃣ Solicitar tus servicios de asistencia<br/>
2️⃣ Obtener información de tus productos<br/>
3️⃣ Interponer peticiones o reclamos<br/>
4️⃣ Recibir orientación en la solicitud y/o seguimiento de indemnizaciones<br/><br/>

🕒 Horario de atención:
📆 Lunes a viernes: 8:00 a.m. a 6:00 p.m.
📆 Sábados: 8:00 a.m. a 12:00 m.

💬 ¡Ellos están listos para ayudarte!
`


const solicitudIndemnizacion = `
<p> <b>📢 Si necesitas radicar tu solicitud de indemnización, sigue los siguientes pasos:</b><br/><br/>


1️⃣ Identifica el tipo de póliza de seguro que tienes.<br/><br/>

2️⃣ Prepara los documentos y soportes requeridos, los cuales puedes consultar en 👉 <a href="https://www.sbseguros.co/indemnizaciones" target="_blank"> www.sbseguros.co/indemnizaciones</a><br/><br/>

3️⃣ Crea el caso en la plataforma de registro de solicitudes de indemnización, adjuntando los documentos soporte a través de la página web 👉 <a href="https://www.sbseguros.co/indemnizaciones" target="_blank"> www.sbseguros.co/indemnizaciones</a>, seleccionando la opción "Cómo solicitar una indemnización."<br/><br/>

4️⃣ Automáticamente se te asignará un número de solicitud 📄 y recibirás por correo electrónico los datos del encargado de gestionar tu caso. (No olvides revisar tu bandeja de SPAM o correo no deseado 📬).<br/><br/>

5️⃣ Una vez el especialista revise la información, te informará los pasos a seguir 👨‍💼👩‍💼.
`

//TODO: SUBMENÚ - PLAN PREVISION EXEQUIAL - ÁRBOL CREDITO SEGURO
const planPrevisionExequial = `
<p><b>🔹Planes de Previsión Exequial - Los Olivos
Por favor selecciona una opción para ayudarte:</b> <br/><br/>

  <b>1.</b> Conocer o activar los planes disponibles<br/>
  <b>2.</b> Ampliar información de tus productos<br/>        
</p>
`


const conocerActivarPlanes = `
<p><b>🌟 ¡Te contamos todo! 🌟</b><br/>
Con nuestros Planes de Previsión Exequial tendrás respaldo en los momentos más difíciles y bienestar para tu familia. 🫂<br/><br/>

<b>Te ofrecemos:</b><br/><br/>

<b>🔹 Plan Familia Más – $21.900</b><br/>
Titular + 5 beneficiarios (sin importar parentesco) + 1 mascota 🐾<br/><br/>

<b>🔹 Plan Familia Plus – $25.900</b><br/>
Titular + 7 beneficiarios + 1 mascota 🐾<br/><br/>

<b>💐 Incluye:</b><br/>
- Salas de homenaje (Murillo, 38, Parque Cementerio)<br/>
- Cobertura nacional 🇨🇴<br/>
- Traslado hasta 300km 🚐<br/>
- Arreglo y cofre<br/>
- Inhumación o cremación<br/>
- Honras fúnebres, ofrenda floral 🌸, videohomenaje 🎥, transporte 🚍 y más.<br/>
- Terapia psicológica familiar ilimitada 🧠💬<br/>
- Tarjeta Golden Offers con descuentos en educación, salud y entretenimiento 🎟️<br/><br/>

<b>👤 Para tener en cuenta:</b><br/>
Titular y beneficiarios entre 0 y 69 años. Mascotas menores de 5 años.<br/><br/>

<b>1.</b> Continuar
</p>
`


//agente

const ampliarInfoProductosPrevision = `
<p> <b>📞 ¡Queremos ayudarte!
Para ampliar información sobre tus productos de previsión exequial o resolver tus dudas, puedes comunicarte con Los Olivos a través de:</b><br/><br/>

📱 WhatsApp o llamada al: 317 439 8162
📩 Correo electrónico: alianzatripleabarranquilla@losolivos.co

✨ Además, si deseas solicitar el servicio de homenaje funerario, puedes llamar 24 horas a:
☎️ Línea fija: 386 0075
📲 Líneas celulares: 310 315 7236 o 313 516 5098

¡Estamos para acompañarte en cada momento! 🌟
</p>
`




// TODO: MENSAJE SOLICITANDO MENÚ ÁRBOL RECOLECCION ESPECIAL ASEO
const solicitarMenuArbolEspAseo = `
<p class="menuArbolRecoleccionEspecialAseo"><b>🧹 ¡Solicita aquí tu servicio de Recolección Especial de Aseo!</b><br/><br/>
Ahora puedes gestionar el retiro de residuos especiales como escombros, podas, troncos y más… ¡y pagarlo en tu factura de Triple A! 🧾<br/><br/>

<b>Selecciona el tipo de recolección que necesitas:</b><br/><br/>

<b>1.</b> Escombros 🧱<br/>
<b>2.</b> Recolección de Podas 🌿<br/>
<b>3.</b> Recolección de Troncos 🌳<br/>
<b>4.</b> Otros residuos especiales ♻️
</p>
`;



//TODO: SUBMENÚ - ESCOMBROS - ARBOL RECOLECCION ESPECIAL ASEO - OPCION 1
const escombros = `
<p><b>🏗️ Condiciones para la Recolección de Escombros</b></p>

🙋‍♀️ Para continuar, debes estar de acuerdo con la siguiente información:<br/><br/>

📌 El material de escombros debe ser entregado en sacos, y cada uno debe estar llenado a la mitad para facilitar su recolección.<br/><br/>

📏 10 sacos equivalen a 1 m³. Si el volumen es mayor a 3 m³, deberás presentarlos sueltos en un lugar de fácil acceso para el vehículo recolector.<br/><br/>

⏳ El servicio será prestado a más tardar dentro de los 5 días hábiles siguientes a la solicitud.<br/><br/>

💲 El valor será cargado en la siguiente factura emitida.<br/><br/>

🔎 Te invitamos a consultar los términos y condiciones de este servicio especial en 👉 <a href="https://www.aaa.com.co" target="_blank">www.aaa.com.co</a><br/><br/>

<b>1.</b> De acuerdo
`;



//ENDPOINT INGRESO NUMERO POLIZA
const ingresoNumeroPoliza = `🔢 Ingresa tu número de póliza sin puntos ni signos.`
//ENDPOINT Información Cliente IVR -> RESPUESTA ENDPOINT

//PASO AUTOMATICO
//🢃🢃🢃🢃 
//MENSAJE DE CONFIRMAR INFORMACION
const confirmarInformacion = `
<b>✅ Confirma que esta información es correcta antes de continuar.</b><br/><br/>

<b>1.</b> Confirmar<br/>
<b>2.</b> Corregir<br/><br/>

`;


//2. SE DEVUELVE A INGRESO NUMERO POLIZA
//🢃🢃🢃🢃 1 CONFIRMAR

//ENDPOINT IVRE ESCOMBROS -> RESPUESTA ENDPOINT

//PASO AUTOMATICO 
//🢃🢃🢃🢃 
//PASO FINAL
const finIVRSolicitudes = `
<p>
🚛 👷‍♂️ Próximamente estaremos visitando tu predio o contactándote para revisar tu reporte.  
Te mantendremos informado.
</p>
`;




//TODO: SUBMENÚ - RECOLECCIÓN DE PODAS - ARBOL RECOLECCION ESPECIAL ASEO - OPCION 2

const recolecciónPodas = `
<p>
<b>🌿 Condiciones para la Recolección de Podas</b><br/><br/>

🙋‍♀️ Para continuar, debes estar de acuerdo con la siguiente información:<br/><br/>

📌 El material de poda debe ser entregado en sacos o bolsas para facilitar su recolección.<br/><br/>

📏 10 sacos o bolsas equivalen a 1 m³. Si el volumen es mayor a 3 m³, deberás presentarlo suelto en un lugar de fácil acceso para el vehículo recolector.<br/><br/>

⏳ El servicio se prestará a más tardar dentro de los 5 días hábiles siguientes a la solicitud.<br/><br/>

💲 El valor será cargado en la siguiente factura emitida.<br/><br/>

🔎 Te invitamos a consultar los términos y condiciones de este servicio especial en 👉 <a href="https://www.aaa.com.co" target="_blank">www.aaa.com.co</a><br/><br/>

<b>1.</b> De acuerdo
</p>
`

//INGRESO NUMERO POLIZA MISMO MENSAJE QUE LA OPCION 1
//= ingresoNumeroPoliza

//endpoint Información Cliente IVR -> RESPUESTA ENDPOINT 
//ENDPOINT Información Cliente IVR


//PASO AUTOMATICO 
//🢃🢃🢃🢃 
//MISMO MENSAJE DE CONFIRMAR INFORMACION 1.CONFIRMAR 2.CORREGIR 
// = confirmarInformacion

//2. SE DEVUELVE A INGRESO NUMERO POLIZA
//🢃🢃🢃🢃 1 CONFIRMAR


//ENDPOINT IVR RECOLECCION PODAS
//endpoint -> IVRRecoleccionPodas -> RESPUESTA ENDPOINT
//ENDPOINT Recolectión Podas


//PASO AUTOMATICO
//🢃🢃🢃🢃  
//MISMO MENSAJE PASO FINAL = finIVRSolicitudes





//TODO: SUBMENÚ - RECOLECCION DE TRONCOS - ARBOL RECOLECCION ESPECIAL ASEO - OPCION 3

const recolecciónTroncos = `
<p>
🌳 <b>Condiciones para la Recolección de Troncos</b><br/><br/>

🙋‍♀️ Para continuar, debes estar de acuerdo con la siguiente información:<br/><br/>

🪓 El material de troncos debe ser entregado picado y ubicado en un lugar con accesos adecuados para facilitar su recolección y medición.<br/>
⏳ El servicio será prestado a más tardar dentro de los 5 días hábiles siguientes a la radicación.<br/>
💲 El valor será cargado en la siguiente factura emitida.<br/>
🔎 Te invitamos a revisar los términos y condiciones de la prestación de servicios especiales en 👉 
<a href="https://www.aaa.com.co" target="_blank">www.aaa.com.co</a><br/><br/>

<b>1.</b> De acuerdo
</p>
`

//INGRESO NUMERO POLIZA MISMO MENSAJE QUE LA OPCION 1
//= ingresoNumeroPoliza


//endpoint Información Cliente IVR -> RESPUESTA ENDPOINT 
//ENDPOINT Información Cliente IVR


//PASO AUTOMATICO 
//MISMO MENSAJE DE CONFIRMAR INFORMACION 1.CONFIRMAR 2.CORREGIR 
// = confirmarInformacion

//2. SE DEVUELVE A INGRESO NUMERO POLIZA
//🢃🢃🢃🢃 1 CONFIRMAR


//ENDPOINT IVR RECOLECCION PODAS
//endpoint -> IVRRecoleccionTroncos -> RESPUESTA ENDPOINT
//ENDPOINT Recolección Troncos 


//PASO AUTOMATICO 
//🢃🢃🢃🢃 
//MISMO MENSAJE PASO FINAL = finIVRSolicitudes




//TODO: SUBMENÚ - RECOLECCION DE TRONCOS - ARBOL RECOLECCION ESPECIAL ASEO - OPCION 4
const otrosResiduosEspeciales = `
<p><b>Para avanzar y recibir una asesoría personalizada, por favor envíame:</b><br/><br/>

🔹 Tu nombre completo<br/>
🔹 Número de tu póliza<br/>
👉
</p>
`


// TODO: MENSAJE SOLICITANDO MENÚ ÁRBOL SERVICIO
const solicitarMenuArbolServicio = `
<p><b>Aquí podrás conocer cómo solicitar la instalación de un nuevo servicio de acueducto y/o alcantarillado con Triple A. 💧</b><br/><br/>

Te explicamos lo que debes hacer:<br/><br/>

<b>1.</b> Presupuestar la contratación de tu nuevo servicio<br/>
<b>2.</b> Contratación inmediata, si cuentas con presupuesto vigente<br/>
</p>
`;



//TODO: SUBMENÚ - PRESUPUESTAR CONTRATACION SERVICIO - ARBOL RECOLECCION ESPECIAL ASEO - OPCION 1
const presupuestarContratacionServicio = `
<p><b>💧¡Disfruta del servicio de agua ya!</b> Permítenos programar una visita gratuita a tu inmueble con el fin de calcular el valor de tu contratación. 🏡</b><br/><br/>

Para agendar esta visita, debes diligenciar una petición ingresando al siguiente enlace:<br/>
👉 <a href="https://www.aaa.com.co/cudpes/" target="_blank">https://www.aaa.com.co/cudpes/</a><br/><br/>

📝 En el formulario, asegúrate de incluir:<br/><br/>

<b>1.</b> Tus datos de forma completa<br/>
<b>2.</b> La dirección del inmueble donde se requiere el nuevo servicio<br/>
<b>3.</b> Una descripción clara de tu requerimiento<br/><br/>

Con este paso, comenzamos el proceso para que muy pronto puedas contar con el servicio en tu hogar o establecimiento. ✅
</p>
`

//TODO: SUBMENÚ - CONTRATACION INMEDIATA - ARBOL RECOLECCION ESPECIAL ASEO - OPCION 2
const contratacionInmediata = `
<p><b>🙋‍♀️ ¡Excelente! Si ya recibiste el presupuesto y estás de acuerdo ✅, puedes continuar con la contratación del servicio escribiendo al correo:</b><br/><br/>

📩 nuevos.servicios@aaa.com.co<br/><br/>

Recuerda incluir la siguiente información:<br/><br/>

<b>📌 Datos básicos:</b><br/><br/>

🔹Número de póliza/Dirección<br/>
🔹Nombre del usuario<br/>
🔹Número de celular de contacto<br/><br/>

<b>🧍‍♂️ Si eres persona natural:</b><br/><br/>

🔹Certificado de tradición del inmueble (vigencia no mayor a 30 días)<br/>
🔹Copia de la cédula de ciudadanía del propietario del inmueble<br/><br/>

<b>🏢 Si eres persona jurídica:</b><br/><br/>

🔹Certificado de tradición del inmueble (vigencia no mayor a 30 días)<br/>
🔹Certificado de existencia y representación legal (Cámara de Comercio)<br/>
🔹Copia del RUT del solicitante<br/>
🔹Copia de la cédula del representante legal<br/><br/>

Una vez envíes los documentos, un asesor continuará contigo para finalizar el proceso ✅
</p>
`

const cambioEstratoOtraConsultaNo = `
<p>🤝 Gracias por pasarte por aquí.  Si en otro momento necesitas ayuda, solo escríbeme. ¡Nos vemos pronto!
</p>
`;





// TODO: MENSAJE SOLICITANDO CONDICION DE ADJUNTOS
const condicionAdjuntos = `<p class="condicionAdjuntosArbol">📝 <b>Adjuntar documentos:</b> <br/><br/>
                            📢 <i>No es obligatorio.</i><br/><br/>
                            ⚠️ <i>Se permite un máximo de 5 archivos.</i><br/>
                            ⚠️ <i>Los documentos deben ser archivos tipo .pdf .xls .xlsx .jpg .png .doc .docx únicamente y no deben superar los 5 MB.</i><br/><br/>
                            1. Adjuntar documentos <br/>
                            2. Continuar.</p>`;

// TODO: MENSAJE DE CONFIRMAR ADJUNTOS
const confirmarAdjuntos = `<p class="confirmarAdjuntosArbol">📝 <b>Por favor, adjuntar los archivos.</b></p>`;

// TODO: MENSAJE DE ALERTA DE NO ENTIENDO
const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
                            ⚠️ <i>Por favor, asegúrese de seguir las instrucciones y proporcione una respuesta válida.</i></p>`;

// TODO: MENSAJE DE ALERTA DE ERROR API
const alertaErrorAPI = `<p class="alertaErrorAPIArbol">⏳ <b>Estamos experimentando una incidencia técnica.</b><br/><br/>
                            🙏 <i>Le pedimos que espere o nos visite nuevamente en breve mientras solucionamos el inconveniente; agradecemos su comprensión.</i></p>`;

// TODO: MENSAJE DE NOVEDAD O INCIDENCIA TECNICA
const novedadIncidenciaTecnica = `<p class="novedadIncidenciaTecnicaArbol">🚨 ¡Atención!<br/><br/>
                                🔄 Estamos experimentando una novedad o incidencia técnica.<br/>
                                🕰️ Por favor, intente nuevamente más tarde. Agradecemos su paciencia.</p>`;

// TODO: MENSAJE DE CLIENTE DESISTE
const clienteDesiste = `<p class="clienteDesisteArbol">⚠️ <b>Hemos notado que ha decidido no continuar con la atención en nuestro sistema.</b><br/><br/>
                           👉 <i>Si necesita asistencia no dude en contactarnos nuevamente.</i></p>`;

// TODO: MENSAJE POR CHAT DIFERENTE A ABIERTO
const chatDiferenteAbierto = `<p class="chatDiferenteAbiertoArbol">⚠️ <b>Este chat está actualmente cerrado.</b><br/><br/>
                            📞 <i>Para continuar la comunicación, por favor, inicie un nuevo chat o contáctenos a través de nuestros canales oficiales.<br/><br/>
                            Agradecemos su comprensión, estamos aquí para ayudarle.</i></p>`;

// TODO: MENSAJE SOLICITANDO ENCUESTA
const solicitoInicioEncuesta = `  <p class="solicitoInicioEncuestaArbol">👉 <b>🙋‍♀️ Para nosotros tu opinión es muy importante.</b><br/><br/>

                                <b>👉 ¿Qué tan satisfecho quedaste con la atención que recibiste de nuestro asesor en este chat?</b><br/><br/>

                                5️⃣ Muy satisfecho 😀<br/>
                                4️⃣ Satisfecho 👍<br/>
                                3️⃣ Indiferente  😐<br/>
                                2️⃣ Insatisfecho 😔<br/>
                                1️⃣ Muy insatisfecho ☹️<br/><br/>
                                
                                <i>Por favor, seleccione una opción para continuar.</i>
                            </p>`;

// * ESTADO DE MENSAJE
const estadoMensaje = {
  recibido: "Recibido",
  enviado: "Enviado",
};

// * TIPO DE MENSAJE
const tipoMensaje = {
  texto: "Texto",
  adjuntos: "Adjuntos",
  multimedia: "Multimedia",
  inactividad: "Inactividad",
  finChat: "Fin Chat",
  errorApi: "Error API",
  formulario: "Formulario",
  pasoAgente: "Paso Agente",
};

// * LECTURA MENSAJE
const lecturaMensaje = {
  noLeido: "No leido",
  leido: "Leido",
};

// * ESTADO REGISTRO
const estadoRegistro = {
  activo: "Activo",
  inactivo: "Inactivo",
};

// * RESPONSABLE
const responsable = "Widget Chat Web Triple A";




// * CONFIGURACIÓN DE INPUTS DINÁMICOS
const inputsConfig = {
  numeroPoliza: {
    campo: 'numeroPoliza',
    cabecera: '🔢 Ingresa tu número de póliza sin puntos ni signos.',
    tipo: 'numerico',
    minCaracteres: 2,
    maxCaracteres: 20,
    mensajeError: 'El número de póliza debe tener entre 2 y 20 dígitos numéricos',
    submenuSiguiente: '-'
  },

  nombresApellidos: {
    campo: 'nombresApellidos',
    cabecera: 'Por favor ingresa tu nombre completo',
    tipo: 'texto_nombre',
    minCaracteres: 2,
    maxCaracteres: 88,
    minPalabras: 2,
    mensajeError: 'El nombre debe tener entre 2 y 88 caracteres y al menos 2 palabras',
    submenuSiguiente: '-'
  },

  numeroDocumento: {
    campo: 'numeroDocumento',
    cabecera: 'Por favor ingresa tu número de cédula:',
    tipo: 'numerico',
    minCaracteres: 2,
    maxCaracteres: 15,
    mensajeError: 'El número de cédula debe tener entre 2 y 15 dígitos',
    submenuSiguiente: '-'
  },

  relacionPredio: {
    campo: 'relacionPredio',
    cabecera: 'Por favor indica tu relación con el predio (propietario, arrendatario, familiar, etc.):',
    tipo: 'texto_alfanumerico',
    minCaracteres: 2,
    maxCaracteres: 500,
    mensajeError: 'La relación debe tener entre 2 y 500 caracteres',
    submenuSiguiente: '-'
  },

  direccion: {
    campo: 'direccion',
    cabecera: 'Por favor ingresa la dirección donde ocurre el posible fraude:',
    tipo: 'texto_direccion',
    minCaracteres: 2,
    maxCaracteres: 150,
    mensajeError: 'La dirección debe tener entre 2 y 150 caracteres',
    submenuSiguiente: '-'
  },

  revisarFactura: {
    campo: 'revisarFactura',
    cabecera: '❓ ¿Qué te gustaría revisar de tu factura?',
    tipo: 'texto_alfanumerico',
    minCaracteres: 2,
    maxCaracteres: 200,
    mensajeError: 'Por favor ingresa qué deseas revisar (mínimo 2 caracteres)',
    submenuSiguiente: '-'
  },

  descripcionProblema: {
    campo: 'descripcionProblema',
    cabecera: '3️⃣ Cuéntanos qué ocurre: 💬',
    tipo: 'texto_alfanumerico',
    minCaracteres: 2,
    maxCaracteres: 500,
    mensajeError: 'La descripción debe tener entre 2 y 500 caracteres',
    submenuSiguiente: '-'
  }
};


// * MENSAJES DE VALIDACIÓN DINÁMICOS
const mensajesValidacion = {
  alertaLongitudMinima: (campo, min) => {
    return `<p class="alertaArbol">
      ⚠️ <b>El campo ${campo} es muy corto.</b><br/><br/>
      Por favor ingrese al menos ${min} caracteres.
    </p>`;
  },
  alertaLongitudMaxima: (campo, max) => {
    return `<p class="alertaArbol">
      ⚠️ <b>El campo ${campo} es muy largo.</b><br/><br/>
      Por favor ingrese máximo ${max} caracteres.
    </p>`;
  },
  alertaValidacionNumerica: `<p class="alertaArbol">
    ⚠️ <b>Valor inválido.</b><br/><br/>
    Por favor ingrese solo números.
  </p>`,
  alertaDatosFaltantes: (campos) => {
    return `<p class="alertaArbol">
      ⚠️ <b>Faltan datos requeridos.</b><br/><br/>
      Para continuar necesitamos: ${campos}<br/><br/>
      Por favor, proporcione esta información primero.
    </p>`;
  }
};

// ! EXPORTACIONES ORGANIZADAS POR CATEGORÍAS
module.exports = {
  // * CONFIGURACIONES DEL SISTEMA
  configuracion: {
    tipoGestion,
    estadoChat,
    estadoGestion,
    controlApi,
    estadoMensaje,
    tipoMensaje,
    lecturaMensaje,
    estadoRegistro,
    responsable,
  },

  // * ESTRUCTURA DEL ARBOL DE NAVEGACION
  arbol,

  // * MENSAJES DEL SISTEMA
  mensajes: {
    saludo,
    despedida,
    instrucciones,
    solicitarFormularioInicial,
    saludoUsuario,

    // * MENSAJES ÁRBOL PRINCIPAL
    solicitarMenuArbolPrincipal,



    // * MENSAJES ÁRBOL CONTROL SERVICIO
    solicitarMenuArbolControlServicio,
    interrupcionesYCierres,
    verificarPoliza,
    numeroPolizaControlServicio,
    // confirmarInformacion,
    sinPoliza,
    mensajeFinalArbolControlServicio,
    direccionAsociadaPoliza,
    mensajeExitoIVR,
    mensajeExitoEstadoCuenta,









    // * MENSAJES ÁRBOL FACTURA Y PAGO
    solicitarMenuArbolFacturaPago,
    numeroPolizaFactura,
    mensajeErrorFactura,
    opcionesSaldoFactura,
    msgFinalFactura,
    msgExitoTBODatosCliente,
    msgExitoTBOCopiaFacturaPDF,
    acuerdoPago,
    aclaracionFactura,
    puntosDePago,





    // * MENSAJES ÁRBOL TRÁMITE
    solicitarMenuArbolTramite,
    facturaNombre,
    personaNatural,
    personaNaturalDocumentosSi,
    personaNaturalDocumentosNo,
    personaJuridica,
    personaJuridicaDocumentosSi,
    personaJuridicaDocumentosNo,
    personaLeasingHabitacional,
    personaLeasingHabitacionalDocumentosSi,
    personaLeasingHabitacionalDocumentosNo,
    inmuebleDesocupado,
    gestionarMedidor,
    reportarFraudes,
    reportarFraudesAgente,
    cambioEstrato,
    cambioEstratoOtraConsulta,
    cambioEstratoOtraConsultaNo,
    infoPqrs,
    infoPqrsOtraConsulta,
    infoPqrsOtraConsultaNo,



    // * MENSAJES ÁRBOL CRÉDITO SEGURO
    solicitarMenuArbolCreditoSeguro,
    financiacionNoBancaria,
    consultarCupoDisponible,
    solicitarAsesorFinanciacionNoBancaria,
    todoSobreDILO,
    segurosFamiliaSegura,
    infoActivacionSeguros,
    ampliarInfoProductos,
    solicitudIndemnizacion,
    planPrevisionExequial,
    conocerActivarPlanes,
    ampliarInfoProductosPrevision,







    // * MENSAJES ÁRBOL RECOLECCION ESPECIAL ASEO
    solicitarMenuArbolEspAseo,
    escombros,
    ingresoNumeroPoliza,
    confirmarInformacion,
    recolecciónPodas,
    recolecciónTroncos,
    otrosResiduosEspeciales,
    finIVRSolicitudes,









    // * MENSAJES ÁRBOL SOLICITAR SERVICIO
    solicitarMenuArbolServicio,
    presupuestarContratacionServicio,
    contratacionInmediata,



    condicionAdjuntos,
    confirmarAdjuntos,
    alertaNoEntiendo,
    alertaErrorAPI,
    novedadIncidenciaTecnica,
    clienteDesiste,
    chatDiferenteAbierto,
    alertaLimiteCaracteres,
    mensajesValidacion,
    mensajeAsesor,
    solicitoInicioEncuesta,
  },
  // * CONFIGURACIONES
  inputsConfig,
};