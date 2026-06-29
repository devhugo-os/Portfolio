const fs = require('fs');
const path = require('path');

console.log("Iniciando build do Portfólio (inlinando arquivos diretamente no index.html)...");

try {
  const htmlPath = path.join(__dirname, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    throw new Error("index.html não encontrado.");
  }
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Helper para substituir conteúdo entre os comentários de marcação
  function replaceBlock(source, startMarker, endMarker, newContent) {
    const pattern = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'i');
    if (!pattern.test(source)) {
      console.warn(`Aviso: Marcadores ${startMarker} e ${endMarker} não encontrados.`);
      return source;
    }
    return source.replace(pattern, `${startMarker}\n${newContent}\n${endMarker}`);
  }

  // 1. Inline CSS
  const cssPath = path.join(__dirname, 'assets', 'css', 'main.css');
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    html = replaceBlock(html, '<!-- INLINED_CSS_START -->', '<!-- INLINED_CSS_END -->', `<style>\n${cssContent}\n</style>`);
    console.log("- CSS inlinado com sucesso.");
  } else {
    console.warn("Aviso: assets/css/main.css não encontrado.");
  }

  // 2. Inline Javascript files
  const jsFiles = [
    { start: '<!-- INLINED_MODEL_START -->', end: '<!-- INLINED_MODEL_END -->', file: 'assets/js/models/portfolioModel.js' },
    { start: '<!-- INLINED_VIEW_START -->', end: '<!-- INLINED_VIEW_END -->', file: 'assets/js/views/portfolioView.js' },
    { start: '<!-- INLINED_HERO_SCENE_START -->', end: '<!-- INLINED_HERO_SCENE_END -->', file: 'assets/js/scenes/heroScene.js' },
    { start: '<!-- INLINED_SKILLS_SCENE_START -->', end: '<!-- INLINED_SKILLS_SCENE_END -->', file: 'assets/js/scenes/skillsScene.js' },
    { start: '<!-- INLINED_CONTROLLER_START -->', end: '<!-- INLINED_CONTROLLER_END -->', file: 'assets/js/controllers/portfolioController.js' }
  ];

  jsFiles.forEach(item => {
    const fullPath = path.join(__dirname, item.file);
    if (fs.existsSync(fullPath)) {
      const jsContent = fs.readFileSync(fullPath, 'utf8');
      html = replaceBlock(html, item.start, item.end, `<script>\n${jsContent}\n</script>`);
      console.log(`- ${item.file} inlinado com sucesso.`);
    } else {
      console.warn(`Aviso: ${item.file} não encontrado.`);
    }
  });

  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log("Build concluído com sucesso! index.html atualizado diretamente.");
} catch (error) {
  console.error("Erro durante o build:", error);
  process.exit(1);
}
