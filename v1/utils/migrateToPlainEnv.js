// ! ================================================================================================================================================
// !                                                     MIGRACIÓN A VARIABLES SIN ENCRIPTACIÓN
// ! ================================================================================================================================================
// @version 1.0.0
// v1/utils/migrateToPlainEnv.js

// ! REQUIRES
const fs = require('fs');
const path = require('path');
const { decrypt } = require('./cryptoData.js');

// ! FUNCIONES
// * FUNCIÓN PARA MIGRAR COMPLETAMENTE A VARIABLES SIN ENCRIPTACIÓN
function migrateToPlainEnv() {
    try {
        console.log('========================================================================================');
        console.log('                           ♦♦♦ MIGRACIÓN A VARIABLES SIN ENCRIPTACIÓN ♦♦♦');
        console.log('========================================================================================');

        // todo: Paso 1: Desencriptar el archivo .env
        console.log('\n📋 PASO 1: Desencriptando archivo .env...');
        const envPath = path.resolve(__dirname, '../.env');
        const envBackupPath = path.resolve(__dirname, '../.env.backup');
        const envDecryptedPath = path.resolve(__dirname, '../.env.decrypted');

        // todo: Verificar si el archivo .env existe
        if (!fs.existsSync(envPath)) {
            console.log('❌ Error: El archivo .env no existe');
            return;
        }

        // todo: Crear backup del archivo original
        fs.copyFileSync(envPath, envBackupPath);
        console.log('✅ Backup creado:', envBackupPath);

        // todo: Leer y desencriptar el archivo .env
        const envLines = fs.readFileSync(envPath, 'utf-8').split('\n');
        const decryptedEnvLines = envLines.map((line) => {
            if (line.trim().startsWith('#') || line.trim() === '') {
                return line;
            }

            const [key, ...rest] = line.split('=');
            if (rest.length === 0) {
                return line;
            }

            const encryptedValue = rest.join('=');
            
            try {
                const decryptedValue = decrypt(encryptedValue.trim());
                return `${key}=${decryptedValue}`;
            } catch (error) {
                console.log(`⚠️  No se pudo desencriptar ${key}, manteniendo valor original`);
                return line;
            }
        });

        // todo: Escribir archivo desencriptado
        fs.writeFileSync(envDecryptedPath, decryptedEnvLines.join('\n'));
        console.log('✅ Archivo desencriptado creado:', envDecryptedPath);

        // todo: Paso 2: Identificar archivos que usan decrypt()
        console.log('\n📋 PASO 2: Identificando archivos que usan decrypt()...');
        const filesToModify = [
            '../app.js',
            '../config/database.js',
            '../services/serviceSoulChat.service.js'
        ];

        const filesWithDecrypt = [];
        filesToModify.forEach(filePath => {
            const fullPath = path.resolve(__dirname, filePath);
            if (fs.existsSync(fullPath)) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                if (content.includes('decrypt(process.env.')) {
                    filesWithDecrypt.push({
                        path: filePath,
                        fullPath: fullPath,
                        content: content
                    });
                }
            }
        });

        console.log(`📊 Archivos que usan decrypt(): ${filesWithDecrypt.length}`);

        // todo: Paso 3: Mostrar las líneas que necesitan modificación
        console.log('\n📋 PASO 3: Líneas que necesitan modificación:');
        console.log('========================================================================================');
        
        filesWithDecrypt.forEach(file => {
            console.log(`\n📁 Archivo: ${file.path}`);
            const lines = file.content.split('\n');
            lines.forEach((line, index) => {
                if (line.includes('decrypt(process.env.')) {
                    const lineNumber = index + 1;
                    console.log(`   Línea ${lineNumber}: ${line.trim()}`);
                    
                    // Mostrar cómo debería quedar
                    const modifiedLine = line.replace(/decrypt\(process\.env\.([^)]+)\)/g, 'process.env.$1');
                    console.log(`   → Debería ser: ${modifiedLine.trim()}`);
                }
            });
        });

        // todo: Paso 4: Instrucciones finales
        console.log('\n📋 PASO 4: Instrucciones para completar la migración:');
        console.log('========================================================================================');
        console.log('1️⃣  Reemplaza el contenido de .env con el de .env.decrypted:');
        console.log('   cp .env.decrypted .env');
        console.log('');
        console.log('2️⃣  Modifica los archivos identificados arriba:');
        console.log('   - Remueve las llamadas a decrypt()');
        console.log('   - Usa directamente process.env.VARIABLE');
        console.log('');
        console.log('3️⃣  Remueve la importación de cryptoData en los archivos modificados:');
        console.log('   - Elimina: const { decrypt } = require(\'./utils/cryptoData.js\');');
        console.log('');
        console.log('4️⃣  Prueba la aplicación:');
        console.log('   npm run dev');
        console.log('');
        console.log('5️⃣  Si todo funciona, puedes eliminar:');
        console.log('   - .env.backup (backup del archivo original)');
        console.log('   - .env.decrypted (archivo temporal)');
        console.log('   - utils/cryptoData.js (si no se usa en otros lugares)');
        console.log('   - utils/cryptoEnv.js (herramienta de encriptación)');
        console.log('   - utils/decryptEnv.js (herramienta de desencriptación)');
        console.log('   - utils/migrateToPlainEnv.js (este script)');
        console.log('========================================================================================');
        console.log('                           ♦♦♦ MIGRACIÓN PREPARADA ♦♦♦');
        console.log('========================================================================================');

    } catch (error) {
        console.log('❌ Error durante la migración:', error.message);
        console.log('🔍 Detalles del error:', error);
    }
}

// * EJECUTAR LA FUNCIÓN
migrateToPlainEnv(); 