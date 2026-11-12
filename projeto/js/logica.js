/*
       um quiz com perguntas sobre o Snoopy, o Charlie Brown e
        o resto da turma (as respostas estão na própria página
        "Personagens e Curiosidades").
 
       o nível do jogo (1, 2 ou 3), lido com prompt, e depois
           as respostas do jogador (1, 2 ou 3) a cada pergunta,
           até acabarem as perguntas ou ele digitar "sair".
 
       filtra as perguntas pelo nível, repete as
           perguntas com while (cada uma com até 2 tentativas),
           classifica cada resposta (if / else if / else), mostra
           uma curiosidade de acordo com o tema (switch) e resume
           o jogo (contador, acumulador e média).
 
       alertas durante o jogo e, no final, frases com template
         literal e um relatório com console.table (aperte F12).
 
  PSEUDOCÓDIGO:
  1. Declarar as perguntas (pergunta, opções, certa, nível, tema...)
  2. Pedir o nível e validar (null, vazio, NaN, faixa)
  3. Separar as perguntas cujo nível seja menor ou igual ao escolhido
     e embaralhar a ordem delas (Fisher-Yates com Math.random)
  4. Enquanto houver pergunta e o jogador não digitou "sair":
       fazer a pergunta (até 2 tentativas) e guardar o resultado
       mostrar a curiosidade do tema (switch)
  5. Para cada resposta guardada: classificar em
     "De primeira", "Na segunda" ou "Errou" e dar os pontos
  6. Resumir: contar acertos, somar pontos e calcular a média de
     tentativas; o percentual é sobre TODAS as perguntas do nível,
     então as que não foram respondidas contam como 0 pontos
  7. Mostrar frases com o título do jogador e o console.table
 
  TESTE DE MESA 
  Volta | pergunta                | tentativas | acertou | classificação | pontos acumulados
 ------|-------------------------|------------|---------|---------------|------------------
    1   | Raça do Snoopy          |     2      |   sim   | Na segunda    | 5
    2   | Dono do Snoopy          |     1      |   sim   | De primeira   | 15
    3   | Nome do passarinho      |     1      |   sim   | De primeira   | 25

 */


const perguntas = [
    {
        pergunta: "Qual é a raça do Snoopy?",
        opcoes: ["Poodle", "Beagle", "Bulldog"],
        certa: 2,
        nivel: 1,
        tema: "snoopy",
        explicacao: "Snoopy é um beagle, inspirado no Spike, cachorro que Charles M. Schulz teve na infância."
    },
    {
        pergunta: "Quem é o dono do Snoopy?",
        opcoes: ["Linus", "Schroeder", "Charlie Brown"],
        certa: 3,
        nivel: 1,
        tema: "charlie",
        explicacao: "Charlie Brown é o dono do Snoopy e tem uma personalidade bem insegura."
    },
    {
        pergunta: "Qual é o nome do passarinho amigo do Snoopy?",
        opcoes: ["Woodstock", "Stockwood", "Bilu"],
        certa: 1,
        nivel: 1,
        tema: "snoopy",
        explicacao: "Woodstock é o melhor amigo do Snoopy e tem uma linguagem própria."
    },
    {
        pergunta: "O que o Linus carrega para todo lado?",
        opcoes: ["Um piano", "Um cobertor", "Um violão"],
        certa: 2,
        nivel: 2,
        tema: "turma",
        explicacao: "Linus sempre carrega um cobertor de segurança."
    },
    {
        pergunta: "Qual compositor o Schroeder adora?",
        opcoes: ["Beethoven", "Mozart", "Bach"],
        certa: 1,
        nivel: 2,
        tema: "turma",
        explicacao: "Schroeder é apaixonado por música clássica, especialmente Beethoven."
    },
    {
        pergunta: "Quem é a irmã mais nova do Charlie Brown?",
        opcoes: ["Lucy", "Sally", "Eudora"],
        certa: 2,
        nivel: 2,
        tema: "charlie",
        explicacao: "Sally Brown é a irmã mais nova do Charlie Brown."
    },
    {
        pergunta: "Qual é o alter ego mais famoso do Snoopy, o Ás da Aviação de qual guerra?",
        opcoes: ["Primeira Guerra Mundial", "Segunda Guerra Mundial", "Guerra Fria"],
        certa: 1,
        nivel: 3,
        tema: "snoopy",
        explicacao: "O Ás da Aviação da Primeira Guerra Mundial é o alter ego mais famoso do Snoopy."
    },
    {
        pergunta: "Até que ano Charles M. Schulz desenhou as tirinhas do Peanuts?",
        opcoes: ["1990", "2000", "2010"],
        certa: 2,
        nivel: 3,
        tema: "criador",
        explicacao: "Schulz desenhou todas as tirinhas pessoalmente por quase 50 anos, até se aposentar em 2000."
    }
];

const embaralharPerguntas = true;


function embaralhar(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const guardado = lista[i];
        lista[i] = lista[j];
        lista[j] = guardado;
    }
}


function pedirNivel() {
    let nivelValido = null;
    let continuar = true;

    while (continuar) {
        const resposta = prompt(
            "Escolha o seu nível:\n" +
            "1) Filhote (perguntas fáceis)\n" +
            "2) Beagle (fáceis e médias)\n" +
            "3) Ás da Aviação (todas as perguntas)"
        );

        if (resposta === null) {
            // Cancelar
            continuar = false;
        } else if (resposta.trim() === "") {
            alert("Você não digitou nada. Tente de novo.");
        } else {
            const numero = Number(resposta);

            if (Number.isNaN(numero)) {
                alert("Digite apenas números.");
            } else if (!Number.isInteger(numero) || numero < 1 || numero > 3) {
                alert("Digite 1, 2 ou 3.");
            } else {
                nivelValido = numero;
                continuar = false;
            }
        }
    }

    return nivelValido;
}


