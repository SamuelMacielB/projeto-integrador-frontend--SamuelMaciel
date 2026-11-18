const PERSONAGENS = ["Snoopy", "Charlie Brown", "Linus", "Lucy", "Sally", "Eudora", "Woodstock", "Schroeder"];

function limparSinopse(texto) {
    return texto.replace(/^Sinopse:\s*/, "").trim();
}

function encontrarPersonagens(sinopse, lista = PERSONAGENS) {
    return lista.filter((nome) => sinopse.includes(nome));
}

function classificarElenco(quantidade) {
    if (quantidade >= 3) {
        return { rotulo: "Turma animada", classe: "elenco-turma" };
    } else if (quantidade === 2) {
        return { rotulo: "Dupla em destaque", classe: "elenco-dupla" };
    } else {
        return { rotulo: "Foco solo", classe: "elenco-solo" };
    }
}

function lerEpisodios(elementos) {
    return Array.from(elementos).map((elemento) => {
        const titulo = elemento.querySelector("h2");
        const sinopse = elemento.querySelector("p");

        return {
            elemento: elemento,
            titulo: titulo !== null ? titulo.textContent : "Sem título",
            sinopse: sinopse !== null ? limparSinopse(sinopse.textContent) : ""
        };
    });
}

function analisarEpisodios(lista) {
    return lista.map((episodio) => {
        const personagens = encontrarPersonagens(episodio.sinopse);
        const faixa = classificarElenco(personagens.length);

        return {
            ...episodio,
            personagens: personagens,
            quantidade: personagens.length,
            rotulo: faixa.rotulo,
            classe: faixa.classe
        };
    });
}

function resumirEpisodios(lista) {
    const totalCitacoes = lista.reduce((soma, ep) => soma + ep.quantidade, 0);
    const maisCheio = lista.reduce((melhor, atual) =>
        atual.quantidade > melhor.quantidade ? atual : melhor
    );
    const turmas = lista.filter((ep) => ep.classe === "elenco-turma");

    return {
        quantidade: lista.length,
        totalCitacoes: totalCitacoes,
        media: totalCitacoes / lista.length,
        turmas: turmas.length,
        maisCheio: maisCheio.titulo
    };
}

function criarEtiqueta(episodio) {
    const etiqueta = document.createElement("span");
    etiqueta.classList.add("etiqueta");
    etiqueta.textContent = `${episodio.rotulo} · ${episodio.personagens.join(", ")}`;
    return etiqueta;
}

function criarResumo(resumo) {
    const linha = document.createElement("p");
    linha.classList.add("resumo-episodios");
    linha.textContent = `${resumo.quantidade} episódios, ${resumo.totalCitacoes} citações de personagens (média de ${resumo.media.toFixed(1)} por episódio), ${resumo.turmas} com turma animada. O mais cheio: ${resumo.maisCheio}.`;
    return linha;
}

function marcarEpisodio(episodio) {
    episodio.elemento.classList.add(episodio.classe);

    const texto = episodio.elemento.querySelector(".episodio-texto");

    if (texto === null) {
        console.error("Bloco .episodio-texto não encontrado.");
        return;
    }

    texto.append(criarEtiqueta(episodio));
}

function mostrarAnalise() {
    const secao = document.querySelector(".videos");

    if (secao === null) {
        console.error('Seção ".videos" não encontrada no HTML.');
        return;
    }

    const elementos = secao.querySelectorAll(".episodio");

    if (elementos.length === 0) {
        console.error("Nenhum episódio encontrado.");
        return;
    }

    const analisados = analisarEpisodios(lerEpisodios(elementos));
    const resumo = resumirEpisodios(analisados);

    secao.before(criarResumo(resumo));

    for (const episodio of analisados) {
        marcarEpisodio(episodio);
    }
}

mostrarAnalise();