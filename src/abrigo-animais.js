class AbrigoAnimais {
  constructor() {
    this.animais = [
      { nome: 'Rex', especie: 'cão', brinquedos: ['RATO', 'BOLA'] },
      { nome: 'Mimi', especie: 'gato', brinquedos: ['BOLA', 'LASER'] },
      { nome: 'Fofo', especie: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
      { nome: 'Zero', especie: 'gato', brinquedos: ['RATO', 'BOLA'] },
      { nome: 'Bola', especie: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
      { nome: 'Bebe', especie: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
      { nome: 'Loco', especie: 'jabuti', brinquedos: ['SKATE', 'RATO'] },
    ];
    this.limite = 3;
    this.brinquedosValidos = [...new Set(this.animais.flatMap((animal) => animal.brinquedos))];
    this.nomesAnimaisValidos = this.animais.map((animal) => animal.nome.toUpperCase());
  }

  _validarEntradas(brinquedosPessoa1, brinquedosPessoa2, animaisDesejados) {
    const contagem = {};
    for (const nomeAnimal of animaisDesejados) {
      if (!this.nomesAnimaisValidos.includes(nomeAnimal)) {
        return { erro: 'Animal inválido' };
      }

      contagem[nomeAnimal] = (contagem[nomeAnimal] || 0) + 1;
      if (contagem[nomeAnimal] > 1) {
        return { erro: 'Animal inválido' };
      }
    }

    const validarListaBrinquedos = (brinquedos) => {
      const ContagemBrinquedos = {};
      for (const brinquedo of brinquedos) {
        if (!this.brinquedosValidos.includes(brinquedo)) {
          return false;
        }
        ContagemBrinquedos[brinquedo] = (ContagemBrinquedos[brinquedo] || 0) + 1;
        if (ContagemBrinquedos[brinquedo] > 1) {
          return false;
        }
      }
      return true;
    };

    if (!validarListaBrinquedos(brinquedosPessoa1) || !validarListaBrinquedos(brinquedosPessoa2)) {
      return { erro: 'Brinquedo inválido' };
    }
    return null;
  }

  _verificarCompatibilidade(animal, brinquedosPessoa) {
    const brinquedosFavoritos = animal.brinquedos;
    if (animal.nome === 'Loco') {
      return brinquedosFavoritos.every((brinquedo) => brinquedosPessoa.includes(brinquedo));
    }
    let indice = 0;
    for (const brinquedo of brinquedosPessoa) {
      if (brinquedo === brinquedosFavoritos[indice]) {
        indice++;
      }
      if (indice === brinquedosFavoritos.length) {
        return true;
      }
    }

    return false;
  }

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, nomes) {
    const brinquedoPessoa1 = brinquedosPessoa1
      ? brinquedosPessoa1.split(',').map((b) => b.trim().toUpperCase())
      : [];
    const brinquedoPessoa2 = brinquedosPessoa2
      ? brinquedosPessoa2.split(',').map((b) => b.trim().toUpperCase())
      : [];
    const animaisDesejados = nomes.split(',').map((n) => n.trim().toUpperCase());

    const erroValidacao = this._validarEntradas(
      brinquedoPessoa1,
      brinquedoPessoa2,
      animaisDesejados
    );
    if (erroValidacao) {
      return erroValidacao;
    }

    const animaisInfo = new Map(this.animais.map((a) => [a.nome.toUpperCase(), a]));
    const resultado ={};

    let adocaoesPessoa1 = 0;
    let adocaoesPessoa2 = 0;

    for (const nomeAnimal of animaisDesejados) {
      const animal = animaisInfo.get(nomeAnimal);
      const elegivelPessoa1 = this._verificarCompatibilidade(animal, brinquedoPessoa1);
      const elegivelPessoa2 = this._verificarCompatibilidade(animal, brinquedoPessoa2);
      if (elegivelPessoa1 && !elegivelPessoa2 && adocaoesPessoa1 < this.limite) {
        resultado[nomeAnimal] = 'pessoa 1';
        adocaoesPessoa1++;
      } else if (!elegivelPessoa1 && elegivelPessoa2 && adocaoesPessoa2 < this.limite) {
        resultado[nomeAnimal] = 'pessoa 2';
        adocaoesPessoa2++;
      } else {
        resultado[nomeAnimal] = 'abrigo';
      }
    }

    const getAnimaisAdotados = (pessoaId) =>
      Object.keys(resultado)
        .filter((animal) => resultado[animal] === pessoaId)
        .map((animal) => animaisInfo.get(animal));

    ['pessoa 1', 'pessoa 2'].forEach((pessoaId) => {
      const animaisAdotados = getAnimaisAdotados(pessoaId);
      if (!animaisAdotados) return;

      const gatosAdotados = animaisAdotados.filter((a) => a && a.especie === 'gato');
      const outrosAnimaisAdotados = animaisAdotados.filter((a) => a && a.especie !== 'gato');

      if (gatosAdotados.length > 0) {
        const brinquedosExclusivos = new Set(gatosAdotados.flatMap((gato) => gato.brinquedos));
        for (const outroAnimal of outrosAnimaisAdotados) {
          const conflito = outroAnimal.brinquedos.some((brinquedo) =>
            brinquedosExclusivos.has(brinquedo)
          );
          if (conflito) {
            resultado[outroAnimal.nome.toUpperCase()] = 'abrigo';
          }
        }
      }
    });

    if (resultado['LOCO'] && resultado['LOCO'] !== 'abrigo') {
      const donoLoco = resultado['LOCO'];

      const animaisDoDonoFinal = getAnimaisAdotados(donoLoco);

      if (animaisDoDonoFinal.length <= 1) {
        resultado['LOCO'] = 'abrigo';
      }
    }

    const listaFinal = animaisDesejados
      .map((nomeAnimal) => {
        const dono = resultado[nomeAnimal] || 'abrigo';
        const animalInfo = animaisInfo.get(nomeAnimal);
        return `${animalInfo.nome} - ${dono}`;
      })
      .sort();

    return { lista: listaFinal };
  }
}

export { AbrigoAnimais as AbrigoAnimais };
