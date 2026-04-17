# widget-chat-web-triple-a

**Autor:** Ramón Dario Rozo Torres  
**Última Modificación:** Ramón Dario Rozo Torres  
**Versión:** 1.0.0

## 📋 Descripción General

Widget de chat web integrable para Triple A, desarrollado como una solución escalable y modular que permite comunicación en tiempo real con los usuarios del sitio oficial. Sistema completo construido con arquitectura cliente-servidor que proporciona una experiencia de chat fluida y responsiva.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────┐    ┌──────────────────────┐    ┌──────────────────┐
│   Widget Frontend   │    │   API Backend        │    │   Base de        │
│   (JavaScript       │◄──►│   (Node.js +         │◄──►│   Datos          │
│    Vanilla)         │    │    Express)          │    │   (SQL Server)   │
└─────────────────────┘    └──────────────────────┘    └──────────────────┘
                                        │
                                        ▼
                          ┌──────────────────────┐
                          │  AWS S3 (Storage)    │
                          │  SoulChat (Service)  │
                          │  Email (Notify)      │
                          └──────────────────────┘
```

### Componentes Principales

- **Widget Frontend:** JavaScript embebible que se integra en cualquier página web
- **API Backend:** REST API con Node.js y Express para procesamiento de datos
- **Base de Datos:** SQL Server con migraciones y sincronización de datos
- **Almacenamiento:** AWS S3 para archivos y logs
- **Servicios Externos:** Integración con SoulChat para procesamiento de mensajes
- **Schedulers:** Tareas programadas para mantenimiento automático

## 🚀 Funcionalidades

### Funcionalidades Core

- **Chat en Tiempo Real:** Comunicación instantánea con múltiples usuarios
- **Gestión de Archivos:** Carga y descarga segura de documentos
- **Validación de Datos:** Sanitización y validación en todos los endpoints
- **Historial Completo:** Almacenamiento persistente de conversaciones
- **Integración IA:** Conexión con servicios SoulChat
- **Multiidioma:** Soporte para múltiples idiomas
- **Cierre Automático:** Gestión inteligente de chats antiguos
- **Sincronización AWS:** Respaldo de logs en S3

### Módulos del Sistema

- **Chat Widget:** Widget embebible responsivo
- **Mensajes:** Gestión de conversaciones
- **Archivos:** Carga y descarga de documentos
- **Logs:** Trazabilidad completa de operaciones
- **Scheduler:** Mantenimiento automático del sistema

## 📦 Stack Tecnológico

### Frontend

| Tecnología          | Versión | Descripción              |
| ------------------- | ------- | ------------------------ |
| **JavaScript**      | ES6+    | Lenguaje de programación |
| **Materialize CSS** | (CDN)   | Framework CSS responsivo |
| **Select2**         | (CDN)   | Selectores avanzados     |
| **DataTables**      | (CDN)   | Tablas dinámicas         |
| **SweetAlert2**     | (CDN)   | Alertas modernas         |

### Backend

| Tecnología       | Versión | Descripción           |
| ---------------- | ------- | --------------------- |
| **Node.js**      | 14.x+   | Entorno de ejecución  |
| **Express.js**   | ^4.x    | Framework web         |
| **SQL Server**   | 2019+   | Base de datos         |
| **Morgan**       | ^1.x    | Logging HTTP          |
| **Winston**      | ^3.x    | Logging de aplicación |
| **Rate Limiter** | ^5.x    | Control de tráfico    |
| **AWS SDK**      | ^2.x    | Almacenamiento S3     |
| **Handlebars**   | ^7.x    | Motor de plantillas   |

### Base de Datos

| Tecnología      | Versión | Descripción                         |
| --------------- | ------- | ----------------------------------- |
| **SQL Server**  | 2019+   | Sistema de gestión de base de datos |
| **Migraciones** | SQL     | Scripts de estructura y esquema     |
| **Seeds**       | SQL     | Datos iniciales y de prueba         |

### DevOps

| Tecnología         | Versión | Descripción        |
| ------------------ | ------- | ------------------ |
| **Docker**         | 20.10+  | Contenedorización  |
| **Docker Compose** | 1.29+   | Orquestación local |
| **Nginx**          | Latest  | Reverse proxy      |

## 🛠️ Instalación y Configuración

### Requisitos Previos

- **Node.js** 14.0 o superior
- **npm** 6.0 o superior
- **SQL Server** 2019 o superior
- **Git** - Sistema de control de versiones
- **Docker** y **Docker Compose** (para instalación con Docker)
- Credenciales válidas para AWS S3
- Token/API key de SoulChat

### 🔧 Instalación Tradicional

#### Pasos

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/devdariorozo/widget-chat-web-triple-a.git
   cd widget-chat-web-triple-a/v1
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**

   ```bash
   cp .env.example .env
   # Editar .env con las configuraciones específicas:
   # - Conexión a SQL Server
   # - Credenciales AWS S3
   # - Token SoulChat
   # - Configuración de puerto y entorno
   ```

4. **Ejecutar migraciones de base de datos:**

   ```bash
   npm run migrate
   ```

5. **Cargar datos iniciales (opcional):**

   ```bash
   npm run seed
   ```

6. **Iniciar el servidor:**

   ```bash
   npm run dev    # Desarrollo
   npm run qa     # QA
   npm run prod   # Producción
   ```

### 🐳 Instalación con Docker

#### Pasos

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/devdariorozo/widget-chat-web-triple-a.git
   cd widget-chat-web-triple-a/v1
   ```

