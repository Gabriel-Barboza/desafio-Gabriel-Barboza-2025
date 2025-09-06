import { AbrigoAnimais } from "./abrigo-animais";

describe('Abrigo de Animais', () => {

  test('Deve rejeitar animal inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('CAIXA,RATO', 'RATO,BOLA', 'Lulu');
    expect(resultado.erro).toBe('Animal inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo');
      expect(resultado.lista[0]).toBe('Fofo - abrigo');
      expect(resultado.lista[1]).toBe('Rex - pessoa 1');
      expect(resultado.lista.length).toBe(2);
      expect(resultado.erro).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal intercalando brinquedos', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('BOLA,LASER',
      'BOLA,NOVELO,RATO,LASER', 'Mimi,Fofo,Rex,Bola');

      expect(resultado.lista[0]).toBe('Bola - abrigo');
      expect(resultado.lista[1]).toBe('Fofo - pessoa 2');
      expect(resultado.lista[2]).toBe('Mimi - abrigo');
      expect(resultado.lista[3]).toBe('Rex - abrigo');
      expect(resultado.lista.length).toBe(4);
      expect(resultado.erro).toBeFalsy();
  });

  test('Regra 3: Gato nao deve dividir brinquedo', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('BOLA,LASER,RATO' ,'', 'Mimi , Rex');
  
    expect(resultado.lista[0]).toBe('Mimi - pessoa 1');
    expect(resultado.lista[1]).toBe('Rex - abrigo');
    expect(resultado.lista.length).toBe(2);
    expect(resultado.erro).toBeFalsy();
  });

  test('Regra 4 : ninguem leva o animal se ambos forem compativeis', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'RATO,BOLA', 'Rex');
    expect(resultado.lista[0]).toBe('Rex - abrigo');
    expect(resultado.lista.length).toBe(1);
    expect(resultado.erro).toBeFalsy();
  });

  test('Regra 5: pessoa nao pode levar mais de 3 animais', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('LASER,SKATE,RATO,BOLA,CAIXA,NOVELO', '', 'Rex,Bola,Bebe,Zero');
    expect(resultado.lista[0]).toBe('Bebe - pessoa 1');
    expect(resultado.lista[1]).toBe('Bola - pessoa 1');
    expect(resultado.lista[2]).toBe('Rex - pessoa 1');
    expect(resultado.lista[3]).toBe('Zero - abrigo');
    expect(resultado.lista.length).toBe(4);
    expect(resultado.erro).toBeFalsy(); 
  });

  test('Regra 6a : Loco é adotado com brinquedos fora de ordem e companhia', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,SKATE,BOLA', '', 'Loco,Rex');
    expect(resultado.lista[0]).toBe('Loco - pessoa 1');
    expect(resultado.lista[1]).toBe('Rex - pessoa 1');
    expect(resultado.lista.length).toBe(2);
    expect(resultado.erro).toBeFalsy();
  });

  test('Regra 6b : Loco não é adotado seestiver sozinho', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,SKATE', '', 'Loco');
    expect(resultado.lista[0]).toBe('Loco - abrigo');
    expect(resultado.lista.length).toBe(1);
    expect(resultado.erro).toBeFalsy();
  });
  test('Deve rejeitar animal duplicado', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('CAIXA,RATO', 'RATO,BOLA', 'Rex,Rex');
    expect(resultado.erro).toBe('Animal inválido');
    expect(resultado.lista).toBeFalsy();
  });
  test('Deve rejeitar brinquedo inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('CAIXA,RATO', 'RATO,URSO', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
    expect(resultado.lista).toBeFalsy();
  });
  test ('Deve rejeitar brinquedo duplicado na lista de uma pessoa', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('CAIXA,RATO,RATO', 'RATO,BOLA', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
    expect(resultado.lista).toBeFalsy();
  });

});
