import { describe, it, expect } from 'vitest';
import { converterTags, tagsParaTexto } from './tags.js';

describe('converterTags', () => {
  it('separa por vírgula, tira espaços e deixa em minúsculas', () => {
    expect(converterTags(' Robotica, ESTAGIO ')).toEqual(['robotica', 'estagio']);
  });

  it('remove tags repetidas e vazias', () => {
    expect(converterTags('feira,, feira, ciencias')).toEqual(['feira', 'ciencias']);
  });

  it('devolve lista vazia para texto vazio', () => {
    expect(converterTags('')).toEqual([]);
  });

  it('lança TypeError quando não recebe um texto', () => {
    expect(() => converterTags(['a', 'b'])).toThrow(TypeError);
    expect(() => converterTags(undefined)).toThrow('separado por vírgulas');
  });
});

describe('tagsParaTexto', () => {
  it('junta as tags com vírgula', () => {
    expect(tagsParaTexto(['a', 'b'])).toBe('a, b');
  });

  it('devolve texto vazio quando não há tags', () => {
    expect(tagsParaTexto()).toBe('');
  });
});