2. **Configurar variables de entorno:**

   ```bash
   cp .env.example .env
   # Editar .env con las configuraciones necesarias
   ```

3. **Construir las imágenes:**

   ```bash
   docker-compose build
   ```

4. **Iniciar los contenedores:**

   ```bash
   docker-compose up -d
   ```

5. **Ejecutar migraciones:**

   ```bash
   docker-compose exec app npm run migrate
   ```

6. **Cargar datos iniciales (opcional):**

   ```bash
   docker-compose exec app npm run seed
   ```

7. **Verificar estado de los contenedores:**

   ```bash
   docker-compose ps
   ```

8. **Ver logs:**

   ```bash
   docker-compose logs -f app
   ```

9. **Detener los contenedores:**
   ```bash
   docker-compose down
   ```

## 📁 Estructura del Proyecto

```
widget-chat-web-triple-a/
├── v1/                       # Versión actual de la API
│   ├── assets/                # Archivos estáticos (CSS, JS, imágenes, fuentes, librerías)
│   ├── config/                # Configuración de base de datos
│   ├── controllers/           # Lógica de negocio (chat, mensajes)
│   ├── helpers/               # Funciones auxiliares
│   ├── logger/                # Sistema de logging
│   ├── middlewares/           # Middlewares Express
│   ├── migrations/            # Scripts de migración SQL
│   ├── models/                # Modelos de datos
│   ├── routes/                # Rutas de la API
│   ├── schedulers/            # Tareas programadas (cierre de chats, subida a S3)
│   ├── seeds/                 # Datos iniciales
│   ├── services/              # Servicios de negocio (AWS S3, SoulChat)
│   ├── testing/               # Tests y pruebas
│   ├── uploads/               # Archivos cargados por usuarios
│   ├── utils/                 # Utilidades y helpers
│   ├── validators/            # Validadores de datos
│   ├── views/                 # Vistas Handlebars
│   ├── widget/                # Widget embebible (JavaScript y CSS)
│   ├── app.js                 # Punto de entrada principal
│   ├── package.json           # Dependencias del proyecto
│   ├── Dockerfile             # Configuración Docker
│   └── docker-compose.yml     # Orquestación Docker
├── 🚀 deploys/
│   └── Contiene las solicitudes y documentación de despliegues para el sistema.
├── 📋 material-apoyo/
│   └── Contiene plantillas y archivos de soporte para usuarios que facilitan el levantamiento de la aplicación.
├── 🔐 accesos/
│   └── Contiene información de conexión y configuración de servicios externos (SoulChat).
└── actas/
    └── Documentación de reuniones y decisiones técnicas.
```

