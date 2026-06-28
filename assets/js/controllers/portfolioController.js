(function () {
  const { Model, View, HeroScene, SkillsScene, OrbitRunner, MemoryStack } = window.Portfolio;

  const state = {
    repositories: [],
    activeLanguage: "Todos",
    searchTerm: ""
  };

  function init() {
    View.renderSkills(Model.skills);
    View.renderFeatured(Model.featuredExperiences, "featured-grid");
    View.renderFeatured(Model.featuredExperiences, "spotlight-grid");

    setCurrentYear();
    updateAge();
    initNavigation();
    initCursor();
    initTilt();
    initMagneticLinks();
    initRepositories();

    HeroScene.init();
    if (SkillsScene) {
      SkillsScene.init();
    }
    OrbitRunner.init();
    MemoryStack.init(Model.skills);
  }

  function setCurrentYear() {
    const year = View.byId("current-year");
    if (year) {
      year.textContent = new Date().getFullYear().toString();
    }
  }

  const pageOrder = ["inicio", "sobre", "skills", "experiencias", "projetos", "playground", "contato"];
  let activeIndex = 0;
  let lastTransitionTime = 0;

  function navigatePage(targetIndex) {
    if (targetIndex < 0 || targetIndex >= pageOrder.length) return;
    const currentId = pageOrder[activeIndex];
    const targetId = pageOrder[targetIndex];
    if (currentId === targetId) return;

    const currentPage = document.getElementById(currentId);
    const targetPage = document.getElementById(targetId);
    if (!currentPage || !targetPage) return;

    const isMovingForward = targetIndex > activeIndex;

    // Reseta classes de transição de todos os outros painéis para evitar bugs visuais
    pageOrder.forEach((id) => {
      const page = document.getElementById(id);
      if (page && id !== currentId && id !== targetId) {
        page.className = page.className
          .replace(/\b(slide-left|slide-right|active-page)\b/g, "")
          .trim();
      }
    });

    if (isMovingForward) {
      targetPage.classList.remove("slide-left", "slide-right", "active-page");
      targetPage.classList.add("slide-right");
      
      // Força reflow do elemento
      targetPage.offsetHeight;

      currentPage.classList.add("slide-left");
      currentPage.classList.remove("active-page");

      targetPage.classList.remove("slide-right");
      targetPage.classList.add("active-page");
    } else {
      targetPage.classList.remove("slide-left", "slide-right", "active-page");
      targetPage.classList.add("slide-left");

      // Força reflow do elemento
      targetPage.offsetHeight;

      currentPage.classList.add("slide-right");
      currentPage.classList.remove("active-page");

      targetPage.classList.remove("slide-left");
      targetPage.classList.add("active-page");
    }

    activeIndex = targetIndex;
    lastTransitionTime = Date.now();

    // Atualiza links da navbar
    const links = document.querySelectorAll(".navbar .nav-link");
    links.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${targetId}`);
    });

    // Atualiza hash na barra de endereços silenciosamente
    history.pushState(null, null, `#${targetId}`);
  }

  function initNavigation() {
    const menu = document.getElementById("mainMenu");
    const links = Array.from(document.querySelectorAll(".navbar .nav-link[href^='#']"));
    const collapse = menu && window.bootstrap ? new bootstrap.Collapse(menu, { toggle: false }) : null;

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetIdx = pageOrder.indexOf(targetId);
        if (targetIdx !== -1) {
          navigatePage(targetIdx);
        }
        if (collapse && menu.classList.contains("show")) {
          collapse.hide();
        }
      });
    });

    // Detecta hash inicial da URL
    const hash = window.location.hash.substring(1);
    const initialIndex = pageOrder.indexOf(hash);
    if (initialIndex !== -1) {
      activeIndex = initialIndex;
      pageOrder.forEach((id, idx) => {
        const page = document.getElementById(id);
        if (page) {
          page.classList.remove("active-page", "slide-left", "slide-right");
          if (idx === initialIndex) {
            page.classList.add("active-page");
          } else if (idx < initialIndex) {
            page.classList.add("slide-left");
          } else {
            page.classList.add("slide-right");
          }
        }
      });
    }

    // Navegação por scroll (wheel) inteligente
    window.addEventListener("wheel", (e) => {
      const activePageEl = document.getElementById(pageOrder[activeIndex]);
      if (activePageEl && activePageEl.scrollHeight > activePageEl.clientHeight) {
        const atTop = activePageEl.scrollTop === 0;
        const atBottom = Math.abs(activePageEl.scrollHeight - activePageEl.clientHeight - activePageEl.scrollTop) < 2;
        if (e.deltaY < 0 && !atTop) return;
        if (e.deltaY > 0 && !atBottom) return;
      }

      const now = Date.now();
      if (now - lastTransitionTime < 900) return;
      if (Math.abs(e.deltaY) < 35) return;

      if (e.deltaY > 0) {
        navigatePage(activeIndex + 1);
      } else {
        navigatePage(activeIndex - 1);
      }
    }, { passive: true });

    // Navegação por swipe touch
    let touchStartY = 0;
    let touchStartX = 0;
    window.addEventListener("touchstart", (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
      const activePageEl = document.getElementById(pageOrder[activeIndex]);
      const now = Date.now();
      if (now - lastTransitionTime < 900) return;

      const diffY = e.changedTouches[0].clientY - touchStartY;
      const diffX = e.changedTouches[0].clientX - touchStartX;

      if (Math.abs(diffY) > 75 && Math.abs(diffY) > Math.abs(diffX)) {
        if (activePageEl && activePageEl.scrollHeight > activePageEl.clientHeight) {
          const atTop = activePageEl.scrollTop === 0;
          const atBottom = Math.abs(activePageEl.scrollHeight - activePageEl.clientHeight - activePageEl.scrollTop) < 2;
          if (diffY > 0 && !atTop) return;
          if (diffY < 0 && !atBottom) return;
        }

        if (diffY < 0) {
          navigatePage(activeIndex + 1);
        } else {
          navigatePage(activeIndex - 1);
        }
      }
    }, { passive: true });

    // Suporte ao botão voltar/avançar do navegador
    window.addEventListener("popstate", () => {
      const hash = window.location.hash.substring(1) || "inicio";
      const targetIdx = pageOrder.indexOf(hash);
      if (targetIdx !== -1 && targetIdx !== activeIndex) {
        navigatePage(targetIdx);
      }
    });
  }

  function initCursor() {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const core = document.querySelector(".cursor-core");
    const ring = document.querySelector(".cursor-ring");

    if (!finePointer || reducedMotion || !core || !ring) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: target.x, y: target.y };

    document.addEventListener("pointermove", (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      document.body.classList.add("cursor-ready");
    }, { passive: true });

    document.addEventListener("pointerover", (event) => {
      if (event.target.closest("a, button, input, textarea, .memory-card, .skill-card")) {
        document.body.classList.add("cursor-active");
      }
    });

    document.addEventListener("pointerout", (event) => {
      if (event.target.closest("a, button, input, textarea, .memory-card, .skill-card")) {
        document.body.classList.remove("cursor-active");
      }
    });

    function animate() {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      core.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    }

    animate();
  }

  function initTilt() {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return;

    document.querySelectorAll("[data-tilt]").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.transform = `rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg)`;
      });

      element.addEventListener("pointerleave", () => {
        element.style.transform = "";
      });
    });
  }

  function initMagneticLinks() {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return;

    document.querySelectorAll(".magnetic-link").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        element.style.transform = `translate(${x * 0.12}px, ${y * 0.16}px)`;
      });

      element.addEventListener("pointerleave", () => {
        element.style.transform = "";
      });
    });
  }

  function initRepositories() {
    const search = View.byId("repo-search");
    const filters = View.byId("repo-filters");
    const refresh = View.byId("repo-refresh");

    if (search) {
      search.addEventListener("input", (event) => {
        state.searchTerm = event.target.value.trim().toLowerCase();
        renderRepositoryState();
      });
    }

    if (filters) {
      filters.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-language]");
        if (!button) return;
        state.activeLanguage = button.dataset.language;
        renderRepositoryState();
      });
    }

    if (refresh) {
      refresh.addEventListener("click", loadRepositories);
    }

    loadRepositories();
  }

  async function loadRepositories() {
    View.renderRepoSkeleton();
    View.setRepositoryStatus("Carregando repositórios do GitHub...", false);

    try {
      state.repositories = await Model.fetchRepositories();
      state.activeLanguage = "Todos";
      renderRepositoryState();
    } catch (error) {
      state.repositories = [];
      View.renderRepositoryFilters([], "Todos");
      View.renderRepositories([]);
      View.setRepositoryStatus("Não foi possível carregar os repositórios agora. Tente atualizar em alguns segundos.", true);
      console.error(error);
    }
  }

  function renderRepositoryState() {
    const languages = Array.from(new Set(state.repositories.map((repo) => repo.language))).sort();
    const filtered = state.repositories.filter((repo) => {
      const matchesLanguage = state.activeLanguage === "Todos" || repo.language === state.activeLanguage;
      const searchable = `${repo.name} ${repo.description} ${repo.language} ${repo.topics.join(" ")}`.toLowerCase();
      return matchesLanguage && searchable.includes(state.searchTerm);
    });

    View.renderRepositoryFilters(languages, state.activeLanguage);
    View.renderRepositories(filtered);
    View.setRepositoryStatus(`Mostrando ${filtered.length} de ${state.repositories.length} repositórios públicos de @${Model.githubUser}.`, false);
  }

  function updateAge() {
    const ageSpan = document.getElementById("dynamic-age");
    if (!ageSpan) return;
    
    const birthDate = new Date("2009-03-11");
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    ageSpan.textContent = String(age);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