function montarTexto(item, tentativas) {
    let texto = item.pergunta + "\n";

    for (let i = 0; i < item.opcoes.length; i++) {
        texto += `${i + 1}) ${item.opcoes[i]}\n`;
    }

    texto += 'Digite 1, 2 ou 3 (ou "sair").';

    if (tentativas === 1) {
        texto += "\nSegunda chance!";
    }

    return texto;
}


function fazerPergunta(item) {
    let tentativas = 0;
    let acertou = false;
    let saiu = false;

    while (!acertou && !saiu && tentativas < 2) {
        const resposta = prompt(montarTexto(item, tentativas));

        if (resposta === null || resposta.trim().toLowerCase() === "sair") {
            saiu = true;
        } else if (resposta.trim() === "") {
            alert("Você não digitou nada.");
        } else {
            const numero = Number(resposta);

            if (Number.isNaN(numero)) {
                alert("Digite apenas números (1, 2 ou 3).");
            } else if (!Number.isInteger(numero) || numero < 1 || numero > item.opcoes.length) {
                alert("Escolha uma opção entre 1 e 3.");
            } else {
                tentativas++;

                if (numero === item.certa) {
                    acertou = true;
                } else if (tentativas < 2) {
                    alert("Quase! Tente outra vez.");
                }
            }
        }
    }

    return { tentativas: tentativas, acertou: acertou, saiu: saiu };
}


function montarCuriosidade(item) {
    let mensagem;

    switch (item.tema) {
        case "snoopy":
            mensagem = `Sobre o Snoopy: ${item.explicacao}`;
            break;
        case "charlie":
            mensagem = `Sobre a família Brown: ${item.explicacao}`;
            break;
        case "turma":
            mensagem = `Sobre a turma: ${item.explicacao}`;
            break;
        case "criador":
            mensagem = `Sobre o criador: ${item.explicacao}`;
            break;
        default:
            mensagem = item.explicacao;
            break;
    }

    return mensagem;
}


function classificarResposta(acertou, tentativas) {
    let faixa;
    let pontos;

    if (acertou === true && tentativas === 1) {
        faixa = "De primeira";
        pontos = 10;
    } else if (acertou === true && tentativas === 2) {
        faixa = "Na segunda";
        pontos = 5;
    } else {
        faixa = "Errou";
        pontos = 0;
    }

    return { faixa: faixa, pontos: pontos };
}


function iniciarQuiz() {
    const nivel = pedirNivel();

    if (nivel === null) {
        console.log("Quiz cancelado pelo jogador.");
        return;
    }


    const rodada = [];

    for (const item of perguntas) {
        if (item.nivel <= nivel) {
            rodada.push(item);
        }
    }

    if (embaralharPerguntas) {
        embaralhar(rodada);
    }


    const respostas = [];
    let indice = 0;
    let jogando = true;

    while (jogando && indice < rodada.length) {
        const item = rodada[indice];
        const resultado = fazerPergunta(item);

        if (resultado.saiu) {
            jogando = false;
            alert("Você saiu do quiz. Vamos ver como foi até aqui!");
        } else {
            respostas.push({
                pergunta: item.pergunta,
                tema: item.tema,
                tentativas: resultado.tentativas,
                acertou: resultado.acertou
            });

            if (resultado.acertou) {
                alert(`Acertou! ${montarCuriosidade(item)}`);
            } else {
                alert(`Não foi dessa vez. A resposta certa era: ${item.opcoes[item.certa - 1]}.\n${montarCuriosidade(item)}`);
            }

            indice++;
        }
    }

    if (respostas.length === 0) {
        console.log("Nenhuma pergunta foi respondida.");
        return;
    }


    const relatorio = [];

    for (const resposta of respostas) {
        const classificacao = classificarResposta(resposta.acertou, resposta.tentativas);

        console.log(`${resposta.pergunta} -> ${classificacao.faixa} (${classificacao.pontos} pontos)`);

        relatorio.push({
            pergunta: resposta.pergunta,
            tema: resposta.tema,
            tentativas: resposta.tentativas,
            resultado: classificacao.faixa,
            pontos: classificacao.pontos
        });
    }

 
    let acertos = 0;
    let totalPontos = 0;
    let totalTentativas = 0;

    for (const linha of relatorio) {
        if (linha.resultado !== "Errou") {
            acertos++;
        }

        totalPontos += linha.pontos;
        totalTentativas += linha.tentativas;
    }

    const mediaTentativas = totalTentativas / relatorio.length;
    const pontosPossiveis = rodada.length * 10;
    const percentual = (totalPontos / pontosPossiveis) * 100;


    let titulo;

    if (percentual >= 80) {
        titulo = "Ás da Aviação";
    } else if (percentual >= 50) {
        titulo = "Beagle de respeito";
    } else {
        titulo = "Filhote curioso";
    }


    console.log(`Você respondeu ${relatorio.length} de ${rodada.length} perguntas e acertou ${acertos}.`);
    console.log(`Pontos: ${totalPontos} de ${pontosPossiveis} (${percentual.toFixed(0)}%).`);
    console.log(`Média de tentativas por pergunta: ${mediaTentativas.toFixed(1)}.`);
    console.log(`Seu título: ${titulo}!`);
    console.table(relatorio);

    alert(`Fim de jogo! Você fez ${totalPontos} pontos e ganhou o título de ${titulo}. Veja os detalhes no Console (F12).`);
}


setTimeout(iniciarQuiz, 300);