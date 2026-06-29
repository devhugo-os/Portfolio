(function () {
  const githubUser = "devhugo-os";

  const collaboratorRepoPaths = [
    "Rhuan-cmd/Biblioteca-FullStack",
    "Rhuan-cmd/NeuroSys"
  ];

  const skillIcons = {
    java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    c: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
    cpp: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/cplusplus.svg",
    javascript: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/javascript.svg",
    html: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/html5.svg",
    css: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/css3.svg",
    gamemaker: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/gamemaker.svg",
    node: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nodedotjs.svg"
  };

  const skills = [
    { name: "Java", detail: "Linguagem de programação", startDate: "2024-03-11", experience: "Base para sistemas e lógica", icon: skillIcons.java },
    { name: "Python 3.13", detail: "Automação, scripts e protótipos", startDate: "2024-03-11", experience: "Automação, análise e machine learning", icon: skillIcons.python },
    { name: "C", detail: "Fundamentos e performance", startDate: "2024-03-11", experience: "Algoritmos e estruturas de baixo nível", icon: skillIcons.c },
    { name: "C++", detail: "Estruturas e jogos", startDate: "2024-03-11", experience: "Estruturas e jogos de alto desempenho", icon: skillIcons.cpp },
    { name: "JavaScript", detail: "Interfaces e interações web", startDate: "2024-03-11", experience: "Interatividade e front-end", icon: skillIcons.javascript },
    { name: "HTML5", detail: "Estrutura web semântica", startDate: "2024-03-11", experience: "Marcação e SEO", icon: skillIcons.html },
    { name: "CSS3", detail: "Layouts, animações e responsividade", startDate: "2024-03-11", experience: "Layouts modernos e estilizações", icon: skillIcons.css },
    { name: "GameMaker", detail: "Jogos 2D e Game Jams", startDate: "2024-03-11", experience: "Lógica de jogos 2D e prototipagem", icon: skillIcons.gamemaker },
    { name: "Node.js", detail: "Back-end e APIs", startDate: "2025-03-11", experience: "APIs RESTful e servidores web", icon: skillIcons.node }
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
    return {
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.owner.login,
      description: repo.description || "Sem descrição publicada no GitHub.",
      language: repo.language || "Sem linguagem",
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      updatedAt: repo.updated_at,
      url: repo.html_url,
      homepage: repo.homepage,
      isFork: repo.fork
    };
  }

  async function fetchRepositories() {
    const endpoint = `https://api.github.com/users/${githubUser}/repos?sort=updated&direction=desc&per_page=30`;
    
    // Buscar repositórios do usuário e colaboradores concorrentemente
    const userReposPromise = fetch(endpoint, {
      headers: { Accept: "application/vnd.github+json" }
    }).then(r => r.ok ? r.json() : []);

    const collaboratorPromises = collaboratorRepoPaths.map(async (path) => {
      try {
        const res = await fetch(`https://api.github.com/repos/${path}`, {
          headers: { Accept: "application/vnd.github+json" }
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {}
      return null;
    });

    const [userRepos, ...collabReposResults] = await Promise.all([
      userReposPromise,
      ...collaboratorPromises
    ]);

    const collabRepos = collabReposResults.filter(r => r !== null);
    const allRepos = [...userRepos, ...collabRepos];

    return allRepos
      .filter((repo) => !repo.fork || collaboratorRepoPaths.includes(repo.full_name))
      .map(normalizeRepository)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
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
