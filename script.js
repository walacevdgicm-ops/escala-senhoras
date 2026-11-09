// ===== 0. TEMA CLARO / ESCURO =====
function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  document.querySelectorAll(".seletor-tema button").forEach(b => {
    b.setAttribute("aria-pressed", b.dataset.tema === tema ? "true" : "false");
  });
  // Cor da barra do navegador no celular
  document.querySelector('meta[name="theme-color"]')
    .setAttribute("content", tema === "escuro" ? "#2a0908" : "#b3261e");
  try { localStorage.setItem("tema", tema); } catch (e) {}
}

document.querySelectorAll(".seletor-tema button").forEach(b => {
  b.addEventListener("click", () => aplicarTema(b.dataset.tema));
});
aplicarTema(document.documentElement.dataset.tema || "claro");


// ===== 1. DADOS =====
const FUNCOES = ["Palavra", "Louvor", "Preparo"];
const DIAS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
              "Quinta-feira", "Sexta-feira", "Sábado"];
const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
               "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// Tabelas do manual: [Palavra, Louvor, Preparo]
const TABELAS = {
  3:  [[1,2,3], [2,3,1], [3,1,2]],
  4:  [[1,4,3,2], [2,1,4,3], [3,2,1,4]],
  5:  [[1,2,3,4,5], [3,4,5,2,1], [2,5,1,3,4]],
  6:  [[1,4,2,5,3,6], [2,5,3,6,4,1], [3,6,4,1,5,2]],
  7:  [[1,4,7,3,6,2,5], [2,5,1,4,7,3,6], [3,6,2,5,1,4,7]],
  8:  [[1,4,7,2,5,8,3,6], [2,5,8,3,6,1,4,7], [3,6,1,4,7,2,5,8]],
  9:  [[1,4,7,3,5,9,2,6,8], [2,6,8,1,4,7,3,5,9], [3,5,9,2,6,8,1,4,7]],
  10: [[1,2,3,4,5,6,7,8,9,10], [9,10,1,2,3,4,5,6,7,8], [3,4,5,6,7,8,9,10,1,2]],
  11: [[1,2,3,4,5,6,7,8,9,10,11], [4,5,6,7,8,9,10,11,1,2,3], [9,10,11,1,2,3,4,5,6,7,8]],
  12: [[1,2,3,4,5,6,7,8,9,10,11,12], [5,6,7,8,9,10,11,12,1,2,3,4], [9,10,11,12,1,2,3,4,5,6,7,8]]
};

// Variáveis que guardam o que a usuária preencheu
let quantidade = 4;
let nomes = [];
let escala = [];
let anoEscolhido = new Date().getFullYear();
let diaEscolhido = 0;


// ===== 2. LÓGICA DO RODÍZIO =====
function obterRodizio(n) {
  if (TABELAS[n]) return TABELAS[n];            // 3 a 12: tabela do manual

  // Mais de 12: fórmula
  const saltoLouvor = Math.floor(n / 3);
  const saltoPreparo = Math.floor((2 * n) / 3);
  const palavra = [], louvor = [], preparo = [];
  for (let s = 0; s < n; s++) {
    palavra.push(s + 1);
    louvor.push(((s + saltoLouvor) % n) + 1);
    preparo.push(((s + saltoPreparo) % n) + 1);
  }
  return [palavra, louvor, preparo];
}

// Todas as datas do ano que caem no dia da semana escolhido
function datasDoAno(ano, diaSemana) {
  const datas = [];
  const data = new Date(ano, 0, 1);                       // 1º de janeiro
  while (data.getDay() !== diaSemana) data.setDate(data.getDate() + 1);
  while (data.getFullYear() === ano) {
    datas.push(new Date(data));
    data.setDate(data.getDate() + 7);                     // próxima semana
  }
  return datas;
}

// A 5ª semana do mês é qualquer data depois do dia 28
function ehQuintaSemana(data) {
  return data.getDate() > 28;
}

// Junta datas + rodízio + nomes
// A 5ª semana fica em aberto (escolha espontânea) e NÃO conta no rodízio
function montarEscala(ano, diaSemana) {
  const rodizio = obterRodizio(quantidade);
  let posicao = 0;                                        // só anda nas semanas escaladas
  return datasDoAno(ano, diaSemana).map(data => {
    if (ehQuintaSemana(data)) {
      return { data: data, aberta: true };
    }
    const semana = posicao % quantidade;                  // o rodízio recomeça
    posicao++;
    return {
      data: data,
      aberta: false,
      semana: semana + 1,
      palavra: nomes[rodizio[0][semana] - 1],
      louvor:  nomes[rodizio[1][semana] - 1],
      preparo: nomes[rodizio[2][semana] - 1]
    };
  });
}

function formatarData(d) {
  return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0");
}

// Evita que um nome com < ou > quebre a tabela
function escapar(texto) {
  return String(texto).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}


// ===== 3. NAVEGAÇÃO =====
function mostrarPasso(id) {
  document.querySelectorAll("main section").forEach(s => s.hidden = (s.id !== id));
  window.scrollTo(0, 0);
}

