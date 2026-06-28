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
      const name = canvas.dataset.name;
      const iconUrl = canvas.dataset.icon;
      const languageColor = (window.Portfolio.Model.languageColors && window.Portfolio.Model.languageColors[name]) || "#42f2b7";

      initSingleSkill(canvas, iconUrl, languageColor);
    });
  }

  function loadSVGLogo(url, languageColor, onLoaded) {
    const loader = new THREE.SVGLoader();
    
    loader.load(
      url,
      function (data) {
        const paths = data.paths;
        const group = new THREE.Group();
        
        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
          
          // Filtrar retângulos e caminhos de fundo de cor sólida (geralmente preto ou cinza escuro)
          // que ocupam o SVG inteiro e bloqueiam a visibilidade da marca em 3D.
          const tagName = path.userData?.node?.tagName;
          const fill = path.userData?.node?.getAttribute("fill");
          const isBlackOrNearBlack = path.color && (
            path.color.getHexString() === "000000" || 
            path.color.getHexString() === "1a1a1a" || 
            path.color.getHexString() === "111111" ||
            path.color.getHexString() === "090a08"
          );
          if ((tagName === "rect" || tagName === "path") && isBlackOrNearBlack) {
            continue; // Ignora o fundo preto
          }
          
          // Estilo metálico e vibrante para a cor do SVG
          const material = new THREE.MeshStandardMaterial({
            color: path.color || new THREE.Color(languageColor),
            roughness: 0.15,
            metalness: 0.7,
            side: THREE.DoubleSide,
            depthWrite: true
          });
          
          const shapes = THREE.SVGLoader.createShapes(path);
          for (let j = 0; j < shapes.length; j++) {
            const shape = shapes[j];
            
            // Extrusão 3D real da marca
            const geometry = new THREE.ExtrudeGeometry(shape, {
              depth: 18,
              bevelEnabled: true,
              bevelThickness: 1.5,
              bevelSize: 0.6,
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
      },
      undefined,
      function (error) {
        console.warn("Erro ao carregar SVG. Usando fallback procedural para:", url, error);
        onLoaded(createFallbackProceduralModel(languageColor));
      }
    );
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
    let animationFrameId = null;
    let isVisible = false;
    let rotationSpeed = 0.015;
    let targetRotationSpeed = 0.015;

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
    const card = canvas.closest(".skill-card");
    if (card) {
      card.addEventListener("pointerenter", () => {
        targetRotationSpeed = 0; // Para de girar no hover
      });
      card.addEventListener("pointerleave", () => {
        targetRotationSpeed = 0.015; // Volta a girar ao tirar o mouse
      });
    }

    // Loop de renderização
    function render(time) {
      if (!isVisible) return;

      if (modelGroup) {
        rotationSpeed += (targetRotationSpeed - rotationSpeed) * 0.08;
        
        // Rotação horizontal em Y e sutil flutuação em X/Z
        modelGroup.rotation.y += rotationSpeed;
        modelGroup.rotation.x = Math.sin(time * 0.0016) * 0.12;
        modelGroup.rotation.z = Math.cos(time * 0.0012) * 0.06;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    }

    // Controle de visibilidade
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            render(performance.now());
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.SkillsScene = { init };
})();
