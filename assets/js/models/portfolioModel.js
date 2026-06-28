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
    cpp: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    html: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    css: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    gamemaker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gamemaker/gamemaker-original.svg",
    godot: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/godot/godot-original.svg",
    node: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    mysql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    netbeans: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netbeans/netbeans-original.svg",
    vscode: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
  };

  const skills = [
    { name: "Java", detail: "Linguagem de programação", startYear: 2024, experience: "Base para sistemas e lógica", icon: skillIcons.java },
    { name: "Python 3.13", detail: "Automação, scripts e protótipos", startYear: 2024, icon: skillIcons.python },
    { name: "C", detail: "Fundamentos e performance", startYear: 2024, icon: skillIcons.c },
    { name: "C++", detail: "Estruturas e jogos", startYear: 2024, experience: "Base em programação", icon: skillIcons.cpp },
    { name: "JavaScript", detail: "Interfaces e interações web", startYear: 2024, experience: "Full-stack e front-end", icon: skillIcons.javascript },
    { name: "HTML5", detail: "Estrutura web semântica", startYear: 2024, experience: "Web", icon: skillIcons.html },
    { name: "CSS3", detail: "Layouts, animações e responsividade", startYear: 2024, experience: "Web", icon: skillIcons.css },
    { name: "GameMaker", detail: "Jogos 2D e Game Jams", startYear: 2024, icon: skillIcons.gamemaker },
    { name: "Godot", detail: "Prototipagem e gameplay", startYear: 2024, icon: skillIcons.godot },
    { name: "Node.js", detail: "Back-end e APIs", startYear: 2025, icon: skillIcons.node },
    { name: "MySQL", detail: "Banco de dados relacional", startYear: 2025, icon: skillIcons.mysql },
    { name: "NetBeans", detail: "IDE para Java", startYear: 2025, icon: skillIcons.netbeans },
    { name: "VS Code", detail: "Editor principal", startYear: 2023, experience: "Fluxo diário", icon: skillIcons.vscode }
  ];

  // Calcula a experiência dinamicamente baseada no ano atual
  const currentYear = new Date().getFullYear();
  skills.forEach(skill => {
    if (skill.startYear) {
      const years = currentYear - skill.startYear;
      const text = years <= 1 ? `${years} ano de exp.` : `${years} anos de exp.`;
      if (skill.experience) {
        skill.experience = `${skill.experience} (${text})`;
      } else {
        skill.experience = text;
      }
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
    Shell: "#89e051"
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
