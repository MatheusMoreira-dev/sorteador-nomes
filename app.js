let participantes = [];
let ganhadores = [];

let inputTexto = document.getElementById("add-nomes");
let listaNomes = document.getElementById("lista-nomes");

function splitString(str = "") {
  return str.split("\n").map((v) => v.trim().replaceAll(/\s+/gimu, " "));
}

function addNome(str = "") {
  let item = document.createElement("li");
  item.textContent = str;

  participantes.push(str);
  listaNomes.appendChild(item);
}

function atualizarLista() {
  let novosJogadores = splitString(inputTexto.value);
  novosJogadores.forEach((v) => addNome(v));

  inputTexto.value = "";
}

function sortearNome() {
  let numeroAleatorio = parseInt(Math.random() * participantes.length);
  let nomeAleatorio = participantes[numeroAleatorio];

  participantes.splice(numeroAleatorio, 1);
  ganhadores.push(nomeAleatorio);

  console.log({ nome: nomeAleatorio, pos: numeroAleatorio });
}
