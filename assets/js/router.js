(function () {
  // Correção de rota do GitHub Pages para garantir que os arquivos relativos carreguem do subdiretório correto
  if (window.location.hostname.includes("github.io")) {
    const pathParts = window.location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart === 'Portfolio' || lastPart === 'portfolio') {
      const newPath = window.location.pathname + '/';
      window.location.replace(window.location.origin + newPath + window.location.search + window.location.hash);
    }
  }
})();
