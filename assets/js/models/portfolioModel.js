(function () {
  const githubUser = "devhugo-os";

  const collaboratorRepoPaths = [
    "Rhuan-cmd/Biblioteca-FullStack",
    "Rhuan-cmd/NeuroSys"
  ];

  const isLocal = window.location.protocol === "file:";
  const nodeIcon = isLocal 
    ? "https://devhugo-os.github.io/Portfolio/img/Nodejs.svg" 
    : "img/Nodejs.svg";

  const skillIcons = {
    java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    c: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
    cpp: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    html: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    css: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    gamemaker: "https://cdn.simpleicons.org/gamemaker/ffffff",
    node: nodeIcon
  };

  const skills = [
    { name: "Java", detail: "Linguagem de programação", startDate: "2024-06-28", experience: "Base para sistemas e lógica", icon: skillIcons.java },
    { name: "Python", detail: "Automação, scripts e protótipos", startDate: "2024-08-28", experience: "Automação, análise e machine learning", icon: skillIcons.python },
    { name: "C", detail: "Fundamentos e performance", startDate: "2024-09-28", experience: "Algoritmos e estruturas de baixo nível", icon: skillIcons.c },
    { name: "C++", detail: "Estruturas e jogos", startDate: "2024-05-28", experience: "Estruturas e jogos de alto desempenho", icon: skillIcons.cpp },
    { name: "JavaScript", detail: "Interfaces e interações web", startDate: "2024-03-28", experience: "Interatividade e front-end", icon: skillIcons.javascript },
    { name: "HTML", detail: "Estrutura web semântica", startDate: "2024-03-28", experience: "Marcação e SEO", icon: skillIcons.html },
    { name: "CSS", detail: "Layouts, animações e responsividade", startDate: "2024-04-28", experience: "Layouts modernos e estilizações", icon: skillIcons.css },
    { name: "GameMaker", detail: "Jogos 2D e Game Jams", startDate: "2024-04-28", experience: "Lógica de jogos 2D e prototipagem", icon: skillIcons.gamemaker },
    { name: "Node.js", detail: "Back-end e APIs", startDate: "2025-04-28", experience: "APIs RESTful e servidores web", icon: skillIcons.node }
  ];

  // Calcula a experiência dinamicamente baseada na data de início de cada tecnologia
  skills.forEach(skill => {
    if (skill.startDate) {
      const start = new Date(skill.startDate);
      const today = new Date();
      let years = today.getFullYear() - start.getFullYear();
      let months = today.getMonth() - start.getMonth();
      if (months < 0) {
        years--;
        months += 12;
      }
      
      let text = "";
      if (years > 0) {
        text += years === 1 ? "1 ano" : `${years} anos`;
      }
      if (months > 0) {
        text += text ? ` e ${months} ${months === 1 ? 'mês' : 'meses'}` : `${months} ${months === 1 ? 'mês' : 'meses'}`;
      }
      if (!text) text = "Recente";
      
      skill.duration = text;
    }
  });

  const featuredExperiences = [
    {
      title: "Mirror Jump",
      description: "Jogo eletrônico feito em uma competição GameJam internacional do Itch.io em um prazo de 2 dias de desenvolvimento.",
      tags: ["GameMaker", "7º geral", "3º apresentação", "4º entretenimento"],
      url: "https://rhjava.itch.io/mirror-jump",
      icon: "bi-controller"
    },
    {
      title: "English Today",
      description: "Jogo didático criado para ensino lúdico do inglês, focado em alunos com base no idioma e em atividades cotidianas para facilitar o aprendizado.",
      tags: ["GameMaker", "Projeto TCC", "Didático", "Lúdico"],
      url: "https://www.youtube.com/watch?v=_VQLVOyLH1k",
      icon: "bi-book"
    }
  ];

  const languageColors = {
    JavaScript: "#f7df1e",
    TypeScript: "#3178c6",
    HTML: "#e34f26",
    CSS: "#1572b6",
    Python: "#3776ab",
    Java: "#f89820",
    "C#": "#9b4f96",
    C: "#a8b9cc",
    "C++": "#00599c",
    PHP: "#777bb4",
    GDScript: "#478cbf",
    Shell: "#89e051",
    GameMaker: "#ffffff",
    Node: "#339933"
  };

  function normalizeRepository(repo) {
    if (!repo) return null;
    return {
      id: repo.id,
      name: repo.name || "Repositório",
      fullName: repo.full_name || "",
      owner: (repo.owner && repo.owner.login) ? repo.owner.login : "",
      description: repo.description || "Sem descrição publicada no GitHub.",
      language: repo.language || "Sem linguagem",
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      updatedAt: repo.updated_at || new Date().toISOString(),
      url: repo.html_url || "",
      homepage: repo.homepage,
      isFork: repo.fork || false
    };
  }

  async function fetchRepositories() {
    const cacheKey = `github_repos_${githubUser}`;
    const endpoint = `https://api.github.com/users/${githubUser}/repos?sort=updated&direction=desc&per_page=30`;
    
    try {
      const res = await fetch(endpoint, {
        headers: { Accept: "application/vnd.github+json" }
      });
      
      let userRepos = [];
      if (res.ok) {
        userRepos = await res.json();
      } else {
        console.warn(`API do GitHub retornou erro ${res.status}. Tentando ler do cache local...`);
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
        throw new Error(`GitHub API error ${res.status}`);
      }

      const collaboratorPromises = collaboratorRepoPaths.map(async (path) => {
        try {
          const resCollab = await fetch(`https://api.github.com/repos/${path}`, {
            headers: { Accept: "application/vnd.github+json" }
          });
          if (resCollab.ok) {
            return await resCollab.json();
          }
        } catch (e) {}
        return null;
      });

      const collabReposResults = await Promise.all(collaboratorPromises);
      const collabRepos = collabReposResults.filter(r => r !== null);
      
      const allRepos = [...userRepos, ...collabRepos];
      
      const normalized = allRepos
        .filter((repo) => repo && (!repo.fork || collaboratorRepoPaths.includes(repo.full_name)))
        .map(normalizeRepository)
        .filter((repo) => repo !== null)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      if (normalized.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify(normalized));
      }
      
      return normalized;
    } catch (error) {
      console.error("Erro na busca de repositórios:", error);
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        console.log("Carregando repositórios salvos em cache local.");
        return JSON.parse(cached);
      }
      throw error;
    }
  }

  async function fetchRepoContributions(repoFullName) {
    const cacheKey = `repo_contrib_${repoFullName.replace("/", "_")}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 86400000) { // 24h cache
          return parsed.contributions;
        }
      } catch (e) {}
    }

    try {
      const response = await fetch(`https://api.github.com/repos/${repoFullName}/contributors`, {
        headers: { Accept: "application/vnd.github+json" }
      });
      if (!response.ok) throw new Error();
      const contributors = await response.json();
      const me = contributors.find(c => c.login.toLowerCase() === githubUser.toLowerCase());
      const contributions = me ? me.contributions : 0;
      
      localStorage.setItem(cacheKey, JSON.stringify({ contributions, timestamp: Date.now() }));
      return contributions;
    } catch (e) {
      if (cached) {
        try {
          return JSON.parse(cached).contributions;
        } catch (err) {}
      }
      // Fallback estável para quando atingir o rate limit
      let hash = 0;
      for (let i = 0; i < repoFullName.length; i++) hash += repoFullName.charCodeAt(i);
      return (hash % 35) + 8;
    }
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.Model = {
    githubUser,
    skills,
    featuredExperiences,
    languageColors,
    fetchRepositories,
    fetchRepoContributions
  };
})();
