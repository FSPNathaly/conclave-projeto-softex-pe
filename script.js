// =============================================
// VARIÁVEIS GLOBAIS
// =============================================

// Array para armazenar os cardeais (vetor de objetos)
let cardeais = [];

// Array para contar os votos (vetor de números)
let votos = [];

// Array para contar os votos da rodada atual
let votosRodada = [];

// Variável para armazenar o cardeal selecionado para votação
let cardealSelecionado = null;

// Contador de votos na rodada atual
let votosComputados = 0;

// =============================================
// ELEMENTOS DO DOM
// =============================================

// Seções da aplicação
const cadastroSection = document.getElementById('cadastro-section');
const votacaoSection = document.getElementById('votacao-section');
const resultadoSection = document.getElementById('resultado-section');

// Botões
const iniciarBtn = document.getElementById('iniciar-btn');
const votarBtn = document.getElementById('votar-btn');
const encerrarBtn = document.getElementById('encerrar-btn');
const novaVotacaoBtn = document.getElementById('nova-votacao-btn');

// Containers de conteúdo
const opcoesVotacao = document.getElementById('opcoes-votacao');
const resultadoContainer = document.getElementById('resultado-container');

// Inputs de cadastro
const cardealInputs = document.querySelectorAll('.cardeal-input');

// =============================================
// INICIALIZAÇÃO DA APLICAÇÃO
// =============================================

// Quando o documento estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar eventos aos inputs para habilitar o botão de iniciar
    cardealInputs.forEach(input => {
        input.addEventListener('input', verificarCamposPreenchidos);
    });

    // Configurar eventos dos botões
    iniciarBtn.addEventListener('click', iniciarVotacao);
    votarBtn.addEventListener('click', processarVoto);
    encerrarBtn.addEventListener('click', encerrarVotacao);
    novaVotacaoBtn.addEventListener('click', novaRodadaVotacao);
});

// =============================================
// FUNÇÕES DA APLICAÇÃO
// =============================================

/**
 * Verifica se todos os campos de cadastro estão preenchidos
 * e habilita o botão de iniciar votação se estiverem
 */
function verificarCamposPreenchidos() {
    // Verifica se todos os inputs têm valor
    const todosPreenchidos = Array.from(cardealInputs).every(input => input.value.trim() !== '');

    // Habilita ou desabilita o botão
    iniciarBtn.disabled = !todosPreenchidos;
}

/**
 * Inicia o processo de votação após o cadastro dos cardeais
 */
function iniciarVotacao() {
    // 1. Coletar os nomes dos cardeais dos inputs
    cardeais = [];
    for (let i = 1; i <= 5; i++) {
        const nome = document.getElementById(`cardeal${i}`).value.trim();
        // Adiciona um objeto representando o cardeal ao array
        cardeais.push({
            id: i,
            nome: nome
        });
    }

    // 2. Inicializar os arrays de votos
    votos = Array(5).fill(0); // Zera todos os votos
    votosRodada = Array(5).fill(0); // Zera os votos da rodada
    votosComputados = 0; // Reinicia o contador

    // 3. Preparar a interface para votação
    cadastroSection.classList.remove('active');
    votacaoSection.classList.add('active');

    // 4. Exibir as opções de votação
    exibirOpcoesVotacao();
}

/**
 * Exibe as opções de votação na tela
 */
function exibirOpcoesVotacao() {
    // Limpa o container de opções
    opcoesVotacao.innerHTML = '';

    // Para cada cardeal, cria um elemento de opção
    cardeais.forEach(cardeal => {
        const div = document.createElement('div');
        div.className = 'cardeal-option';
        div.dataset.id = cardeal.id;
        div.innerHTML = `${cardeal.id} - ${cardeal.nome}`;

        // Adiciona evento de clique para selecionar o cardeal
        div.addEventListener('click', function() {
            // Remove a seleção anterior
            const selecionadoAnterior = document.querySelector('.cardeal-option.selected');
            if (selecionadoAnterior) {
                selecionadoAnterior.classList.remove('selected');
            }

            // Seleciona o cardeal atual
            this.classList.add('selected');
            cardealSelecionado = cardeal.id;
        });

        // Adiciona a opção ao container
        opcoesVotacao.appendChild(div);
    });
}

/**
 * Processa um voto para o cardeal selecionado
 */
