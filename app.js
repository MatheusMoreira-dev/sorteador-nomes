/*------------------Funções Utilitárias--------------------- */

// Excluir valores repeter
function excludeEqualsValues(values = []) {
  const normalize = (str = "") => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();
  };

  let unicos = new Set();
  let result = [];

  for (let name of values) {
    let key = normalize(name);

    if (!unicos.has(key)) {
      unicos.add(key);
      result.push(name);
    }
  }

  return result;
}

// Transforma uma String em um array separado por '\n'
function splitString(str = "") {
  return str
    .split("\n")
    .map((v) => v.trim().replaceAll(/\s+/gimu, " "))
    .filter((s) => !/^\s*$/.test(s));
}

//CRUD Lista HTML
function createTag({ value, textContent, tag = "li", attributes = [] }) {
  let element = document.createElement(tag);
  element.textContent = textContent;
  element.value = value;

  attributes.forEach((keyValue) => (element[keyValue.k] = keyValue.v));
  return element;
}

function loadListaHtml({ container, node, tags = [] }) {
  container.style.display = "block";
  node.innerHTML = "";
  node.append(...tags);
}
// CRUD Local Storage
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const read = (key) => JSON.parse(localStorage.getItem(key));
const deleteKey = (key) => localStorage.removeItem(key);
const deleteAll = () => localStorage.clear();

/*------------------Elementos---------------------*/
// Inputs
let inputNomes = document.getElementById("add-nomes");
let sorteiosPorRodada = document.getElementById("total-sorteios");
sorteiosPorRodada.value = 1;

// Jogadores
let buttonClear = document.getElementById("limpar-local-storage");
let buttonAdd = document.getElementById("addNome");
let containerJogadores = document.querySelector(".container-participants");
let listaJogadores = document.getElementById("lista-participantes");

// Ganhadores
let containerGanhadores = document.querySelector(".container-last-winners");
let listaGanhadores = document.getElementById("lista-ganhadores");

/*------------------Visual e Eventos--------------------- */
const loadJogadores = () => {
  loadListaHtml({
    container: containerJogadores,
    node: listaJogadores,
    tags: jogadores.map((j) =>
      createTag({ node: listaJogadores, textContent: j })
    ),
  });
};

const loadGanhadores = () => {
  loadListaHtml({
    container: containerGanhadores,
    node: listaGanhadores,
    tags: ganhadores.map((g) =>
      createTag({ node: listaGanhadores, textContent: g })
    ),
  });
};

window.addEventListener("load", () => {
  if (localStorage.jogadores) {
    loadJogadores();
  }

  if (localStorage.ganhadores) {
    loadGanhadores();
  }
});

buttonClear.addEventListener("click", () => {
  jogadores = [];
  ganhadores = [];
  deleteAll();
  listaJogadores.innerHTML = "";
  listaGanhadores.innerHTML = "";
  containerJogadores.style.display = "none";
  containerGanhadores.style.display = "none";
});

let tagImg = document.getElementById("patrocinador-item");
let indexImg = 1;

tagImg.addEventListener("click", () => {
  let imagens = [
    { path: "assets/paraiso.png", n: 3 },
    { path: "assets/M7.png", n: 1 },
  ];
  indexImg = (indexImg + 1) % imagens.length;
  sorteiosPorRodada.value = imagens[indexImg].n;
  tagImg.src = imagens[indexImg].path;
});

/*------------------Lógica do Sorteio--------------------- */
// Busque dados salvos no Local Storage

let jogadores = localStorage.jogadores
  ? JSON.parse(localStorage.getItem("jogadores"))
  : [];

let ganhadores = localStorage.ganhadores
  ? JSON.parse(localStorage.getItem("ganhadores"))
  : [];

function addJogadores() {
  // Adiciona novos jogadores e salva no local storage
  jogadores.push(...excludeEqualsValues(splitString(inputNomes.value)));
  save("jogadores", jogadores.sort());

  inputNomes.value = ""; //Limpa Input
  loadJogadores(); // Atualiza lista html dos jogadores
}

function numeroAleatorio(max) {
  return Math.floor(Math.random() * max);
}

function sortear() {
  // Sorteia um nome entre os jogadores
  let randomIndex = numeroAleatorio(jogadores.length);
  let ganhador = jogadores[randomIndex];

  // Retira o ganhador da lista de jogadores
  jogadores.splice(randomIndex, 1);
  save("jogadores", jogadores.sort());

  // Salva o ganhador na lista
  ganhadores.push(ganhador);
  save("ganhadores", ganhadores);

  return ganhador;
}

function sorteio() {
  let ganhadoresSorteio = [];

  for (let i = 0; i < sorteiosPorRodada.value; i++) {
    let ganhador = sortear();
    ganhadoresSorteio.push(`${i + 1} - ${ganhador}`);
  }

  loadGanhadores(); // Atualiza lista html de ganhadores
  loadJogadores(); // Atualiza lista html dos jogadores

  return ganhadoresSorteio;
}

/*------------------Modal do Resultado---------------------*/
const modal = document.getElementById("modal");
const fecharModal = document.getElementById("fecharModal");
const ganhadoresRodada = document.getElementById("ganhadores-da-rodada");

function mostrarGanhadores() {
  ganhadoresRodada.innerHTML = "";

  sorteio().forEach((nome) => {
    const li = document.createElement("li");
    li.textContent = nome;
    ganhadoresRodada.appendChild(li);
  });

  modal.style.display = "flex";
}

const closeModal = () => (modal.style.display = "none");

fecharModal.addEventListener("click", closeModal);

window.addEventListener("click", (e) => {
  if (e.target === modal) fechar();
});
