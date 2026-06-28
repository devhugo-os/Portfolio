(function () {
  const { Model, View, HeroScene, OrbitRunner, MemoryStack } = window.Portfolio;

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
    initNavigation();
    initCursor();
    initTilt();
    initMagneticLinks();
    initRepositories();

    HeroScene.init();
    OrbitRunner.init();
    MemoryStack.init(Model.skills);
  }

  function setCurrentYear() {
    const year = View.byId("current-year");
    if (year) {
      year.textContent = new Date().getFullYear().toString();
    }
  }

  function initNavigation() {
    const menu = document.getElementById("mainMenu");
    const links = Array.from(document.querySelectorAll(".navbar .nav-link[href^='#']"));
    const collapse = menu && window.bootstrap ? new bootstrap.Collapse(menu, { toggle: false }) : null;

    links.forEach((link) => {
      link.addEventListener("click", () => {
        if (collapse && menu.classList.contains("show")) {
          collapse.hide();
        }
      });
    });

    const sectionMap = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    }, {
      rootMargin: "-35% 0px -55% 0px",
      threshold: [0.05, 0.2, 0.4, 0.7]
    });

    sectionMap.forEach((section) => observer.observe(section));
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

  document.addEventListener("DOMContentLoaded", init);
})();
