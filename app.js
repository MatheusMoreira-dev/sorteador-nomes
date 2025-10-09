let participantes = [];
let ganhadores = [];

let inputTexto = document.getElementById("add-nomes");
let listaNomes = document.getElementById("lista-nomes");
let qtdSorteios = document.getElementById("total-sorteios");

function splitString(str = "") {
  return str.split("\n").map((v) => v.trim().replaceAll(/\s+/gimu, " "));
}

function addNome(str = "") {
  let item = document.createElement("li");
  item.textContent = str;

  participantes.push(str);
  listaNomes.appendChild(item);
}

function appendListaNomes() {
  let novosJogadores = splitString(inputTexto.value);
  novosJogadores.forEach((v) => addNome(v));

  inputTexto.value = "";
}

function removeFromListaNomes(index) {
  let item = document.querySelector(`li:nth-child(${index + 1})`);

  if (item) {
    item.remove();
  }
}

function sortearNome() {
  let randomIndex = parseInt(Math.random() * participantes.length);
  let ganhador = participantes[randomIndex];

  removeFromListaNomes(randomIndex);
  participantes.splice(randomIndex, 1);
  ganhadores.push(ganhador);

  return ganhador;
}

function mostrarResultado() {}

function executarSorteio() {
  for (let i = 0; i < Number(qtdSorteios.value); i++) {
    sortearNome();
  }
}
