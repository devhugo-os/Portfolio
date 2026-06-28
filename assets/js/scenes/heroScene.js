(function () {
  function init() {
    const canvas = document.getElementById("hero-scene");
    if (!canvas || !window.THREE) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const root = new THREE.Group();
    scene.add(root);

    const ambient = new THREE.AmbientLight(0xffffff, 0.86);
    const key = new THREE.PointLight(0x42f2b7, 1.2, 24);
    key.position.set(4, 4, 5);
    const rim = new THREE.PointLight(0xff6b57, 0.85, 18);
    rim.position.set(-5, -2, 4);
    scene.add(ambient, key, rim);

    const materials = [
      new THREE.MeshStandardMaterial({ color: 0x42f2b7, roughness: 0.42, metalness: 0.35 }),
      new THREE.MeshStandardMaterial({ color: 0xf7c948, roughness: 0.52, metalness: 0.25 }),
      new THREE.MeshStandardMaterial({ color: 0xff6b57, roughness: 0.36, metalness: 0.32 }),
      new THREE.MeshStandardMaterial({ color: 0x66d9ef, roughness: 0.38, metalness: 0.4 })
    ];

    const shapes = [
      new THREE.Mesh(new THREE.TorusKnotGeometry(0.86, 0.22, 96, 12), materials[0]),
      new THREE.Mesh(new THREE.IcosahedronGeometry(0.86, 1), materials[1]),
      new THREE.Mesh(new THREE.OctahedronGeometry(0.82, 1), materials[2]),
      new THREE.Mesh(new THREE.TorusGeometry(0.74, 0.14, 20, 84), materials[3])
    ];

    const shapePositions = [
      [3.2, 1.4, -0.7],
      [4.9, -1.4, -1.8],
      [-3.7, -1.6, -2.6],
      [-4.8, 1.5, -1.6]
    ];

    shapes.forEach((shape, index) => {
      shape.position.set(...shapePositions[index]);
      shape.rotation.set(index * 0.45, index * 0.32, index * 0.26);
      root.add(shape);
    });

    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0xf5f2e8,
      transparent: true,
      opacity: 0.16
    });

    for (let i = 0; i < 4; i += 1) {
      const curve = new THREE.EllipseCurve(0, 0, 2.2 + i * 0.7, 0.94 + i * 0.28, 0, Math.PI * 2);
      const points = curve.getPoints(120).map((point) => new THREE.Vector3(point.x, point.y, -1.2 - i * 0.35));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.LineLoop(geometry, orbitMaterial);
      line.rotation.x = Math.PI / 2.65;
      line.rotation.z = i * 0.45;
      root.add(line);
    }

    const starCount = 900;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const colorOptions = [
      new THREE.Color(0x42f2b7),
      new THREE.Color(0xf7c948),
      new THREE.Color(0xff6b57),
      new THREE.Color(0xf5f2e8)
    ];

    for (let i = 0; i < starCount; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 14;
      positions[i3 + 1] = (Math.random() - 0.5) * 9;
      positions[i3 + 2] = -Math.random() * 10;
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        size: 0.035,
        vertexColors: true,
        transparent: true,
        opacity: 0.72
      })
    );
    root.add(stars);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function onPointerMove(event) {
      target.x = (event.clientX / window.innerWidth - 0.5) * 2;
      target.y = (event.clientY / window.innerHeight - 0.5) * 2;
    }

    function animate(time) {
      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;

      root.rotation.y = pointer.x * 0.18;
      root.rotation.x = -pointer.y * 0.12;
      stars.rotation.z = time * 0.00003;

      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.003 + index * 0.0008;
        shape.rotation.y += 0.004 + index * 0.0006;
        shape.position.y += Math.sin(time * 0.0012 + index) * 0.0009;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    requestAnimationFrame(animate);
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.HeroScene = { init };
})();
