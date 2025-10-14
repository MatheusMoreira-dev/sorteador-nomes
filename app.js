let inputTexto = document.getElementById("add-nomes");
let participantes = document.getElementById("lista-participantes");
let sorteiosPorRodada = document.getElementById("total-sorteios");

// modal
const modal = document.getElementById("modal");
const fecharModal = document.getElementById("fecharModal");
const ganhadoresRodada = document.getElementById("ganhadores-da-rodada");

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

// Adiciona participante(s) na lista de participantes
function addParticipantes() {
  let jogadores = splitString(inputTexto.value);
  jogadores.forEach((j) => appendTo({ node: participantes, value: j }));

  inputTexto.value = "";
}

// Sorteia um item
function sortear() {
  let arrayParticipantes = nodeToList({
    nodeList: participantes.childNodes,
    callBack: (x) => x.textContent,
  });
  let randomIndex = parseInt(Math.random() * arrayParticipantes.length);
  let ganhador = arrayParticipantes[randomIndex];

  removeFrom({ node: participantes, index: randomIndex });

  return ganhador;
}

// Sorteia a quantidade informada de sorteios por rodada
function sorteio() {
  return new Array(2).map((s, i) => `${i + 1} - ${sortear()}`);
}

// Preenche a lista automaticamente
function mostrarGanhadores() {
  ganhadoresRodada.innerHTML = ""; // limpa antes
  console.log(sorteio());
  sorteio().forEach((nome) => {
    const li = document.createElement("li");
    li.textContent = nome;
    ganhadoresRodada.appendChild(li);
  });
  modal.style.display = "flex";
}

// Fecha o modal
const closeModal = () => (modal.style.display = "none");

// Eventos
fecharModal.addEventListener("click", closeModal);

// Fecha ao clicar fora do modal
window.addEventListener("click", (e) => {
  if (e.target === modal) fechar();
});
