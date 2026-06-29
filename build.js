const fs = require('fs');
const path = require('path');

console.log("Iniciando build do Portfólio (inlinando arquivos para ocultar pastas no F12)...");

try {
  let html = fs.readFileSync(path.join(__dirname, 'index.template.html'), 'utf8');

  // 1. Inline CSS
  const cssPath = path.join(__dirname, 'assets', 'css', 'main.css');
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const cssTagPattern = /<link\s+rel="stylesheet"\s+href="assets\/css\/main\.css"\s*\/?>/gi;
    html = html.replace(cssTagPattern, `<style>\n${cssContent}\n</style>`);
    console.log("- CSS inlinado com sucesso.");
  } else {
    console.warn("Aviso: assets/css/main.css não encontrado.");
  }

  // 2. Inline Javascript files
  const jsFiles = [
    { tag: /<script\s+src="assets\/js\/models\/portfolioModel\.js"\s*><\/script>/gi, file: 'assets/js/models/portfolioModel.js' },
    { tag: /<script\s+src="assets\/js\/views\/portfolioView\.js"\s*><\/script>/gi, file: 'assets/js/views/portfolioView.js' },
    { tag: /<script\s+src="assets\/js\/scenes\/heroScene\.js"\s*><\/script>/gi, file: 'assets/js/scenes/heroScene.js' },
    { tag: /<script\s+src="assets\/js\/scenes\/skillsScene\.js"\s*><\/script>/gi, file: 'assets/js/scenes/skillsScene.js' },
    { tag: /<script\s+src="assets\/js\/controllers\/portfolioController\.js"\s*><\/script>/gi, file: 'assets/js/controllers/portfolioController.js' }
  ];

  jsFiles.forEach(item => {
    const fullPath = path.join(__dirname, item.file);
    if (fs.existsSync(fullPath)) {
      const jsContent = fs.readFileSync(fullPath, 'utf8');
      html = html.replace(item.tag, `<script>\n${jsContent}\n</script>`);
      console.log(`- ${item.file} inlinado com sucesso.`);
    } else {
      console.warn(`Aviso: ${item.file} não encontrado.`);
    }
  });

  // Salvar no index.html final
  fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
  console.log("Build concluído com sucesso! index.html atualizado (tudo inlinado).");
} catch (error) {
  console.error("Erro durante o build:", error);
  process.exit(1);
}
