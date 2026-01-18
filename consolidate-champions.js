/**
 * Script para consolidar dados dos campeões da database Dragontail
 * Lê todos os arquivos individuais e gera um JSON otimizado
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHAMPION_FOLDER = path.join(
  __dirname,
  "database",
  "dragontail-16.1.1",
  "16.1.1",
  "data",
  "en_US",
  "champion",
);
const OUTPUT_FILE = path.join(__dirname, "public", "champions-full.json");

console.log("🔄 Iniciando consolidação dos dados dos campeões...\n");

// Ler todos os arquivos JSON da pasta de campeões
const championFiles = fs
  .readdirSync(CHAMPION_FOLDER)
  .filter((file) => file.endsWith(".json"));

console.log(`📊 Total de campeões encontrados: ${championFiles.length}\n`);

// Array para armazenar todos os campeões
const allChampions = [];

let processedCount = 0;
let errorCount = 0;

championFiles.forEach((file) => {
  try {
    const filePath = path.join(CHAMPION_FOLDER, file);
    const championData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Extrair o campeão do objeto e adicionar ao array
    const championKey = Object.keys(championData.data)[0];
    const champion = championData.data[championKey];
    allChampions.push(champion);

    processedCount++;
    console.log(`✅ ${processedCount}. ${championKey} processado`);
  } catch (error) {
    errorCount++;
    console.error(`❌ Erro ao processar ${file}:`, error.message);
  }
});

console.log(`\n📝 Escrevendo arquivo consolidado...`);

// Criar pasta public se não existir
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Escrever arquivo como ARRAY
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allChampions, null, 2));

console.log(`\n✅ Consolidação concluída!`);
console.log(`📦 Total processado: ${processedCount} campeões`);
console.log(`❌ Erros: ${errorCount}`);
console.log(`💾 Arquivo gerado: ${OUTPUT_FILE}`);
console.log(
  `📏 Tamanho: ${(fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2)} MB\n`,
);
