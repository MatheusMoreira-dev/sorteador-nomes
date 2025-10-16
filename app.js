/*------------------Funções Utilitárias--------------------- */

// Transforma uma String em um array separado por '\n'
function splitString(str = "") {
  return str
    .split("\n")
    .map((v) => v.trim().replaceAll(/\s+/gimu, " "))
    .filter((s) => !/^\s*$/.test(s));
}

// Adiciona um item ao final de um nó
function appendTo({ node, value, tag = "li" }) {
  let child = document.createElement(tag);
  child.textContent = value;
  child.value = value;

  node.appendChild(child);
}

// Remove um item de um nó com base no tipo da tag
function removeFrom({ node, index, tag = "li" }) {
  let item = node.querySelector(`${tag}:nth-child(${index + 1})`);

  if (item) {
    item.remove();
  }
}

// Transforma um node em um array de valores
function nodeToList({ nodeList, callBack }) {
  let array = Array.from(nodeList);

  if (callBack) {
    return array.map((v) => callBack(v));
  }

  return array;
}

/*------------------Elementos---------------------*/

// Inputs
let inputNomes = document.getElementById("add-nomes");
let sorteiosPorRodada = document.getElementById("total-sorteios");

// Participantes
let buttonAdd = document.getElementById("addNome");
let containerParticipantes = document.querySelector(".container-participants");
let listaParticipantes = document.getElementById("lista-participantes");

// Ganhadores
let containerGanhadores = document.querySelector(".container-last-winners");
let listaGanhadores = document.getElementById("lista-ganhadores");

/*------------------Lógica do Sorteio--------------------- */

localStorage.setItem("participantes", JSON.stringify([]));
localStorage.setItem("ganhadores", JSON.stringify([]));

function updateStorage({ key, item }) {
  localStorage.setItem(String(key), JSON.stringify(item));
}

function resetStorage() {
  let qtdItens = localStorage.length;

  for (let i = 0; i < qtdItens; i++) {
    let key = localStorage.key(i);
    localStorage.setItem(key, "");
  }
}

// Adiciona participante(s) na lista
function addParticipantes() {
  let jogadores = splitString(inputNomes.value);
  jogadores.forEach((j) => appendTo({ node: listaParticipantes, value: j }));

  inputNomes.value = "";
  containerParticipantes.style.display = "block";
}

// Sorteia um item
function sortear() {
  let arrayParticipantes = nodeToList({
    nodeList: listaParticipantes.childNodes,
    callBack: (x) => x.textContent,
  });

  let randomIndex = parseInt(Math.random() * arrayParticipantes.length);
  let ganhador = arrayParticipantes[randomIndex];

  removeFrom({ node: listaParticipantes, index: randomIndex });
  appendTo({ node: listaGanhadores, value: ganhador });

  return ganhador;
}

// Executa o Sorteio
function sorteio() {
  let ganhadores = [];

  for (let i = 0; i < sorteiosPorRodada.value; i++) {
    ganhadores.push(`${i + 1} - ${sortear()}`);
  }

  containerGanhadores.style.display = "block";
  return ganhadores;
}

/*------------------Conteúdo Dinâmico--------------------- */

const templateColunas = {
  alturaMaxColuna: 400,
  unidade: "px",
  qtdMaxColunas: 4,
};

function calcularColunas({ alturaMaxColuna, unidade, qtdMaxColunas, lista }) {
  /*
  display: grid;
  grid-auto-flow: column; 
  gap: 10px;
  grid-auto-rows: minmax(2rem, auto); 
  max-height: 400px;
  overflow-y: auto;
  justify-content: start;
  */

  const colunasAtuais = Math.ceil(lista.scrollHeight / alturaMaxColuna);
  if (colunasAtuais > qtdMaxColunas) {
    lista.style.maxHeight = `${
      alturaMaxColuna / (colunasAtuais / 4)
    }${unidade}`;
  }
}

buttonAdd.addEventListener("click", calcularColunas(templateColunas));

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
