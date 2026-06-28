(function () {
  const { Model, View, HeroScene, SkillsScene } = window.Portfolio;

  const state = {
    repositories: [],
    activeLanguage: "Todos",
    searchTerm: ""
  };

  function init() {
    View.renderSkills(Model.skills);
    View.renderFeatured(Model.featuredExperiences, "spotlight-grid");

    setCurrentYear();
    updateAge();
    initNavigation();
    initCursor();
    initTilt();
    initMagneticLinks();
    initRepositories();
    initContactForm();

    HeroScene.init();
    if (SkillsScene) {
      SkillsScene.init();
    }

    // Auto-fullscreen no primeiro clique do usuário
    document.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    }, { once: true });

    // Prevenir arrasto de imagem fantasma nativo do navegador
    window.addEventListener("dragstart", (e) => e.preventDefault());
  }

  function setCurrentYear() {
    const year = View.byId("current-year");
    if (year) {
      year.textContent = new Date().getFullYear().toString();
    }
  }

  const pageOrder = ["inicio", "sobre", "skills", "projetos", "contato"];
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

    // Navegação por arrasto horizontal interativo (PointerEvents - suporta Mouse e Toque)
    let isDragReady = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragProgress = 0;
    
    // Detecção das bordas da tela para chevrons
    const edgeThreshold = 100;
    let nearLeftEdge = false;
    let nearRightEdge = false;

    // Helper para limpar estilos inline de todas as páginas
    function clearDragStyles() {
      pageOrder.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.style.transform = "";
          el.style.opacity = "";
          el.style.transition = "";
          el.style.visibility = "";
        }
      });
    }

    window.addEventListener("pointerdown", (e) => {
      // Ignorar se clicar em elementos interativos
      if (e.target.closest("a, button, input, textarea, select, canvas, .skill-card, .repo-card, .featured-card")) return;
      
      const now = Date.now();
      if (now - lastTransitionTime < 900) return;

      isDragReady = true;
      isDragging = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragProgress = 0;
    });

    window.addEventListener("pointermove", (e) => {
      const width = window.innerWidth;
      nearLeftEdge = e.clientX < edgeThreshold && activeIndex > 0;
      nearRightEdge = e.clientX > (width - edgeThreshold) && activeIndex < pageOrder.length - 1;

      // Atualizar classes das bordas no body quando não estiver arrastando
      if (!isDragging) {
        if (nearLeftEdge) {
          document.body.classList.add("near-left-edge");
          document.body.classList.remove("near-right-edge");
        } else if (nearRightEdge) {
          document.body.classList.add("near-right-edge");
          document.body.classList.remove("near-left-edge");
        } else {
          document.body.classList.remove("near-left-edge", "near-right-edge");
        }
      }

      if (!isDragReady) return;

      const diffX = e.clientX - dragStartX;
      const diffY = e.clientY - dragStartY;

      // Só inicia o arraste real se mover mais de 8px horizontalmente e se for prioritariamente horizontal
      if (!isDragging && Math.abs(diffX) > 8 && Math.abs(diffX) > Math.abs(diffY)) {
        isDragging = true;
        document.body.classList.remove("near-left-edge", "near-right-edge");

        // Desativar transições de CSS temporariamente
        const curPage = document.getElementById(pageOrder[activeIndex]);
        const nextPage = document.getElementById(pageOrder[activeIndex + 1]);
        const prevPage = document.getElementById(pageOrder[activeIndex - 1]);

        if (curPage) curPage.style.transition = "none";
        if (nextPage) {
          nextPage.style.transition = "none";
          nextPage.style.visibility = "visible";
        }
        if (prevPage) {
          prevPage.style.transition = "none";
          prevPage.style.visibility = "visible";
        }
      }

      if (!isDragging) return;

      dragProgress = diffX / window.innerWidth;
      // Limitar progress entre -1 e 1
      dragProgress = Math.max(-1, Math.min(1, dragProgress));

      const curPage = document.getElementById(pageOrder[activeIndex]);
      const nextPage = document.getElementById(pageOrder[activeIndex + 1]);
      const prevPage = document.getElementById(pageOrder[activeIndex - 1]);

      if (dragProgress < 0 && nextPage) {
        // Arrastando para a esquerda (revela a próxima página)
        curPage.style.transform = `translate3d(${dragProgress * 100}%, 0, ${dragProgress * 250}px) rotateY(${dragProgress * 45}deg)`;
        curPage.style.opacity = 1 + dragProgress;

        nextPage.style.transform = `translate3d(${(1 + dragProgress) * 100}%, 0, ${(1 + dragProgress) * -250}px) rotateY(${(1 + dragProgress) * 45}deg)`;
        nextPage.style.opacity = -dragProgress;

        if (prevPage) {
          prevPage.style.visibility = "hidden";
          prevPage.style.opacity = "0";
        }
      } else if (dragProgress > 0 && prevPage) {
        // Arrastando para a direita (revela a página anterior)
        curPage.style.transform = `translate3d(${dragProgress * 100}%, 0, ${-dragProgress * 250}px) rotateY(${dragProgress * 45}deg)`;
        curPage.style.opacity = 1 - dragProgress;

        prevPage.style.transform = `translate3d(${(-1 + dragProgress) * 100}%, 0, ${(1 - dragProgress) * -250}px) rotateY(${(-1 + dragProgress) * 45}deg)`;
        prevPage.style.opacity = dragProgress;

        if (nextPage) {
          nextPage.style.visibility = "hidden";
          nextPage.style.opacity = "0";
        }
      }
    });

    window.addEventListener("pointerup", (e) => {
      isDragReady = false;
      if (!isDragging) return;
      isDragging = false;

      const threshold = 0.15; // 15% de arraste para mudar de página
      const curPage = document.getElementById(pageOrder[activeIndex]);
      const nextPage = document.getElementById(pageOrder[activeIndex + 1]);
      const prevPage = document.getElementById(pageOrder[activeIndex - 1]);

      // Restaurar transições de CSS
      if (curPage) curPage.style.transition = "";
      if (nextPage) nextPage.style.transition = "";
      if (prevPage) prevPage.style.transition = "";

      // Forçar reflow
      document.body.offsetHeight;

      if (dragProgress < -threshold && nextPage) {
        clearDragStyles();
        navigatePage(activeIndex + 1);
      } else if (dragProgress > threshold && prevPage) {
        clearDragStyles();
        navigatePage(activeIndex - 1);
      } else {
        // Snap back suave para a página atual
        if (curPage) {
          curPage.style.transform = "";
          curPage.style.opacity = "";
        }
        if (nextPage) {
          nextPage.style.transform = "";
          nextPage.style.opacity = "";
          setTimeout(() => {
            if (!isDragging) nextPage.style.visibility = "";
          }, 800);
        }
        if (prevPage) {
          prevPage.style.transform = "";
          prevPage.style.opacity = "";
          setTimeout(() => {
            if (!isDragging) prevPage.style.visibility = "";
          }, 800);
        }
      }
      dragProgress = 0;
    });

    // Click perto das bordas para avançar ou voltar
    window.addEventListener("click", (e) => {
      if (e.target.closest("a, button, input, textarea, select, canvas, .skill-card, .repo-card, .featured-card")) return;
      
      const now = Date.now();
      if (now - lastTransitionTime < 900) return;

      if (nearLeftEdge) {
        navigatePage(activeIndex - 1);
      } else if (nearRightEdge) {
        navigatePage(activeIndex + 1);
      }
    });

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
      if (event.target.closest("a, button, input, textarea, .skill-card")) {
        document.body.classList.add("cursor-active");
      }
    });

    document.addEventListener("pointerout", (event) => {
      if (event.target.closest("a, button, input, textarea, .skill-card")) {
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

  function initContactForm() {
    const form = document.querySelector(".contact-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();
        
        const targetEmail = "devhugoo.os@gmail.com";
        const subject = encodeURIComponent(`Contato de ${nome} via Portfólio`);
        
        const body = encodeURIComponent(
          `Olá Hugo,\n\n` +
          `Gostaria de iniciar um contato através do seu Portfólio.\n\n` +
          `----------------- DECK DE TRANSMISSÃO -----------------\n` +
          `• Remetente: ${nome}\n` +
          `• E-mail: ${email}\n` +
          `-----------------------------------------------------\n\n` +
          `Mensagem:\n` +
          `"${mensagem}"\n\n` +
          `Aguardo seu retorno.\n\n` +
          `-- Transmissão de Mensagem Automática`
        );
        
        // Abre o Gmail Compose em uma nova aba com os campos pré-definidos
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${subject}&body=${body}`;
        window.open(gmailUrl, "_blank");
      });
    }

    // Interceptar o botão do painel de email para abrir no Gmail Compose com texto pré-definido
    const emailLink = document.querySelector('.contact-panel a[href^="mailto:"]');
    if (emailLink) {
      emailLink.addEventListener("click", (e) => {
        e.preventDefault();
        const targetEmail = "devhugoo.os@gmail.com";
        const subject = encodeURIComponent("Contato via Portfólio");
        const body = encodeURIComponent(
          "Olá Hugo,\n\nEscreva sua mensagem aqui:\n\n\n\n\n---\nTransmissão enviada do Portfólio"
        );
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${subject}&body=${body}`;
        window.open(gmailUrl, "_blank");
      });
    }
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
