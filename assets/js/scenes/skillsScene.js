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
      const languageColor = (Model.languageColors && Model.languageColors[name]) || "#42f2b7";

      initSingleSkill(canvas, name, languageColor);
    });
  }

  function createProceduralModel(name, languageColor) {
    const group = new THREE.Group();
    const lowerName = name.toLowerCase();

    // Materiais padrão
    const primaryMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(languageColor),
      metalness: 0.7,
      roughness: 0.2
    });

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.5,
      roughness: 0.3
    });

    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.1
    });

    // 1. JAVA: Xícara de Café 3D
    if (lowerName.includes("java") && !lowerName.includes("script")) {
      const cupColor = 0xff5533;
      const cupMat = new THREE.MeshStandardMaterial({ color: cupColor, metalness: 0.5, roughness: 0.2 });
      
      // Corpo da xícara
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.38, 0.6, 16), cupMat);
      cup.position.y = 0.1;
      group.add(cup);

      // Asa da xícara
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 8, 16, Math.PI), cupMat);
      handle.position.set(0.4, 0.1, 0);
      handle.rotation.z = -Math.PI / 2;
      group.add(handle);

      // Pires
      const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.05, 16), cupMat);
      saucer.position.y = -0.22;
      group.add(saucer);

      // Café (líquido escuro)
      const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.04, 12), new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.1 }));
      liquid.position.y = 0.38;
      group.add(liquid);
    }
    // 2. PYTHON: Duas Cobras Entrelaçadas 3D (Loops azul e amarelo)
    else if (lowerName.includes("python")) {
      const blueMat = new THREE.MeshStandardMaterial({ color: 0x3776ab, metalness: 0.7, roughness: 0.2 });
      const yellowMat = new THREE.MeshStandardMaterial({ color: 0xf7c948, metalness: 0.7, roughness: 0.2 });

      // Cobra azul (loop superior)
      const loopBlue = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.09, 8, 24, Math.PI * 1.4), blueMat);
      loopBlue.position.set(-0.12, 0.12, 0);
      loopBlue.rotation.z = Math.PI * 0.15;
      group.add(loopBlue);

      // Cobra amarela (loop inferior)
      const loopYellow = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.09, 8, 24, Math.PI * 1.4), yellowMat);
      loopYellow.position.set(0.12, -0.12, 0);
      loopYellow.rotation.z = Math.PI * 1.15;
      group.add(loopYellow);

      // Pequenas esferas para representar as cabeças
      const eyeBlue = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), blueMat);
      eyeBlue.position.set(-0.35, 0.35, 0.08);
      const eyeYellow = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), yellowMat);
      eyeYellow.position.set(0.35, -0.35, 0.08);
      group.add(eyeBlue, eyeYellow);
    }
    // 3. C++ / CPP: Letra C com Símbolos Mais Flutuantes
    else if (lowerName.includes("c++") || lowerName.includes("cpp")) {
      const cMat = new THREE.MeshStandardMaterial({ color: 0x00599c, metalness: 0.85, roughness: 0.15 });
      const plusMat = new THREE.MeshStandardMaterial({ color: 0x66d9ef, metalness: 0.7, roughness: 0.2 });

      // O "C"
      const cMesh = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.13, 8, 24, Math.PI * 1.4), cMat);
      cMesh.rotation.z = Math.PI * 0.3;
      cMesh.position.x = -0.18;
      group.add(cMesh);

      // Plus Sign 1
      const plus1 = new THREE.Group();
      plus1.add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.05), plusMat));
      plus1.add(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.05), plusMat));
      plus1.position.set(0.22, 0.15, 0);
      group.add(plus1);

      // Plus Sign 2
      const plus2 = plus1.clone();
      plus2.position.set(0.42, -0.05, 0);
      group.add(plus2);
    }
    // 4. C: Letra C Extrudada 3D Metálica
    else if (lowerName === "c") {
      const cMat = new THREE.MeshStandardMaterial({ color: 0xa8b9cc, metalness: 0.9, roughness: 0.1 });
      const cMesh = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.15, 8, 24, Math.PI * 1.4), cMat);
      cMesh.rotation.z = Math.PI * 0.3;
      group.add(cMesh);
    }
    // 5. JAVASCRIPT: Cubo 3D com Faixa Escura
    else if (lowerName.includes("javascript") || lowerName.includes("js")) {
      const jsMat = new THREE.MeshStandardMaterial({ color: 0xf7df1e, metalness: 0.4, roughness: 0.3 });
      
      // O Cubo
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.65), jsMat);
      group.add(cube);

      // Faixa escura diagonal/central
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.18, 0.68), darkMat);
      group.add(strip);
    }
    // 6. HTML5: Escudo 3D Laranja
    else if (lowerName.includes("html")) {
      const htmlMat = new THREE.MeshStandardMaterial({ color: 0xe34f26, metalness: 0.6, roughness: 0.2 });
      
      // Parte superior do escudo
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.12), htmlMat);
      body.position.y = 0.12;
      group.add(body);

      // Bico inferior do escudo (Cone cortado ou rotacionado)
      const bottom = new THREE.Mesh(new THREE.ConeGeometry(0.275, 0.32, 4), htmlMat);
      bottom.rotation.y = Math.PI / 4;
      bottom.rotation.x = Math.PI;
      bottom.position.y = -0.28;
      group.add(bottom);
    }
    // 7. CSS3: Escudo 3D Azul
    else if (lowerName.includes("css")) {
      const cssMat = new THREE.MeshStandardMaterial({ color: 0x1572b6, metalness: 0.6, roughness: 0.2 });
      
      // Parte superior do escudo
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.12), cssMat);
      body.position.y = 0.12;
      group.add(body);

      // Bico inferior do escudo
      const bottom = new THREE.Mesh(new THREE.ConeGeometry(0.275, 0.32, 4), cssMat);
      bottom.rotation.y = Math.PI / 4;
      bottom.rotation.x = Math.PI;
      bottom.position.y = -0.28;
      group.add(bottom);
    }
    // 8. GAMEMAKER: Prisma Facetado Vermelho 3D
    else if (lowerName.includes("gamemaker") || lowerName.includes("game maker")) {
      const gmMat = new THREE.MeshStandardMaterial({ color: 0xff3b30, metalness: 0.7, roughness: 0.2, flatShading: true });
      const crystal = new THREE.Mesh(new THREE.IcosahedronGeometry(0.52, 0), gmMat);
      group.add(crystal);
    }
    // 9. GODOT: Robô Mascote Godot 3D
    else if (lowerName.includes("godot")) {
      const godotMat = new THREE.MeshStandardMaterial({ color: 0x478cbf, metalness: 0.5, roughness: 0.3 });
      
      // Cabeça
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 12), godotMat);
      head.scale.y = 0.8;
      group.add(head);

      // Olhos
      const eyeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 12);
      for (let i = 0; i < 2; i++) {
        const eye = new THREE.Mesh(eyeGeo, whiteMat);
        eye.rotation.x = Math.PI / 2;
        eye.position.set(-0.15 + i * 0.3, 0.02, 0.32);
        
        const pupil = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.09, 12), darkMat);
        pupil.rotation.x = Math.PI / 2;
        pupil.position.set(-0.15 + i * 0.3, 0.02, 0.34);
        
        group.add(eye, pupil);
      }

      // Antenas
      const antennaGeo = new THREE.BoxGeometry(0.05, 0.16, 0.05);
      for (let i = 0; i < 2; i++) {
        const antenna = new THREE.Mesh(antennaGeo, godotMat);
        antenna.position.set(-0.25 + i * 0.5, 0.34, 0);
        antenna.rotation.z = -0.4 + i * 0.8;
        group.add(antenna);
      }
    }
    // 10. NODE.JS: Estrutura de Nós de Rede Green 3D
    else if (lowerName.includes("node")) {
      const nodeMat = new THREE.MeshStandardMaterial({ color: 0x339933, metalness: 0.6, roughness: 0.2 });
      
      // Nó central
      const centerNode = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), nodeMat);
      group.add(centerNode);

      // Nós satélites e conectores
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3;
        const x = Math.cos(angle) * 0.42;
        const y = Math.sin(angle) * 0.42;

        const satellite = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), nodeMat);
        satellite.position.set(x, y, 0);
        group.add(satellite);

        // Haste conector
        const path = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, 0));
        const connection = new THREE.Mesh(new THREE.TubeGeometry(path, 1, 0.03, 6, false), nodeMat);
        group.add(connection);
      }
    }
    // 11. MYSQL: Cilindros Metálicos de Banco de Dados 3D
    else if (lowerName.includes("mysql") || lowerName.includes("sql")) {
      const dbMat = new THREE.MeshStandardMaterial({ color: 0x00758f, metalness: 0.8, roughness: 0.2 });
      
      for (let i = 0; i < 3; i++) {
        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.16, 16), dbMat);
        cylinder.position.y = 0.22 - i * 0.22;
        group.add(cylinder);
      }
    }
    // 12. NETBEANS: Cubos Interligados (Azul e Coral)
    else if (lowerName.includes("netbeans")) {
      const netBlue = new THREE.MeshStandardMaterial({ color: 0x1b6eb0, metalness: 0.6, roughness: 0.2 });
      const netCoral = new THREE.MeshStandardMaterial({ color: 0xff6b57, metalness: 0.5, roughness: 0.2 });

      const box1 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), netBlue);
      box1.position.set(-0.12, 0.12, 0.05);
      group.add(box1);

      const box2 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.32), netCoral);
      box2.position.set(0.12, -0.12, -0.05);
      group.add(box2);
    }
    // 13. VS CODE: Fita de Infinito 3D (Torus cruzados)
    else if (lowerName.includes("code") || lowerName.includes("vs")) {
      const codeMat = new THREE.MeshStandardMaterial({ color: 0x007acc, metalness: 0.75, roughness: 0.25 });
      
      const torus1 = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.06, 8, 20), codeMat);
      torus1.position.x = -0.14;
      torus1.rotation.y = Math.PI / 4;
      group.add(torus1);

      const torus2 = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.06, 8, 20), codeMat);
      torus2.position.x = 0.14;
      torus2.rotation.y = -Math.PI / 4;
      group.add(torus2);
    }
    // FALLBACK: Qualquer outro símbolo
    else {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), primaryMat);
      group.add(mesh);
    }

    return group;
  }

  function initSingleSkill(canvas, name, languageColor) {
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
      renderer.setSize(50, 50, false); // Tamanho reduzido para layout compacto
    } catch (e) {
      console.warn("WebGL não disponível para a skill:", name, e);
      return;
    }

    // Criar o modelo procedural 3D correspondente
    modelGroup = createProceduralModel(name, languageColor);
    scene.add(modelGroup);

    // Iluminação
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight.position.set(1.5, 2, 2.5);
    
    // Luz de ponto colorida para dar glow
    const glowLight = new THREE.PointLight(new THREE.Color(languageColor), 0.7, 4);
    glowLight.position.set(-1, -1.5, 1);

    scene.add(ambientLight, dirLight, glowLight);

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
      
      // Rotação em Y e sutil em X para o modelo
      modelGroup.rotation.y += rotationSpeed;
      modelGroup.rotation.x = Math.sin(time * 0.0016) * 0.12;
      modelGroup.rotation.z = Math.cos(time * 0.0012) * 0.06;

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
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.SkillsScene = { init };
})();
