/*------------------Funções Utilitárias--------------------- */

// Transforma uma String em um array separado por '\n'
function splitString(str = "") {
  return str.split("\n").map((v) => v.trim().replaceAll(/\s+/gimu, " "));
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
let containerParticipantes = document.querySelector(".container-participants");
let listaParticipantes = document.getElementById("lista-participantes");

// Ganhadores
let containerGanhadores = document.querySelector(".container-last-winners");
let listaGanhadores = document.getElementById("lista-ganhadores");

/*------------------Lógica do Sorteio--------------------- */

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