document.querySelectorAll("[data-voltar]").forEach(botao => {
  botao.addEventListener("click", () => mostrarPasso(botao.dataset.voltar));
});

// --- Etapa 1: quantidade ---
document.getElementById("btnPasso1").addEventListener("click", () => {
  const valor = parseInt(document.getElementById("quantidade").value, 10);
  const erro = document.getElementById("erroQtd");
  if (isNaN(valor) || valor < 3) {
    erro.textContent = "Informe pelo menos 3 irmãs.";
    return;
  }
  erro.textContent = "";
  quantidade = valor;
  nomes.length = quantidade;        // mantém os nomes já digitados
  criarCamposNomes();
  mostrarPasso("passo2");
});

// --- Etapa 2: nomes ---
function criarCamposNomes() {
  const rodizio = obterRodizio(quantidade);
  const lista = document.getElementById("listaNomes");
  lista.innerHTML = "";

  for (let i = 0; i < quantidade; i++) {
    // Em que semana a irmã i+1 faz cada função
    const dica = FUNCOES
      .map((funcao, k) => funcao + ": " + (rodizio[k].indexOf(i + 1) + 1) + "ª semana")
      .join(" · ");

    const campo = document.createElement("label");
    campo.className = "campo-nome";
    campo.innerHTML = `Irmã ${i + 1}
      <input type="text" placeholder="Nome da irmã">
      <small>${dica}</small>`;

    const input = campo.querySelector("input");
    input.value = nomes[i] || "";
    input.addEventListener("input", () => {
      nomes[i] = input.value;
      desenharRodizio();
    });
    lista.appendChild(campo);
  }
  desenharRodizio();
}

function desenharRodizio() {
  const rodizio = obterRodizio(quantidade);
  let html = "<tr><th>Rodízio</th>";
  for (let s = 1; s <= quantidade; s++) html += `<th>${s}ª</th>`;
  html += "</tr>";

  FUNCOES.forEach((funcao, k) => {
    html += `<tr><td class="funcao">${funcao}</td>`;
    rodizio[k].forEach(num => {
      html += `<td>${escapar((nomes[num - 1] || "").trim() || num)}</td>`;
    });
    html += "</tr>";
  });
  document.getElementById("tabelaRodizio").innerHTML = html;
}

document.getElementById("btnPasso2").addEventListener("click", () => {
  const erro = document.getElementById("erroNomes");
  const lista = nomes.slice(0, quantidade).map(n => (n || "").trim());

  if (lista.some(n => n === "")) {
    erro.textContent = "Preencha o nome de todas as irmãs.";
    return;
  }
  const repetido = lista.find((n, i) =>
    lista.findIndex(m => m.toLowerCase() === n.toLowerCase()) !== i);
  if (repetido) {
    erro.textContent = "Nome repetido: " + repetido;
    return;
  }
  erro.textContent = "";
  nomes = lista;
  mostrarPasso("passo3");
});


// ===== 4. ETAPA 3 E 4 =====
document.getElementById("ano").value = anoEscolhido;

document.getElementById("btnPasso3").addEventListener("click", () => {
  anoEscolhido = parseInt(document.getElementById("ano").value, 10);
  const dia = parseInt(document.getElementById("diaSemana").value, 10);

  diaEscolhido = dia;
  escala = montarEscala(anoEscolhido, dia);   // sempre o ano inteiro

  atualizarPeriodo();
  mostrarPasso("passo4");
});

// --- Período para imprimir (meses de início e fim, contando janeiro = 0) ---
const PERIODOS = {
  ano: { nome: "Anual",         arquivo: "anual",          de: 0, ate: 11 },
  s1:  { nome: "1º semestre",   arquivo: "1-semestre",     de: 0, ate: 5 },
  s2:  { nome: "2º semestre",   arquivo: "2-semestre",     de: 6, ate: 11 },
  t1:  { nome: "1º trimestre",  arquivo: "1-trimestre",    de: 0, ate: 2 },
  t2:  { nome: "2º trimestre",  arquivo: "2-trimestre",    de: 3, ate: 5 },
  t3:  { nome: "3º trimestre",  arquivo: "3-trimestre",    de: 6, ate: 8 },
  t4:  { nome: "4º trimestre",  arquivo: "4-trimestre",    de: 9, ate: 11 }
};

function periodoEscolhido() {
  return PERIODOS[document.getElementById("periodo").value] || PERIODOS.ano;
}

// Só as linhas da escala anual que caem no período escolhido
function escalaDoPeriodo() {
  const p = periodoEscolhido();
  return escala.filter(l => l.data.getMonth() >= p.de && l.data.getMonth() <= p.ate);
}

function atualizarPeriodo() {
  const p = periodoEscolhido();
  const lista = escalaDoPeriodo();
  const abertas = lista.filter(l => l.aberta).length;
  document.getElementById("resumo").textContent =
    `${p.nome} ${anoEscolhido} · ${DIAS[diaEscolhido]} · ${quantidade} irmãs · ` +
    `${lista.length - abertas} encontros escalados · ${abertas} em aberto (5ª semana)`;
  desenharEscala();
}

