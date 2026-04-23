const refeicoes = ["CAFÉ", "ALMOÇO", "JANTAR"];
const siglas = { "CAFÉ": "C", "ALMOÇO": "A", "JANTAR": "J" };
const estados = {};
const diaHoje = new Date();
const pelotoes = ["A","B","C","D","E","F","G","H"]
const numeros = ["5519997592887","554188636039","5527992967466","556183483213","5511933562543","5515998251032"]

const meses = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];

const anoCFO = document.getElementById("anoCFO");
const pelotinho = document.getElementById("pelotinho");

const opcoesPelotao = {
  "1": ["A", "B", "C","D","E","F"],
  "2": ["D", "E"],
  "3": ["F", "G"],
  "4": ["H"]
};

function atualizarPelotao() {
  const anoSelecionado = anoCFO.value;

  pelotinho.innerHTML = "";

  if (opcoesPelotao[anoSelecionado]) {
    opcoesPelotao[anoSelecionado].forEach((letra, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = letra;
      pelotinho.appendChild(option);
    });
  }
}


anoCFO.addEventListener("change", atualizarPelotao);
document.addEventListener("DOMContentLoaded", function () {
  anoCFO.value = "1";
  atualizarPelotao();
});





function formatarDataMilitar(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = meses[data.getMonth()];
  const ano = String(data.getFullYear()).slice(-2);
  return `${dia}${mes}${ano}`;
}

function getInicioSemana(data) {
  const dia = data.getDay();
  const diff = data.getDate() - dia + (dia === 0 ? -6 : 1);
  return new Date(data.setDate(diff));
}

function zerarHora(data) {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

const hojeZerado = zerarHora(diaHoje);
const passouDas13 = diaHoje.getHours() >= 13;
const amanha = new Date(hojeZerado);
amanha.setDate(hojeZerado.getDate() + 1);

function criarSemana(inicio, tituloSemana) {
  const divSemana = document.createElement("div");
  divSemana.className = "semana";

  const gridWrapper = document.createElement("div");
  gridWrapper.className = "grid-wrapper";

  const titulo = document.createElement("h2");
  titulo.textContent = tituloSemana;
  divSemana.appendChild(titulo);

  for (let i = 0; i < 7; i++) {
    const diaData = new Date(inicio);
    diaData.setDate(inicio.getDate() + i);

    const diaDiv = document.createElement("div");
    diaDiv.className = "dia";

    const diasSemana = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
    const nomeDia = diasSemana[diaData.getDay()];
    const dia = String(diaData.getDate()).padStart(2, '0');
    const mes = meses[diaData.getMonth()];

    const label = document.createElement("strong");
    label.textContent = `${nomeDia} ${dia}${mes}`;
    diaDiv.appendChild(label);

    refeicoes.forEach(ref => {
      const btn = document.createElement("button");
      btn.textContent = ref;

      const chave = `${formatarDataMilitar(diaData)}_${ref}`;
      estados[chave] = 0;

      const dataLoopZerada = zerarHora(diaData);

      const ehPassado = dataLoopZerada < hojeZerado;
      const ehHoje = dataLoopZerada.getTime() === hojeZerado.getTime();
      const ehAmanha = dataLoopZerada.getTime() === amanha.getTime();

      if (ehPassado || ehHoje || (ehAmanha && passouDas13)) {
        btn.classList.add("cinza");
        btn.disabled = true;
      }
      btn.onclick = () => {
        estados[chave] = (estados[chave] + 1) % 3;

        btn.classList.remove("add", "remove");

        if (estados[chave] === 1) btn.classList.add("add");
        if (estados[chave] === 2) btn.classList.add("remove");
      };

      diaDiv.appendChild(btn);
    });
    console.log(diaData+"  "+diaHoje)
    gridWrapper.appendChild(diaDiv);
    
  }
  divSemana.appendChild(gridWrapper);
  return divSemana;
}

function gerarMensagem() {
  const nome = document.getElementById("QRA").value.trim();
  const motivo = document.getElementById("motivo").value.trim();
  const cfo = document.getElementById("anoCFO").value;
  const pelotao =document.getElementById("pelotinho").selectedOptions[0].text;
  const CIA = document.getElementById("companhia").value;


  if (!nome) {
    alert("Por favor, preencha o QRA antes de gerar a mensagem.");
    return;
  }

  if (!motivo) {
    alert("Por favor, informe o MOTIVO da alteração.");
    return;
  }

  if (!pelotao) {
    alert("Por favor, informe o seu PELOTÃO.");
    return;
  }

  let adicionarPorDia = {};
  let removerPorDia = {};

  for (let chave in estados) {
    const [data, ref] = chave.split("_");

    if (estados[chave] === 1) {
      if (!adicionarPorDia[data]) {
        adicionarPorDia[data] = [];
      }
      adicionarPorDia[data].push(siglas[ref]);
    }

    if (estados[chave] === 2) {
      if (!removerPorDia[data]) {
        removerPorDia[data] = [];
      }
      removerPorDia[data].push(siglas[ref]);
    }
  }

  let msg = "*Alteração de rancho "+`${cfo}º "${pelotao}" ${CIA}°CIA ES.*\n\n`;
  msg +="Al Of PM "+`${nome}\n\n`;

  // ADICIONAR
  if (Object.keys(adicionarPorDia).length > 0) {
    msg += `*ADICIONAR*\n`;
    for (let data in adicionarPorDia) {
      msg += `${data}: ${adicionarPorDia[data].join(",")}\n`;
    }
    msg += `\n`;
  }

  // REMOVER
  if (Object.keys(removerPorDia).length > 0) {
    msg += `*REMOVER*\n`;
    for (let data in removerPorDia) {
      msg += `${data}: ${removerPorDia[data].join(",")}\n`;
    }
    msg += `\n`;
  }

  msg += `Motivo: ${motivo}`;

document.getElementById("resultado").textContent = msg;

// Remove botão antigo se existir
const antigo = document.getElementById("btnWhatsapp");
if (antigo) antigo.remove();

// Criar botão
const btn = document.createElement("button");
btn.id = "btnWhatsapp";
btn.textContent = "Enviar para o WhatsApp";

var numero=1
if (cfo==1){
  numero=numeros[document.getElementById("pelotinho").value.trim()];
} else {
  numero="5519997592887"
}
const texto = encodeURIComponent(msg);
const link = `https://wa.me/${numero}?text=${texto}`;

btn.onclick = () => {
  window.open(link, "_blank");
};

document.body.appendChild(btn);
}

const hoje = new Date();
const inicioAtual = getInicioSemana(new Date(hoje));
const inicioProxima = new Date(inicioAtual);
inicioProxima.setDate(inicioAtual.getDate() + 7);

const container = document.getElementById("container");
container.appendChild(criarSemana(inicioAtual, "📅 SEMANA ATUAL"));
container.appendChild(criarSemana(inicioProxima, "📅 PRÓXIMA SEMANA"));

setInterval(() => {
  location.reload();
}, 60000);
