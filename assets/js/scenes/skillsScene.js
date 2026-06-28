(function () {
  function init() {
    if (!window.THREE) {
      console.warn("Three.js não está carregado. Não foi possível inicializar skills 3D.");
      return;
    }

    if (!THREE.SVGLoader) {
      console.warn("SVGLoader do Three.js não está carregado. Importe o SVGLoader.js no index.html.");
      return;
    }

    const canvases = document.querySelectorAll(".skill-3d-canvas");
    canvases.forEach((canvas) => {
      if (canvas.dataset.initialized) return; // Evita dupla inicialização
      canvas.dataset.initialized = "true";

      const name = canvas.dataset.name;
      const iconUrl = canvas.dataset.icon;
      
      // Normalização inteligente de cores para chaves com versões (ex: Python 3.13, HTML5)
      let colorKey = name;
      if (name.startsWith("C++")) colorKey = "C++";
      else if (name.startsWith("C")) colorKey = "C";
      else if (name.startsWith("Python")) colorKey = "Python";
      else if (name.startsWith("HTML")) colorKey = "HTML";
      else if (name.startsWith("CSS")) colorKey = "CSS";
      else if (name.startsWith("Node")) colorKey = "Node";

      const languageColor = (window.Portfolio.Model.languageColors && window.Portfolio.Model.languageColors[colorKey]) || "#42f2b7";

      initSingleSkill(canvas, iconUrl, languageColor);
    });
  }

  function loadSVGLogo(url, languageColor, onLoaded) {
    // Buscar o arquivo SVG de forma textual para remover tags <style> antes do parseamento.
    // Isso evita problemas com classes CSS em SVGs do Devicons que quebram o visual no SVGLoader.
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error("Erro na resposta HTTP: " + response.status);
        return response.text();
      })
      .then(text => {
        // Remove blocos de <style>...</style> inteiros e classes
        const cleanText = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
        
        const loader = new THREE.SVGLoader();
        const data = loader.parse(cleanText);
        const paths = data.paths;
        const group = new THREE.Group();
        
        // Determinar o viewBox do SVG para escalar dinamicamente as proporções de extrusão e bevel
        const xml = data.xml;
        const viewBox = xml?.getAttribute("viewBox");
        let viewBoxWidth = 512;
        if (viewBox) {
          const parts = viewBox.split(" ").map(Number);
          if (parts.length === 4) {
            viewBoxWidth = parts[2] || 512;
          }
        }
        const scaleRatio = viewBoxWidth / 512;
        
        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
          
          // Filtrar apenas retângulos e polígonos escuros/pretos que funcionam como plano de fundo
          // do SVG original (não removemos tags 'path' para evitar sumir com logos de cor padrão)
          const tagName = path.userData?.node?.tagName;
          const fill = path.userData?.node?.getAttribute("fill");
          const isDarkBackground = (tagName === "rect" || tagName === "polygon") && (
            fill === "#000" || fill === "#000000" || fill === "#1a1a1a" || fill === "#111111" || fill === "#090a08"
          );
          if (isDarkBackground) {
            continue; // Ignora apenas o fundo escuro
          }
          
          // Se o preenchimento for preto/escuro padrão do Simple Icons, usamos a cor do tema da skill.
          // Se for o Python, aplicamos azul na cobra superior, amarelo na inferior e branco nos olhos
          let finalColor;
          if (url.includes("python")) {
            if (i === 0) finalColor = new THREE.Color("#3776AB"); // Azul oficial
            else if (i === 1) finalColor = new THREE.Color("#FFD343"); // Amarelo oficial
            else finalColor = new THREE.Color("#FFFFFF");
          } else {
            const isDefaultBlack = path.color && path.color.getHexString() === "000000";
            finalColor = path.color && !isDefaultBlack ? path.color : new THREE.Color(languageColor);
          }
          
          // Estilo metálico e vibrante para a cor do SVG
          const material = new THREE.MeshStandardMaterial({
            color: finalColor,
            roughness: 0.15,
            metalness: 0.7,
            side: THREE.DoubleSide,
            depthWrite: true
          });
          
          const shapes = THREE.SVGLoader.createShapes(path);
          for (let j = 0; j < shapes.length; j++) {
            const shape = shapes[j];
            
            // Extrusão 3D real da marca escalada proporcionalmente ao viewBox
            const geometry = new THREE.ExtrudeGeometry(shape, {
              depth: 18 * scaleRatio,
              bevelEnabled: true,
              bevelThickness: 1.5 * scaleRatio,
              bevelSize: 0.6 * scaleRatio,
              bevelSegments: 2
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);
          }
        }
        
        // Centraliza a logo deslocando o grupo interno por -center
        const box = new THREE.Box3().setFromObject(group);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 0.95 / maxDim;
        
        // Coloca o centro geométrico exatamente na origem (0, 0, 0)
        group.position.set(-center.x, -center.y, -center.z);
        
        // Cria o grupo pivô intermediário para rotação centrada perfeita
        const pivot = new THREE.Group();
        pivot.add(group);
        
        // Escala e inverte o eixo Y do SVG no pivô
        pivot.scale.set(scale, -scale, scale);
        
        onLoaded(pivot);
      })
      .catch(error => {
        console.warn("Erro ao buscar e parsear SVG. Usando fallback procedural para:", url, error);
        onLoaded(createFallbackProceduralModel(languageColor));
      });
  }

  function createFallbackProceduralModel(languageColor) {
    const group = new THREE.Group();
    const geom = new THREE.TorusKnotGeometry(0.3, 0.08, 48, 8);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(languageColor),
      metalness: 0.8,
      roughness: 0.15
    });
    const mesh = new THREE.Mesh(geom, mat);
    group.add(mesh);
    return group;
  }

  function initSingleSkill(canvas, iconUrl, languageColor) {
    let renderer, scene, camera, modelGroup;
    let rotationSpeed = 0.015;
    let targetRotationSpeed = 0.015;
    let isHovered = false;
    let hoverTargetY = 0;

    // Injeta a cor correspondente no CSS do card para efeitos de brilho neon
    const card = canvas.closest(".skill-card");
    if (card) {
      card.style.setProperty("--skill-color", languageColor);
    }

    // Configuração de cena
    scene = new THREE.Scene();

    // Câmera
    camera = new THREE.PerspectiveCamera(46, 1, 0.1, 10);
    camera.position.z = 2.2;

    // Renderer com fundo transparente
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(50, 50, false);
    } catch (e) {
      console.warn("WebGL não disponível para a skill:", iconUrl, e);
      return;
    }

    // Carregar a logo SVG oficial em 3D Real
    loadSVGLogo(iconUrl, languageColor, (loadedGroup) => {
      modelGroup = loadedGroup;
      scene.add(modelGroup);
    });

    // Iluminação
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
    dirLight.position.set(1.5, 2, 2.5);
    
    const glowLight = new THREE.PointLight(new THREE.Color(languageColor), 0.75, 5);
    glowLight.position.set(-1, -1.5, 1);

    scene.add(ambientLight, dirLight, glowLight);

    // Efeito hover na carta da skill
    if (card) {
      card.addEventListener("pointerenter", () => {
        isHovered = true;
        if (modelGroup) {
          // Encontra a rotação frontal mais próxima (múltiplo de 2 * Math.PI)
          hoverTargetY = Math.round(modelGroup.rotation.y / (Math.PI * 2)) * (Math.PI * 2);
        }
      });
      card.addEventListener("pointerleave", () => {
        isHovered = false;
      });
    }

    // Loop de renderização contínuo e ininterrupto (sem piscar!)
    function render(time) {
      if (modelGroup) {
        if (isHovered) {
          // Quando mouse em cima, suaviza até ficar 100% de frente e centralizado
          modelGroup.rotation.y += (hoverTargetY - modelGroup.rotation.y) * 0.15;
          modelGroup.rotation.x += (0 - modelGroup.rotation.x) * 0.15;
          modelGroup.rotation.z += (0 - modelGroup.rotation.z) * 0.15;
        } else {
          // Rotação normal e flutuação sutil
          rotationSpeed += (targetRotationSpeed - rotationSpeed) * 0.08;
          modelGroup.rotation.y += rotationSpeed;
          modelGroup.rotation.x = Math.sin(time * 0.0016) * 0.12;
          modelGroup.rotation.z = Math.cos(time * 0.0012) * 0.06;
        }
      }

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    // Inicia o render loop imediatamente
    requestAnimationFrame(render);
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.SkillsScene = { init };
})();
