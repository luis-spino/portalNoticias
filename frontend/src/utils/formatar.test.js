import { describe, it, expect } from 'vitest';
import { formatarData } from './formatar.js';

describe('formatarData', () => {
  it('formata uma data ISO no padrão brasileiro', () => {
    expect(formatarData('2026-11-12T12:00:00.000Z')).toBe('12/11/2026');
  });

  it('devolve texto vazio para data inválida', () => {
    expect(formatarData('isto não é data')).toBe('');
    expect(formatarData(undefined)).toBe('');
  });
});