function processarVoto() {
    // Verifica se um cardeal foi selecionado
    if (cardealSelecionado === null) {
        alert('Por favor, selecione um cardeal para votar.');
        return;
    }

    // Registra o voto
    const indice = cardealSelecionado - 1; // Ajusta o índice (array começa em 0)
    votos[indice]++;
    votosRodada[indice]++;
    votosComputados++;

    // Feedback para o usuário
    alert(`Voto em ${cardeais[indice].nome} registrado com sucesso!`);

    // Limpa a seleção
    const selecionado = document.querySelector('.cardeal-option.selected');
    if (selecionado) {
        selecionado.classList.remove('selected');
    }
    cardealSelecionado = null;

    // Verifica se todos os 5 votos foram computados
    if (votosComputados >= 5) {
        alert('Todos os 5 votos foram computados. Clique em "Encerrar Votação" para ver os resultados.');
        votarBtn.disabled = true;
    }
}

/**
 * Encerra a votação e calcula os resultados
 */
function encerrarVotacao() {
    // Atualiza a interface
    votacaoSection.classList.remove('active');
    resultadoSection.classList.add('active');

    // Calcula o total de votos e votos necessários para vitória
    const totalVotos = votos.reduce((acc, curr) => acc + curr, 0);
    const votosNecessarios = Math.ceil((2 / 3) * totalVotos);

    // Verifica se há um vencedor
    let vencedor = -1;
    for (let i = 0; i < votos.length; i++) {
        if (votos[i] >= votosNecessarios) {
            vencedor = i;
            break;
        }
    }

    // Exibe os resultados
    exibirResultados(vencedor, votosNecessarios);
}

/**
 * Exibe os resultados da votação na tela
 * @param {number} vencedor - Índice do cardeal vencedor (-1 se não houver)
 * @param {number} votosNecessarios - Número de votos necessários para vencer
 */
function exibirResultados(vencedor, votosNecessarios) {
    // Limpa o container de resultados
    resultadoContainer.innerHTML = '';

    // Título dos resultados
    const resultadoTitulo = document.createElement('h4');
    resultadoTitulo.textContent = 'Total de Votos:';
    resultadoContainer.appendChild(resultadoTitulo);

    // Para cada cardeal, exibe seu resultado
    cardeais.forEach((cardeal, index) => {
        const div = document.createElement('div');
        div.className = 'resultado-item';

        // Destaca o vencedor, se houver
        if (index === vencedor) {
            div.classList.add('vencedor');
        }

        div.textContent = `${cardeal.id} - ${cardeal.nome}: ${votos[index]} votos`;
        resultadoContainer.appendChild(div);
    });

    // Informações adicionais
    const infoDiv = document.createElement('div');
    infoDiv.style.marginTop = '15px';
    infoDiv.innerHTML = `
        <p><strong>Total de votos acumulados:</strong> ${votos.reduce((acc, curr) => acc + curr, 0)}</p>
        <p><strong>Votos necessários para eleição:</strong> ${votosNecessarios}</p>
    `;
    resultadoContainer.appendChild(infoDiv);

    // Mensagem de resultado
    const mensagemDiv = document.createElement('div');
    mensagemDiv.style.marginTop = '15px';
    mensagemDiv.style.padding = '15px';

    if (vencedor !== -1) {
        // Há um vencedor
        mensagemDiv.style.backgroundColor = '#d4edda';
        mensagemDiv.style.borderLeft = '4px solid #28a745';
        mensagemDiv.innerHTML = `
            <h4>RESULTADO FINAL</h4>
            <p>O Cardeal <strong>${cardeais[vencedor].nome}</strong> foi eleito Papa com ${votos[vencedor]} votos!</p>
        `;
        novaVotacaoBtn.style.display = 'none';
    } else {
        // Não há vencedor
        mensagemDiv.style.backgroundColor = '#fff3cd';
        mensagemDiv.style.borderLeft = '4px solid #ffc107';
        mensagemDiv.innerHTML = `
            <h4>SEM VENCEDOR</h4>
            <p>Nenhum cardeal obteve os 2/3 dos votos necessários (${votosNecessarios} votos).</p>
            <p>Inicie uma nova rodada de votação.</p>
        `;
        novaVotacaoBtn.style.display = 'block';
    }

    resultadoContainer.appendChild(mensagemDiv);
}

/**
 * Inicia uma nova rodada de votação
 */
function novaRodadaVotacao() {
    // Reinicia os votos da rodada, mas mantém o total
    votosRodada = Array(5).fill(0);
    votosComputados = 0;

    // Atualiza a interface
    resultadoSection.classList.remove('active');
    votacaoSection.classList.add('active');

    // Reativa o botão de votar
    votarBtn.disabled = false;

    // Limpa seleção anterior
    cardealSelecionado = null;
    const selecionado = document.querySelector('.cardeal-option.selected');
    if (selecionado) {
        selecionado.classList.remove('selected');
    }

    // Exibe as opções de votação novamente
    exibirOpcoesVotacao();
}