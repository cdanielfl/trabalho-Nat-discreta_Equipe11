document.getElementById('btn-calcular').addEventListener('click', calcular);

function calcular() {
  const placa = document.getElementById('placa').value.toUpperCase();
  const entrada = document.getElementById('entrada').value;
  const saida = document.getElementById('saida').value;
  const matriculaDigito = parseInt(document.getElementById('matricula').value);
  const resultadoDiv = document.getElementById('resultado');

  if (!placa.match(/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/)) {
    resultadoDiv.className = 'alert alert-danger';
    resultadoDiv.textContent = 'Formato da placa inválido.';
    resultadoDiv.classList.remove('d-none');
    return;
  }

  const prefixo = placa.slice(0, 3);

  let estado = 'Outro';
  if (prefixosAlagoas.includes(prefixo)) {
    estado = 'Alagoas';
  } else if (prefixosMatoGrossoSul.includes(prefixo)) {
    estado = 'Mato Grosso do Sul';
  } else if (prefixosRoraima.includes(prefixo)) {
    estado = 'Roraima';
  }

  const entradaMin = horaParaMinutos(entrada);
  const saidaMin = horaParaMinutos(saida);

  if (saidaMin <= entradaMin) {
    resultadoDiv.className = 'alert alert-danger';
    resultadoDiv.textContent = 'Horário de saída deve ser posterior ao de entrada.';
    resultadoDiv.classList.remove('d-none');
    return;
  }

  const duracao = saidaMin - entradaMin;

  let preco = 0;
  if (duracao <= 15) {
    preco = 0;
  } else if (duracao <= 180) {
    preco = 10;
  } else {
    const excedente = duracao - 180;
    const m = matriculaDigito / 100;
    const adicional = Math.ceil(excedente / 20) * (2 + m);
    preco = 10 + adicional;
  }

  const combinacoesAlagoas = prefixosAlagoas.length * 10 * 26 * 10 * 10;
  const combinacoesMS = prefixosMatoGrossoSul.length * 10 * 26 * 10 * 10;
  const combinacoesRoraima = prefixosRoraima.length * 10 * 26 * 10 * 10;

  resultadoDiv.className = 'alert alert-success text-start';
  resultadoDiv.innerHTML = `
    <p><strong>Estado da placa:</strong> ${estado}</p>
    <p><strong>Tempo total:</strong> ${Math.floor(duracao / 60)}h ${duracao % 60}min</p>
    <p><strong>Valor a pagar:</strong> R$ ${preco.toFixed(2)}</p>
    <hr>
    <p><strong>Placas possíveis por estado:</strong></p>
    <ul>
      <li>Alagoas: ${combinacoesAlagoas.toLocaleString()} placas</li>
      <li>Mato Grosso do Sul: ${combinacoesMS.toLocaleString()} placas</li>
      <li>Roraima: ${combinacoesRoraima.toLocaleString()} placas</li>
    </ul>
  `;
  resultadoDiv.classList.remove('d-none');
}

function horaParaMinutos(horaStr) {
  const [h, m] = horaStr.split(':').map(Number);
  return h * 60 + m;
}

function gerarPrefixosEstado(intervalos) {
  const prefixos = [];

  function proximo(pref) {
    let [a,b,c] = pref.split('').map(x => x.charCodeAt(0));
    c++;
    if (c > 90) { c = 65; b++; }
    if (b > 90) { b = 65; a++; }
    return String.fromCharCode(a,b,c);
  }

  for (const [start, end] of intervalos) {
    let cur = start;
    while (true) {
      prefixos.push(cur);
      if (cur === end) break;
      cur = proximo(cur);
    }
  }

  return prefixos;
}

// Intervalos REAIS de prefixos

const intervalosAlagoas = [
  ['MUA','MVK'], ['NLV','NMO'], ['ORD','ORM'], ['QLA','QLM'], ['QTT','QTT'],
  ['QWG','QWL'], ['RGO','RGZ'], ['SAA','SAJ'], ['TMH','TNQ'], ['OXN','OXN']
];

const intervalosMatoGrossoSul = [
  ['HQF','HTW'], ['QAA','QAZ'], ['OOG','OOU'], ['SLW','SML'], ['RWA','RWJ']
];

const intervalosRoraima = [
  ['NAH','NBA'], ['NUH','NUL'], ['RZA','RZD']
];

// Gerando prefixos válidos automaticamente
const prefixosAlagoas = gerarPrefixosEstado(intervalosAlagoas);
const prefixosMatoGrossoSul = gerarPrefixosEstado(intervalosMatoGrossoSul);
const prefixosRoraima = gerarPrefixosEstado(intervalosRoraima);