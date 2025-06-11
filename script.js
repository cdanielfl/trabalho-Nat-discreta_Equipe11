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
  const prefixosAlagoas = ['NML', 'NMM', 'NMN', 'NMO', 'NMP', 'NMQ', 'NMR', 'NMS', 'NMT', 'NMU'];
  const prefixosMatoGrossoSul = gerarIntervaloPrefixos('QAA', 'QEZ');
  const prefixosRoraima = ['NBR', 'NBS', 'NBT'];

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

  // Análise combinatória
  const combinacoesAlagoas = calcularCombinacoes(prefixosAlagoas);
  const combinacoesMS = calcularCombinacoes(prefixosMatoGrossoSul);
  const combinacoesRoraima = calcularCombinacoes(prefixosRoraima);

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

function gerarIntervaloPrefixos(inicio, fim) {
  const lista = [];
  for (let i = 65; i <= 90; i++) {
    for (let j = 65; j <= 90; j++) {
      for (let k = 65; k <= 90; k++) {
        const prefixo = String.fromCharCode(i) + String.fromCharCode(j) + String.fromCharCode(k);
        if (prefixo >= inicio && prefixo <= fim) {
          lista.push(prefixo);
        }
      }
    }
  }
  return lista;
}

function calcularCombinacoes(prefixos) {
  return prefixos.length * 10 * 26 * 10 * 10;
}
