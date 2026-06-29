const fs = require('fs');

console.log("Iniciando empacotamento do Portfólio (gerando bundle.js e bundle.css)...");

try {
  // 1. Concatenar todos os arquivos JS em ordem
  const jsFiles = [
    'assets/js/router.js',
    'assets/js/models/portfolioModel.js',
    'assets/js/views/portfolioView.js',
    'assets/js/scenes/heroScene.js',
    'assets/js/scenes/skillsScene.js',
    'assets/js/controllers/portfolioController.js'
  ];

  let bundledJs = '';
  for (const file of jsFiles) {
    if (fs.existsSync(file)) {
      bundledJs += `\n/* === BUNDLED FILE: ${file} === */\n`;
      bundledJs += fs.readFileSync(file, 'utf8') + '\n';
      console.log(`- ${file} empacotado.`);
    } else {
      console.warn(`- Aviso: ${file} não encontrado.`);
    }
  }

  fs.writeFileSync('bundle.js', bundledJs, 'utf8');
  console.log("bundle.js gerado com sucesso na raiz do projeto.");

  // 2. Copiar/salvar o CSS
  if (fs.existsSync('assets/css/main.css')) {
    const cssContent = fs.readFileSync('assets/css/main.css', 'utf8');
    fs.writeFileSync('bundle.css', cssContent, 'utf8');
    console.log("bundle.css gerado com sucesso na raiz do projeto.");
  } else {
    console.warn("Aviso: assets/css/main.css não encontrado.");
  }

  console.log("Empacotamento concluído com sucesso!");
} catch (e) {
  console.error("Erro durante o empacotamento:", e);
}
