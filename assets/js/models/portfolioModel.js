(function () {
  const githubUser = "devhugo-os";

  const skillIcons = {
    java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    python: "img/Python.png",
    c: "img/C.png",
    cpp: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    html: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    css: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    gamemaker: "img/Gamemaker.png",
    godot: "img/Godot.png",
    node: "img/Nodejs.png",
    mysql: "img/MySQL.png",
    netbeans: "img/NetBeans.png",
    vscode: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
  };

  const skills = [
    { name: "Java", detail: "Linguagem de programação", experience: "Base para sistemas e lógica", icon: skillIcons.java },
    { name: "Python 3.13", detail: "Automação, scripts e protótipos", experience: "2 anos de experiência", icon: skillIcons.python },
    { name: "C", detail: "Fundamentos e performance", experience: "2 anos de experiência", icon: skillIcons.c },
    { name: "C++", detail: "Estruturas e jogos", experience: "Base em programação", icon: skillIcons.cpp },
    { name: "JavaScript", detail: "Interfaces e interações web", experience: "Full-stack e front-end", icon: skillIcons.javascript },
    { name: "HTML5", detail: "Estrutura web semântica", experience: "Web", icon: skillIcons.html },
    { name: "CSS3", detail: "Layouts, animações e responsividade", experience: "Web", icon: skillIcons.css },
    { name: "GameMaker", detail: "Jogos 2D e Game Jams", experience: "2 anos de experiência", icon: skillIcons.gamemaker },
    { name: "Godot", detail: "Prototipagem e gameplay", experience: "2 anos de experiência", icon: skillIcons.godot },
    { name: "Node.js", detail: "Back-end e APIs", experience: "1 ano de experiência", icon: skillIcons.node },
    { name: "MySQL", detail: "Banco de dados relacional", experience: "1 ano de experiência", icon: skillIcons.mysql },
    { name: "NetBeans", detail: "IDE para Java", experience: "1 ano de experiência", icon: skillIcons.netbeans },
    { name: "VS Code", detail: "Editor principal", experience: "Fluxo diário", icon: skillIcons.vscode }
  ];

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
    const endpoint = `https://api.github.com/users/${githubUser}/repos?sort=updated&direction=desc&per_page=24`;
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub respondeu com status ${response.status}`);
    }

    const repos = await response.json();
    return repos
      .filter((repo) => !repo.fork)
      .map(normalizeRepository)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.Model = {
    githubUser,
    skills,
    featuredExperiences,
    languageColors,
    fetchRepositories
  };
})();
