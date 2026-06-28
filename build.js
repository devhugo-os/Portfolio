const fs = require('fs');
const path = require('path');

try {
  console.log("Iniciando build do Portfólio (empacotando fontes inline)...");

  // 1. Ler o arquivo template
  let template = fs.readFileSync(path.join(__dirname, 'index.template.html'), 'utf8');

  // 2. Ler e embutir o CSS
  const cssPath = path.join(__dirname, 'assets/css/main.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  template = template.replace(
    '<link rel="stylesheet" href="assets/css/main.css">',
    `<style>\n${cssContent}\n</style>`
  );

  // 3. Ler e embutir os arquivos JavaScript
  const jsFiles = [
    'assets/js/models/portfolioModel.js',
    'assets/js/views/portfolioView.js',
    'assets/js/scenes/heroScene.js',
    'assets/js/scenes/skillsScene.js',
    'assets/js/controllers/portfolioController.js'
  ];

  let jsContent = '';
  jsFiles.forEach(file => {
    jsContent += `\n// --- BUNDLED FROM: ${file} ---\n`;
    jsContent += fs.readFileSync(path.join(__dirname, file), 'utf8') + '\n';
  });

  const flexibleRegex = /<script src="assets\/js\/models\/portfolioModel\.js"><\/script>[\s\S]*?<script src="assets\/js\/controllers\/portfolioController\.js"><\/script>/;
  
  template = template.replace(
    flexibleRegex,
    `<script>\n${jsContent}\n</script>`
  );

  // 4. Salvar o resultado final em index.html
  fs.writeFileSync(path.join(__dirname, 'index.html'), template, 'utf8');
  console.log("Build concluído com sucesso! index.html atualizado.");
} catch (err) {
  console.error("Erro durante o build:", err);
  process.exit(1);
}
