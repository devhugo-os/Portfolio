(function () {
if (window.location.hostname.includes("github.io")) {
const pathParts = window.location.pathname.split('/');
const lastPart = pathParts[pathParts.length - 1];
if (lastPart === 'Portfolio' || lastPart === 'portfolio') {
const newPath = window.location.pathname + '/';
window.location.replace(window.location.origin + newPath + window.location.search + window.location.hash);
}
}
})();
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
const endpoint = `https://api.github.com/users/${githubUser}/repos?sort=updated&direction=desc&per_page=30`;
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
.filter((repo) => repo && (!repo.fork || collaboratorRepoPaths.includes(repo.full_name)))
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
const canvas = createElement("canvas", "skill-3d-canvas");
canvas.dataset.name = skill.name;
canvas.dataset.icon = skill.icon;
const img = createElement("img", "skill-static-icon");
img.src = skill.icon;
img.alt = skill.name;
img.draggable = false;
logo.append(canvas, img);
const title = createElement("h3", "", skill.name);
const detail = createElement("p", "skill-detail", skill.detail);
article.append(logo, title, detail);
if (skill.experience) {
const expDesc = createElement("p", "skill-exp-desc", skill.experience);
article.appendChild(expDesc);
}
if (skill.duration) {
const experience = createElement("span", "skill-experience-badge", `Exp: ${skill.duration}`);
article.appendChild(experience);
}
return article;
});
grid.replaceChildren(...cards);
}
function renderFeatured(items, targetId) {
const grid = byId(targetId);
if (!grid) return;
const cards = items.map((item) => {
const article = createElement("article", "featured-card");
const header = createElement("div", "featured-header");
const icon = createIcon(item.icon);
const title = createElement("h3", "", item.title);
header.append(icon, title);
const description = createElement("p", "featured-desc-p", item.description);
const tags = createElement("div", "featured-tags");
item.tags.forEach((tag) => tags.appendChild(createElement("span", "", tag)));
const link = createElement("a", "btn btn-primary magnetic-link");
link.href = item.url;
link.target = "_blank";
link.rel = "noreferrer";
link.append(createIcon("bi-box-arrow-up-right"), document.createTextNode("Ver projeto"));
article.append(header, description, tags, link);
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
const description = createElement("p", "repo-description-p");
const fullText = repo.description || "Sem descrição publicada no GitHub.";
const maxChars = 80;
if (fullText.length > maxChars) {
const truncatedText = fullText.substring(0, maxChars) + "...";
const textNode = document.createTextNode(truncatedText);
description.appendChild(textNode);
const toggleBtn = createElement("button", "read-more-btn", "Ler mais");
toggleBtn.type = "button";
toggleBtn.addEventListener("click", (e) => {
e.stopPropagation();
const isExpanded = article.classList.toggle("expanded");
if (isExpanded) {
textNode.nodeValue = fullText;
toggleBtn.textContent = "Ler menos";
} else {
textNode.nodeValue = truncatedText;
toggleBtn.textContent = "Ler mais";
}
});
description.appendChild(toggleBtn);
} else {
description.textContent = fullText;
}
const topics = createElement("div", "repo-topics");
const topicList = repo.topics.length ? repo.topics.slice(0, 4) : [repo.language];
topicList.forEach((topic) => {
const tag = createElement("span", "repo-topic", topic);
topics.appendChild(tag);
});
const link = createElement("a", "btn btn-primary magnetic-link");
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
const contributions = createElement("span", "repo-contributions");
const gitIcon = createIcon("bi-git");
const countSpan = createElement("span", "contrib-count", "...");
contributions.append(gitIcon, countSpan, document.createTextNode(" contribs"));
if (window.Portfolio.Model && window.Portfolio.Model.fetchRepoContributions) {
window.Portfolio.Model.fetchRepoContributions(repo.fullName).then(count => {
countSpan.textContent = String(count);
}).catch(() => {
countSpan.textContent = "0";
});
}
const updated = createElement("span");
updated.append(createIcon("bi-clock-history"), document.createTextNode(formatDate(repo.updatedAt)));
meta.append(language, stars, forks, contributions, updated);
const repoFooter = createElement("div", "repo-footer");
repoFooter.append(link, meta);
article.append(title, description, topics, repoFooter);
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
(function () {
function init() {
const canvas = document.getElementById("hero-scene");
if (!canvas || !window.THREE) {
return;
}
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
camera.position.set(0, 0, 8);
let renderer;
try {
renderer = new THREE.WebGLRenderer({
canvas,
antialias: true,
alpha: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
} catch (e) {
console.warn("WebGL não suportado no dispositivo atual:", e);
return;
}
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
(function () {
function init() {
if (!window.THREE) {
console.warn("Three.js não está carregado. Não foi possível inicializar skills 3D.");
return;
}
if (window.innerWidth < 992) {
return;
}
if (!THREE.SVGLoader) {
console.warn("SVGLoader do Three.js não está carregado. Importe o SVGLoader.js no index.html.");
return;
}
const canvases = document.querySelectorAll(".skill-3d-canvas");
canvases.forEach((canvas) => {
if (canvas.dataset.initialized) return; // Evita dupla inicialização
canvas.dataset.initialized = "true";
const name = canvas.dataset.name;
const iconUrl = canvas.dataset.icon;
let colorKey = name;
if (name.startsWith("C++")) colorKey = "C++";
else if (name.startsWith("C")) colorKey = "C";
else if (name.startsWith("Python")) colorKey = "Python";
else if (name.startsWith("HTML")) colorKey = "HTML";
else if (name.startsWith("CSS")) colorKey = "CSS";
else if (name.startsWith("Node")) colorKey = "Node";
const languageColor = (window.Portfolio.Model.languageColors && window.Portfolio.Model.languageColors[colorKey]) || "#42f2b7";
initSingleSkill(canvas, iconUrl, languageColor);
});
}
function loadSVGLogo(url, languageColor, onLoaded) {
fetch(url)
.then(response => {
if (!response.ok) throw new Error("Erro na resposta HTTP: " + response.status);
return response.text();
})
.then(text => {
let cleanText = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
cleanText = cleanText
.replace(/url\(#python-original-a\)/gi, "#3776ab")
.replace(/url\(#python-original-b\)/gi, "#ffd343")
.replace(/url\(#python-original-c\)/gi, "#3776ab");
const loader = new THREE.SVGLoader();
const data = loader.parse(cleanText);
const paths = data.paths;
const group = new THREE.Group();
const xml = data.xml;
const viewBox = xml?.getAttribute("viewBox");
let viewBoxWidth = 512;
if (viewBox) {
const parts = viewBox.split(" ").map(Number);
if (parts.length === 4) {
viewBoxWidth = parts[2] || 512;
}
}
const scaleRatio = viewBoxWidth / 512;
for (let i = 0; i < paths.length; i++) {
const path = paths[i];
const tagName = path.userData?.node?.tagName;
const fill = path.userData?.node?.getAttribute("fill");
const isDarkBackground = (tagName === "rect" || tagName === "polygon") && (
fill === "#000" || fill === "#000000" || fill === "#1a1a1a" || fill === "#111111" || fill === "#090a08"
);
if (isDarkBackground) {
continue; // Ignora apenas o fundo escuro
}
let finalColor;
if (url.includes("python")) {
if (i === 0) finalColor = new THREE.Color("#3776AB"); // Azul oficial
else if (i === 1) finalColor = new THREE.Color("#FFD343"); // Amarelo oficial
else finalColor = new THREE.Color("#FFFFFF");
} else if (url.includes("css3")) {
if (i === 0) finalColor = new THREE.Color("#1572B6"); // Azul oficial esquerdo
else if (i === 1) finalColor = new THREE.Color("#33A9FF"); // Azul claro direito
else if (i === 2) finalColor = new THREE.Color("#FFFFFF"); // Branco "3"
else finalColor = new THREE.Color("#FFFFFF");
} else {
const isDefaultBlack = path.color && path.color.getHexString() === "000000";
finalColor = path.color && !isDefaultBlack ? path.color : new THREE.Color(languageColor);
}
const material = new THREE.MeshStandardMaterial({
color: finalColor,
roughness: 0.15,
metalness: 0.7,
side: THREE.DoubleSide,
depthWrite: true
});
const shapes = THREE.SVGLoader.createShapes(path);
for (let j = 0; j < shapes.length; j++) {
const shape = shapes[j];
const geometry = new THREE.ExtrudeGeometry(shape, {
depth: 18 * scaleRatio,
bevelEnabled: true,
bevelThickness: 1.5 * scaleRatio,
bevelSize: 0.6 * scaleRatio,
bevelSegments: 2
});
const mesh = new THREE.Mesh(geometry, material);
mesh.position.z = i * 0.5 * scaleRatio;
group.add(mesh);
}
}
const box = new THREE.Box3().setFromObject(group);
const size = box.getSize(new THREE.Vector3());
const center = box.getCenter(new THREE.Vector3());
const maxDim = Math.max(size.x, size.y, size.z) || 1;
const scale = 0.95 / maxDim;
group.position.set(-center.x, -center.y, -center.z);
const pivot = new THREE.Group();
pivot.add(group);
pivot.scale.set(scale, -scale, scale);
onLoaded(pivot);
})
.catch(error => {
console.warn("Erro ao buscar e parsear SVG. Usando fallback procedural para:", url, error);
onLoaded(createFallbackProceduralModel(languageColor));
});
}
function createFallbackProceduralModel(languageColor) {
const group = new THREE.Group();
const geom = new THREE.TorusKnotGeometry(0.3, 0.08, 48, 8);
const mat = new THREE.MeshStandardMaterial({
color: new THREE.Color(languageColor),
metalness: 0.8,
roughness: 0.15
});
const mesh = new THREE.Mesh(geom, mat);
group.add(mesh);
return group;
}
function initSingleSkill(canvas, iconUrl, languageColor) {
let renderer, scene, camera, modelGroup;
let rotationSpeed = 0.015;
let targetRotationSpeed = 0.015;
let isHovered = false;
let hoverTargetY = 0;
const card = canvas.closest(".skill-card");
if (card) {
card.style.setProperty("--skill-color", languageColor);
}
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(46, 1, 0.1, 10);
camera.position.z = 2.2;
try {
renderer = new THREE.WebGLRenderer({
canvas: canvas,
alpha: true,
antialias: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(50, 50, false);
} catch (e) {
console.warn("WebGL não disponível para a skill:", iconUrl, e);
return;
}
loadSVGLogo(iconUrl, languageColor, (loadedGroup) => {
modelGroup = loadedGroup;
scene.add(modelGroup);
});
const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
dirLight.position.set(1.5, 2, 2.5);
const glowLight = new THREE.PointLight(new THREE.Color(languageColor), 0.75, 5);
glowLight.position.set(-1, -1.5, 1);
scene.add(ambientLight, dirLight, glowLight);
if (card) {
card.addEventListener("pointerenter", () => {
isHovered = true;
if (modelGroup) {
hoverTargetY = Math.round(modelGroup.rotation.y / (Math.PI * 2)) * (Math.PI * 2);
}
});
card.addEventListener("pointerleave", () => {
isHovered = false;
});
}
function render(time) {
if (modelGroup) {
if (isHovered) {
modelGroup.rotation.y += (hoverTargetY - modelGroup.rotation.y) * 0.15;
modelGroup.rotation.x += (0 - modelGroup.rotation.x) * 0.15;
modelGroup.rotation.z += (0 - modelGroup.rotation.z) * 0.15;
} else {
const targetY = time * 0.001;
modelGroup.rotation.y += (targetY - modelGroup.rotation.y) * 0.1;
modelGroup.rotation.x += (Math.sin(time * 0.0016) * 0.12 - modelGroup.rotation.x) * 0.1;
modelGroup.rotation.z += (Math.cos(time * 0.0012) * 0.06 - modelGroup.rotation.z) * 0.1;
}
}
renderer.render(scene, camera);
requestAnimationFrame(render);
}
requestAnimationFrame(render);
}
window.Portfolio = window.Portfolio || {};
window.Portfolio.SkillsScene = { init };
})();
(function () {
let Model, View, HeroScene, SkillsScene;
const state = {
repositories: [],
activeLanguage: "Todos",
searchTerm: ""
};
function init() {
const Portfolio = window.Portfolio || {};
Model = Portfolio.Model;
View = Portfolio.View;
HeroScene = Portfolio.HeroScene;
SkillsScene = Portfolio.SkillsScene;
if (View && Model) {
try {
View.renderSkills(Model.skills);
} catch (e) {
console.error("Erro ao renderizar skills:", e);
}
try {
View.renderFeatured(Model.featuredExperiences, "spotlight-grid");
} catch (e) {
console.error("Erro ao renderizar experiências destacadas:", e);
}
} else {
console.warn("Model ou View do Portfolio não definidos.");
}
try {
setCurrentYear();
} catch (e) { console.error(e); }
try {
updateAge();
} catch (e) { console.error(e); }
try {
initNavigation();
} catch (e) { console.error(e); }
try {
initCursor();
} catch (e) { console.error(e); }
try {
initTilt();
} catch (e) { console.error(e); }
try {
initMagneticLinks();
} catch (e) { console.error(e); }
try {
initRepositories();
} catch (e) { console.error(e); }
try {
initContactForm();
} catch (e) { console.error(e); }
try {
initTypingAnimation();
} catch (e) { console.error(e); }
if (HeroScene && typeof HeroScene.init === "function") {
try {
HeroScene.init();
} catch (e) {
console.error("Erro ao inicializar HeroScene:", e);
}
} else {
console.warn("HeroScene não disponível.");
}
if (SkillsScene && typeof SkillsScene.init === "function") {
try {
SkillsScene.init();
} catch (e) {
console.error("Erro ao inicializar SkillsScene:", e);
}
}
document.addEventListener("click", () => {
if (!document.fullscreenElement) {
document.documentElement.requestFullscreen().catch(() => {});
}
});
document.addEventListener("fullscreenchange", () => {
if (document.fullscreenElement) {
document.body.classList.add("is-fullscreen");
} else {
document.body.classList.remove("is-fullscreen");
}
});
window.addEventListener("dragstart", (e) => e.preventDefault());
}
function setCurrentYear() {
const year = View.byId("current-year");
if (year) {
year.textContent = new Date().getFullYear().toString();
}
const expYearsSpan = document.getElementById("dynamic-experience-years");
if (expYearsSpan) {
const start = new Date("2023-12-28");
const today = new Date();
let years = today.getFullYear() - start.getFullYear();
const m = today.getMonth() - start.getMonth();
if (m < 0 || (m === 0 && today.getDate() < start.getDate())) {
years--;
}
expYearsSpan.textContent = String(years);
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
targetPage.offsetHeight;
currentPage.classList.add("slide-left");
currentPage.classList.remove("active-page");
targetPage.classList.remove("slide-right");
targetPage.classList.add("active-page");
} else {
targetPage.classList.remove("slide-left", "slide-right", "active-page");
targetPage.classList.add("slide-left");
targetPage.offsetHeight;
currentPage.classList.add("slide-right");
currentPage.classList.remove("active-page");
targetPage.classList.remove("slide-left");
targetPage.classList.add("active-page");
}
activeIndex = targetIndex;
lastTransitionTime = Date.now();
if (window.innerWidth < 992) {
window.scrollTo({ top: 0, behavior: "instant" });
}
const links = document.querySelectorAll(".navbar .nav-link, .navbar .navbar-brand");
links.forEach((link) => {
const href = link.getAttribute("href");
link.classList.toggle("active", href === `#${targetId}`);
});
history.pushState(null, null, `#${targetId}`);
}
let isNavigatingStepByStep = false;
function navigateStepByStep(targetIndex) {
if (targetIndex < 0 || targetIndex >= pageOrder.length) return;
if (targetIndex === activeIndex) return;
if (isNavigatingStepByStep) return;
if (window.innerWidth < 992) {
navigatePage(targetIndex);
return;
}
isNavigatingStepByStep = true;
pageOrder.forEach((id) => {
const el = document.getElementById(id);
if (el) {
el.style.transition = "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s, visibility 0.25s";
}
});
const steps = [];
const stepDirection = targetIndex > activeIndex ? 1 : -1;
let currentStep = activeIndex;
while (currentStep !== targetIndex) {
currentStep += stepDirection;
steps.push(currentStep);
}
let delay = 0;
steps.forEach((stepIdx, idx) => {
setTimeout(() => {
navigatePage(stepIdx);
if (idx === steps.length - 1) {
setTimeout(() => {
pageOrder.forEach((id) => {
const el = document.getElementById(id);
if (el) el.style.transition = "";
});
isNavigatingStepByStep = false;
}, 250);
}
}, delay);
delay += 250;
});
}
function initNavigation() {
const menu = document.getElementById("mainMenu");
const links = Array.from(document.querySelectorAll(".navbar .nav-link[href^='#'], .navbar .navbar-brand[href^='#'], .site-footer a[href^='#']"));
const collapse = menu && window.bootstrap ? new bootstrap.Collapse(menu, { toggle: false }) : null;
links.forEach((link) => {
link.addEventListener("click", (event) => {
event.preventDefault();
const targetId = link.getAttribute("href").substring(1);
const targetIdx = pageOrder.indexOf(targetId);
if (targetIdx !== -1) {
navigateStepByStep(targetIdx);
}
if (collapse && menu.classList.contains("show")) {
collapse.hide();
}
});
});
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
let isDragReady = false;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragProgress = 0;
let snapTimeoutNext = null;
let snapTimeoutPrev = null;
const edgeThreshold = 100;
let nearLeftEdge = false;
let nearRightEdge = false;
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
if (window.innerWidth < 992) return; // Desativa arraste de tela em dispositivos móveis
if (snapTimeoutNext) { clearTimeout(snapTimeoutNext); snapTimeoutNext = null; }
if (snapTimeoutPrev) { clearTimeout(snapTimeoutPrev); snapTimeoutPrev = null; }
if (e.target.closest("a, button, input, textarea, select, canvas, .skill-card, .repo-card, .featured-card")) return;
const curPage = document.getElementById(pageOrder[activeIndex]);
const nextPage = document.getElementById(pageOrder[activeIndex + 1]);
const prevPage = document.getElementById(pageOrder[activeIndex - 1]);
if (curPage) curPage.style.transition = "none";
if (nextPage) nextPage.style.transition = "none";
if (prevPage) prevPage.style.transition = "none";
const now = Date.now();
if (now - lastTransitionTime < 900) return;
isDragReady = true;
isDragging = false;
dragStartX = e.clientX;
dragStartY = e.clientY;
dragProgress = 0;
});
window.addEventListener("pointermove", (e) => {
if (window.innerWidth < 992) return; // Desativa arraste de tela em dispositivos móveis
const width = window.innerWidth;
nearLeftEdge = e.clientX < edgeThreshold && activeIndex > 0;
nearRightEdge = e.clientX > (width - edgeThreshold) && activeIndex < pageOrder.length - 1;
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
if (!isDragging && Math.abs(diffX) > 8 && Math.abs(diffX) > Math.abs(diffY)) {
isDragging = true;
document.body.classList.remove("near-left-edge", "near-right-edge");
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
dragProgress = Math.max(-1, Math.min(1, dragProgress));
const curPage = document.getElementById(pageOrder[activeIndex]);
const nextPage = document.getElementById(pageOrder[activeIndex + 1]);
const prevPage = document.getElementById(pageOrder[activeIndex - 1]);
if (dragProgress < 0 && nextPage) {
nextPage.style.visibility = "visible";
curPage.style.transform = `translate3d(${dragProgress * 100}%, 0, ${dragProgress * 250}px) rotateY(${dragProgress * 45}deg)`;
curPage.style.opacity = 1 + dragProgress;
nextPage.style.transform = `translate3d(${(1 + dragProgress) * 100}%, 0, ${(1 + dragProgress) * -250}px) rotateY(${(1 + dragProgress) * 45}deg)`;
nextPage.style.opacity = -dragProgress;
if (prevPage) {
prevPage.style.visibility = "hidden";
prevPage.style.opacity = "0";
}
} else if (dragProgress > 0 && prevPage) {
prevPage.style.visibility = "visible";
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
if (window.innerWidth < 992) return; // Desativa arraste de tela em dispositivos móveis
isDragReady = false;
if (!isDragging) {
const curPage = document.getElementById(pageOrder[activeIndex]);
const nextPage = document.getElementById(pageOrder[activeIndex + 1]);
const prevPage = document.getElementById(pageOrder[activeIndex - 1]);
if (curPage) curPage.style.transition = "";
if (nextPage) nextPage.style.transition = "";
if (prevPage) prevPage.style.transition = "";
return;
}
isDragging = false;
const threshold = 0.15; // 15% de arraste para mudar de página
const curPage = document.getElementById(pageOrder[activeIndex]);
const nextPage = document.getElementById(pageOrder[activeIndex + 1]);
const prevPage = document.getElementById(pageOrder[activeIndex - 1]);
if (curPage) curPage.style.transition = "";
if (nextPage) nextPage.style.transition = "";
if (prevPage) prevPage.style.transition = "";
document.body.offsetHeight;
if (dragProgress < -threshold && nextPage) {
clearDragStyles();
navigatePage(activeIndex + 1);
} else if (dragProgress > threshold && prevPage) {
clearDragStyles();
navigatePage(activeIndex - 1);
} else {
if (curPage) {
curPage.style.transform = "";
curPage.style.opacity = "";
}
if (nextPage) {
nextPage.style.transform = "";
nextPage.style.opacity = "";
snapTimeoutNext = setTimeout(() => {
if (!isDragging) nextPage.style.visibility = "";
snapTimeoutNext = null;
}, 800);
}
if (prevPage) {
prevPage.style.transform = "";
prevPage.style.opacity = "";
snapTimeoutPrev = setTimeout(() => {
if (!isDragging) prevPage.style.visibility = "";
snapTimeoutPrev = null;
}, 800);
}
}
dragProgress = 0;
});
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
window.addEventListener("popstate", () => {
const hash = window.location.hash.substring(1) || "inicio";
const targetIdx = pageOrder.indexOf(hash);
if (targetIdx !== -1 && targetIdx !== activeIndex) {
navigateStepByStep(targetIdx);
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
const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${subject}&body=${body}`;
window.open(gmailUrl, "_blank");
});
}
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
function initTypingAnimation() {
const visibleSpan = document.getElementById("hero-visible");
const cursorSpan = document.getElementById("hero-cursor");
const hiddenSpan = document.getElementById("hero-hidden");
if (!visibleSpan || !cursorSpan || !hiddenSpan) return;
const text = "Hugo Oliveira Silva";
let index = 0;
function type() {
if (index <= text.length) {
visibleSpan.textContent = text.substring(0, index);
hiddenSpan.textContent = text.substring(index);
index++;
setTimeout(type, 100 + Math.random() * 55);
} else {
setTimeout(() => {
cursorSpan.remove();
}, 2400);
}
}
setTimeout(type, 800);
}
document.addEventListener("DOMContentLoaded", init);
})();