## 🔒 Seguridad

### Medidas Implementadas

- **CORS:** Configuración restrictiva y específica de orígenes
- **Rate Limiting:** Control de tráfico en endpoints críticos
- **Validación:** Sanitización de entrada en todos los endpoints
- **Encriptación:** Datos sensibles encriptados en base de datos
- **HTTPS:** Comunicación segura en producción
- **Variables de Entorno:** Credenciales nunca en el código

### Buenas Prácticas

- Logs de auditoría para todas las operaciones críticas
- Validación de archivos antes del procesamiento
- Timeouts configurados en peticiones HTTP
- Protección contra inyección SQL mediante ORM
- Headers de seguridad configurados (X-Frame-Options, X-Content-Type-Options, etc.)

## 📊 Rendimiento

### Optimizaciones

- **Caché:** Caché de respuestas frecuentes
- **Índices:** Índices de base de datos optimizados para consultas frecuentes
- **Minificación:** Assets minificados en producción
- **Compresión:** Gzip habilitado en respuestas HTTP
- **Connection Pool:** Pool de conexiones a SQL Server optimizado

### Límites del Sistema

- **Archivo Máximo:** 50 MB por archivo
- **Conexiones Concurrentes:** 100+ usuarios simultáneos
- **Rate Limiting:** 100 peticiones por minuto por IP
- **Timeout Backend:** 30 segundos por petición
- **Timeout Widget:** 10 segundos por petición
- **Almacenamiento:** Límite configurable en AWS S3

### Adjuntos Permitidos

- **Archivos:** pdf, xls, xlsx, jpg, png, doc, docx
- **Tamaño Máximo:** 5 MB por archivo
- **Máximo de Archivos:** 5 archivos por mensaje

### Monitoreo

- Logs detallados de rendimiento y errores
- Alertas automáticas para errores críticos
- Métricas de uso disponibles en dashboard

## 🏃‍♂️ Uso del Sistema

### Iniciar Servicios

```bash
# Desarrollo
npm run dev

# QA
npm run qa

# Producción
npm run prod
```

### Con Docker

```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Detener
docker-compose down
```

## 🔑 Acceso a la Aplicación

### URLs de Acceso (Según Ambiente)

**Desarrollo:**

- Widget: http://localhost:3000/widget/chatWeb.js
- API: http://localhost:3000/api

**QA:**

- Widget: https://widget-qa.tudominio.com/chatWeb.js
- API: https://api-qa.tudominio.com

**Producción:**

- Widget: https://widget.tudominio.com/chatWeb.js
- API: https://api.tudominio.com

## 📞 Soporte

### Contacto

- **Desarrollador:** Ramón Dario Rozo Torres
- **Email:** desarrollo.dariorozo@gmail.com
- **Empresa:** MONTECHELO S.A.S

## 🤝 Contribución

- **Repositorio**: https://dev.azure.com/MontecheloPipelines/SquadMiosV2/_git/widget-chat-web-triple-a

### Flujo de Trabajo

1. **Crear una rama desde master:**

   ```bash
   git checkout -b nombre_tu_rama
   ```

2. **Realizar cambios y commits descriptivos:**

   ```bash
   git commit -m "Descripción clara del cambio"
   ```

3. **Hacer push a tu rama:**

   ```bash
   git push origin nombre_tu_rama
   ```

4. **Crear Pull Request a la rama quality**

5. **Si es aprobado, merge a master**

6. **Solicitar deploy**

### Estándares de Código

- Usar nomenclatura clara y consistente
- Incluir comentarios en código complejo
- Seguir la estructura de carpetas existente
- Validar cambios localmente antes de push
- Escribir commits descriptivos

## 📄 Licencia

**© 2025 MONTECHELO S.A.S - Todos los derechos reservados**
