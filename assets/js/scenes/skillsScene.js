(function () {
  function init() {
    if (!window.THREE) {
      console.warn("Three.js não está carregado. Não foi possível inicializar skills 3D.");
      return;
    }

    const canvases = document.querySelectorAll(".skill-3d-canvas");
    const Model = window.Portfolio.Model;

    canvases.forEach((canvas) => {
      const name = canvas.dataset.name;
      const iconUrl = canvas.dataset.icon;
      const languageColor = (Model.languageColors && Model.languageColors[name]) || "#42f2b7";

      initSingleSkill(canvas, iconUrl, languageColor);
    });
  }

  function initSingleSkill(canvas, iconUrl, languageColor) {
    let renderer, scene, camera, mesh;
    let animationFrameId = null;
    let isVisible = false;
    let rotationSpeed = 0.015;
    let targetRotationSpeed = 0.015;

    // Configuração de cena
    scene = new THREE.Scene();

    // Câmera
    camera = new THREE.PerspectiveCamera(48, 1, 0.1, 10);
    camera.position.z = 2.4;

    // Renderer com fundo transparente
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(68, 68, false);
    } catch (e) {
      console.warn("WebGL não disponível para a skill:", canvas.dataset.name, e);
      fallbackToImage(canvas, iconUrl);
      return;
    }

    // Carregar textura
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      iconUrl,
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        // Materiais: 0 = Lado, 1 = Frente (Top), 2 = Verso (Bottom)
        const sideMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(languageColor),
          metalness: 0.85,
          roughness: 0.15,
          flatShading: true
        });

        const faceMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          roughness: 0.25,
          metalness: 0.2,
          alphaTest: 0.05
        });

        // CylinderGeometry(raioSuperior, raioInferior, altura, segmentos)
        const geometry = new THREE.CylinderGeometry(0.8, 0.8, 0.15, 32);
        const materials = [sideMaterial, faceMaterial, faceMaterial];

        mesh = new THREE.Mesh(geometry, materials);
        mesh.rotation.x = Math.PI / 2; // deitar o cilindro para ficar de frente
        scene.add(mesh);

        // Luzes
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.75);
        dirLight.position.set(1.5, 1.5, 2);
        scene.add(ambientLight, dirLight);

        // Hover effect nas cartas de skill
        const card = canvas.closest(".skill-card");
        if (card) {
          card.addEventListener("pointerenter", () => {
            targetRotationSpeed = 0.065;
          });
          card.addEventListener("pointerleave", () => {
            targetRotationSpeed = 0.015;
          });
        }

        // Loop de renderização
        function render(time) {
          if (!isVisible) return;

          rotationSpeed += (targetRotationSpeed - rotationSpeed) * 0.08;
          mesh.rotation.y += rotationSpeed; // girar a moeda no eixo Y local

          // Adicionar oscilação sutil
          mesh.rotation.x = Math.PI / 2 + Math.sin(time * 0.0016) * 0.12;

          renderer.render(scene, camera);
          animationFrameId = requestAnimationFrame(render);
        }

        // Inicia/Pausa baseado na visibilidade (IntersectionObserver)
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
      },
      undefined,
      (err) => {
        console.error("Erro ao carregar textura para a skill 3D:", iconUrl, err);
        fallbackToImage(canvas, iconUrl);
      }
    );
  }

  function fallbackToImage(canvas, iconUrl) {
    const parent = canvas.parentElement;
    if (!parent) return;
    const img = document.createElement("img");
    img.src = iconUrl;
    img.alt = canvas.dataset.name || "Logo";
    img.loading = "lazy";
    canvas.replaceWith(img);
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.SkillsScene = { init };
})();
