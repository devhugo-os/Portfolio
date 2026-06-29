const fs = require('fs');

console.log("Iniciando empacotamento do Portfólio (gerando bundle.js e bundle.css minificados)...");

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
      bundledJs += fs.readFileSync(file, 'utf8') + '\n';
      console.log(`- ${file} lido.`);
    } else {
      console.warn(`- Aviso: ${file} não encontrado.`);
    }
  }

  // Minificar o JS de forma segura (remove comentários e reduz quebras/espaços)
  let jsLines = bundledJs.split('\n');
  let minifiedJsLines = [];
  let inBlockComment = false;

  for (let line of jsLines) {
    let trimmed = line.trim();

    if (inBlockComment) {
      if (trimmed.includes('*/')) {
        inBlockComment = false;
        trimmed = trimmed.substring(trimmed.indexOf('*/') + 2).trim();
      } else {
        continue;
      }
    }

    if (trimmed.startsWith('/*')) {
      if (trimmed.includes('*/')) {
        trimmed = trimmed.substring(trimmed.indexOf('*/') + 2).trim();
      } else {
        inBlockComment = true;
        continue;
      }
    }

    // Remover comentários de linha única (que não estejam dentro de strings - heurística básica segura)
    if (trimmed.startsWith('//')) {
      continue;
    }

    if (!trimmed) {
      continue;
    }

    minifiedJsLines.push(trimmed);
  }

  // Junta o JS compactado
  const finalJs = minifiedJsLines.join('\n');
  fs.writeFileSync('bundle.js', finalJs, 'utf8');
  console.log("bundle.js compactado e gerado com sucesso.");

  // 2. Copiar/salvar e minificar o CSS
  if (fs.existsSync('assets/css/main.css')) {
    const cssContent = fs.readFileSync('assets/css/main.css', 'utf8');
    
    // Minificação básica de CSS (remove comentários e espaços em branco desnecessários)
    const minifiedCss = cssContent
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comentários
      .split('\n')
      .map(l => l.trim())
      .filter(l => l)
      .join('\n');

    fs.writeFileSync('bundle.css', minifiedCss, 'utf8');
    console.log("bundle.css compactado e gerado com sucesso.");
  } else {
    console.warn("Aviso: assets/css/main.css não encontrado.");
  }

  console.log("Empacotamento concluído com sucesso!");
} catch (e) {
  console.error("Erro durante o empacotamento:", e);
}