document.getElementById("periodo").addEventListener("change", atualizarPeriodo);

function desenharEscala() {
  let html = "<tr><th>Data</th><th class=\"col-rodizio\">Rodízio</th><th>Palavra</th><th>Louvor</th><th>Preparo</th></tr>";
  let mesAtual = -1;

  escalaDoPeriodo().forEach(linha => {
    const mes = linha.data.getMonth();
    if (mes !== mesAtual) {                         // linha com o nome do mês
      mesAtual = mes;
      html += `<tr class="mes"><td colspan="5">${MESES[mes]}</td></tr>`;
    }
    if (linha.aberta) {                             // 5ª semana: sem escala
      html += `<tr class="aberta">
        <td>${formatarData(linha.data)}</td>
        <td class="col-rodizio">—</td>
        <td colspan="3">Em aberto · escolha espontânea</td>
      </tr>`;
      return;
    }
    html += `<tr>
      <td>${formatarData(linha.data)}</td>
      <td class="col-rodizio">${linha.semana}ª</td>
      <td>${escapar(linha.palavra)}</td>
      <td>${escapar(linha.louvor)}</td>
      <td>${escapar(linha.preparo)}</td>
    </tr>`;
  });
  document.getElementById("tabelaEscala").innerHTML = html;
}


// ===== 5. PDF =====
document.getElementById("btnPDF").addEventListener("click", gerarPDF);

// Faixa vermelha no topo de cada página, com o logo (papel timbrado)
function cabecalho(doc, titulo, subtitulo, cor) {
  doc.setFillColor(...cor);
  doc.rect(0, 0, 210, 30, "F");
  doc.setFillColor(143, 29, 23);                  // filete mais escuro embaixo
  doc.rect(0, 30, 210, 1.2, "F");

  let x = 14;
  if (typeof LOGO_PDF !== "undefined") {
    doc.addImage(LOGO_PDF, "PNG", 12, 4, 22, 22);
    x = 40;
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(titulo, x, 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(doc.splitTextToSize(subtitulo, 196 - x), x, 19.5);
}

function gerarPDF() {
  if (!window.jspdf) {
    alert("Não foi possível carregar o gerador de PDF. Verifique sua internet.");
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const VERMELHO = [179, 38, 30];
  const titulo = document.getElementById("titulo").value.trim() || "Escala do Trabalho de Senhoras";
  const subtitulo = document.getElementById("resumo").textContent;

  const estilo = {
    theme: "grid",
    startY: 38,
    margin: { top: 38, left: 14, right: 14, bottom: 16 },
    styles: { fontSize: 10, cellPadding: 2, lineColor: [225, 200, 200], lineWidth: 0.2 },
    headStyles: { fillColor: VERMELHO, textColor: 255 }
  };

  const periodo = periodoEscolhido();
  const lista = escalaDoPeriodo();

  // --- Parte 1: escala do período ---
  const corpo = [];
  let mesAtual = -1;
  lista.forEach(l => {
    const mes = l.data.getMonth();
    if (mes !== mesAtual) {
      mesAtual = mes;
      corpo.push([{
        content: MESES[mes].toUpperCase(), colSpan: 5,
        styles: { fillColor: [251, 236, 235], textColor: VERMELHO, fontStyle: "bold" }
      }]);
    }
    if (l.aberta) {
      corpo.push([formatarData(l.data), "—", {
        content: "Em aberto · escolha espontânea", colSpan: 3,
        styles: { halign: "center", fontStyle: "italic", textColor: [120, 110, 110] }
      }]);
      return;
    }
    corpo.push([formatarData(l.data), l.semana + "ª", l.palavra, l.louvor, l.preparo]);
  });

  doc.autoTable({
    ...estilo,
    head: [["Data", "Rodízio", "Palavra", "Louvor", "Preparo"]],
    body: corpo,
    columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 20, halign: "center" } },
    didDrawPage: () => cabecalho(doc, titulo, subtitulo, VERMELHO)
  });

  // --- Parte 2: datas de cada irmã ---
  doc.addPage();
  const porIrma = nomes.map(nome => [
    nome,
    ...["palavra", "louvor", "preparo"].map(funcao =>
      lista.filter(l => l[funcao] === nome).map(l => formatarData(l.data)).join(", ") || "—")
  ]);

  doc.autoTable({
    ...estilo,
    head: [["Irmã", "Palavra", "Louvor", "Preparo"]],
    body: porIrma,
    columnStyles: { 0: { cellWidth: 35, fontStyle: "bold" } },
    didDrawPage: () => cabecalho(doc, titulo,
      `Datas de cada irmã · ${periodo.nome} ${anoEscolhido}`, VERMELHO)
  });

  // --- Número das páginas ---
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`Página ${p} de ${total}`, 196, 290, { align: "right" });
  }

  doc.save(`escala-senhoras-${anoEscolhido}-${periodo.arquivo}.pdf`);
}