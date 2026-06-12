import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const videosDir = path.join(__dirname, 'videos');

if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir);
}

// Función auxiliar para simular escritura humana
async function typeLikeHuman(page, selector, text) {
  for (const char of text) {
    await page.type(selector, char, { delay: 100 }); // 100ms entre teclas
  }
}

async function run() {
  console.log('🎬 Iniciando grabación del video...');
  
  const browser = await chromium.launch({ headless: true });
  // El contexto es el que graba el video
  const context = await browser.newContext({
    recordVideo: {
      dir: videosDir,
      size: { width: 1280, height: 720 },
    },
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();

  console.log('Navegando a la aplicación...');
  await page.goto('http://localhost:5173/login');
  await page.waitForTimeout(1500); // Pausa para que se vea el inicio
  
  console.log('Iniciando sesión...');
  await typeLikeHuman(page, 'input[type="text"]', 'ana.super');
  await page.waitForTimeout(500);
  await typeLikeHuman(page, 'input[type="password"]', 'super123');
  await page.waitForTimeout(500);
  
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type="submit"]')
  ]);
  
  console.log('Explorando el Dashboard...');
  await page.waitForTimeout(3000); // Pausa para admirar el dashboard
  
  // Opcional: Interactuar con botones si existen (como "Crear Caso")
  // Intentaremos hacer click en algún botón si lo encontramos, o al menos hacemos scroll
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(1500);
  await page.mouse.wheel(0, -500);
  await page.waitForTimeout(1500);
  
  console.log('Cerrando sesión...');
  // Hacemos click en el botón de cerrar sesión
  await Promise.all([
    page.waitForNavigation(),
    page.click('text=Cerrar Sesión')
  ]);
  
  await page.waitForTimeout(1500); // Vemos la pantalla de login de nuevo
  
  // Cerramos el contexto para asegurar que el video se guarda completamente
  await context.close();
  await browser.close();
  
  // Buscar el archivo generado y moverlo al Escritorio
  const files = fs.readdirSync(videosDir);
  const videoFile = files.find(f => f.endsWith('.webm') && f.length > 20); // Los nombres por defecto son hashes largos
  
  if (videoFile) {
    const oldPath = path.join(videosDir, videoFile);
    
    // Ruta dinámica al Escritorio de Windows
    const desktopDir = path.join(os.homedir(), 'Desktop');
    const finalPath = path.join(desktopDir, 'demo-apuntador.webm');
    
    if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath); // Eliminar si ya existe de antes
    fs.renameSync(oldPath, finalPath);
    
    console.log(`✅ ¡Video guardado con éxito en tu escritorio: ${finalPath}`);
    console.log('Puedes reproducir o subir este archivo .webm a LinkedIn (LinkedIn soporta MP4 nativamente, puedes convertirlo online si te da problemas o subirlo a YouTube/Vimeo y enlazarlo).');
  } else {
    console.log('⚠️ No se encontró el archivo de video generado.');
  }
}

run().catch(console.error);
