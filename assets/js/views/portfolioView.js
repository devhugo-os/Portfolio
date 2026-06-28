(function () {
  const languageColors = () => window.Portfolio.Model.languageColors;

  function byId(id) {
    return document.getElementById(id);
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (text !== undefined) {
      element.textContent = text;
    }
    return element;
  }

  function createIcon(className) {
    const icon = createElement("i", `bi ${className}`);
    icon.setAttribute("aria-hidden", "true");
    return icon;
  }

  function formatDate(dateString) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(dateString));
  }

  function renderSkills(skills) {
    const grid = byId("skills-grid");
    if (!grid) return;

    const cards = skills.map((skill) => {
      const article = createElement("article", "skill-card");
      article.tabIndex = 0;
      article.dataset.tilt = "";

      const logo = createElement("div", "skill-logo");
      const img = createElement("img");
      img.src = skill.icon;
      img.alt = `Logo ${skill.name}`;
      img.loading = "lazy";
      logo.appendChild(img);

      const title = createElement("h3", "", skill.name);
      const detail = createElement("p", "", skill.detail);
      const experience = createElement("p", "", skill.experience);

      article.append(logo, title, detail, experience);
      return article;
    });

    grid.replaceChildren(...cards);
  }

  function renderFeatured(items, targetId) {
    const grid = byId(targetId);
    if (!grid) return;

    const cards = items.map((item) => {
      const article = createElement("article", "featured-card");
      const icon = createIcon(item.icon);
      const title = createElement("h3", "", item.title);
      const description = createElement("p", "", item.description);
      const tags = createElement("div", "featured-tags");
      item.tags.forEach((tag) => tags.appendChild(createElement("span", "", tag)));

      const link = createElement("a");
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.append(createIcon("bi-box-arrow-up-right"), document.createTextNode("Ver projeto"));

      article.append(icon, title, description, tags, link);
      return article;
    });

    grid.replaceChildren(...cards);
  }

  function renderRepoSkeleton() {
    const grid = byId("repo-grid");
    if (!grid) return;

    const skeletons = Array.from({ length: 6 }, () => {
      const article = createElement("article", "repo-card skeleton");
      article.append(createElement("span"), createElement("h3"), createElement("p"));
      return article;
    });

    grid.replaceChildren(...skeletons);
  }

  function renderRepositoryFilters(languages, activeLanguage) {
    const container = byId("repo-filters");
    if (!container) return;

    const allButton = createElement("button", activeLanguage === "Todos" ? "active" : "", "Todos");
    allButton.type = "button";
    allButton.dataset.language = "Todos";

    const buttons = languages.map((language) => {
      const button = createElement("button", activeLanguage === language ? "active" : "", language);
      button.type = "button";
      button.dataset.language = language;
      return button;
    });

    container.replaceChildren(allButton, ...buttons);
  }

  function renderRepositories(repositories) {
    const grid = byId("repo-grid");
    if (!grid) return;

    if (!repositories.length) {
      const empty = createElement("article", "repo-card");
      empty.append(
        createIcon("bi-search"),
        createElement("h3", "", "Nenhum repositório encontrado"),
        createElement("p", "", "Ajuste o filtro ou a busca para ver outros projetos do perfil.")
      );
      grid.replaceChildren(empty);
      return;
    }

    const cards = repositories.map((repo) => {
      const article = createElement("article", "repo-card");
      const title = createElement("h3", "", repo.name);
      const description = createElement("p", "", repo.description);

      const topics = createElement("div", "repo-topics");
      const topicList = repo.topics.length ? repo.topics.slice(0, 4) : [repo.language];
      topicList.forEach((topic) => {
        const tag = createElement("span", "repo-topic", topic);
        topics.appendChild(tag);
      });

      const link = createElement("a");
      link.href = repo.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.append(createIcon("bi-github"), document.createTextNode("Abrir no GitHub"));

      const meta = createElement("div", "repo-meta");

      const language = createElement("span");
      const dot = createElement("span", "repo-language");
      dot.style.background = languageColors()[repo.language] || "#42f2b7";
      language.append(dot, document.createTextNode(repo.language));

      const stars = createElement("span");
      stars.append(createIcon("bi-star"), document.createTextNode(String(repo.stars)));

      const forks = createElement("span");
      forks.append(createIcon("bi-diagram-2"), document.createTextNode(String(repo.forks)));

      const updated = createElement("span");
      updated.append(createIcon("bi-clock-history"), document.createTextNode(formatDate(repo.updatedAt)));

      meta.append(language, stars, forks, updated);
      article.append(title, description, topics, link, meta);
      return article;
    });

    grid.replaceChildren(...cards);
  }

  function setRepositoryStatus(message, isError) {
    const status = byId("repo-status");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("text-danger", Boolean(isError));
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.View = {
    byId,
    renderSkills,
    renderFeatured,
    renderRepoSkeleton,
    renderRepositoryFilters,
    renderRepositories,
    setRepositoryStatus
  };
})();
