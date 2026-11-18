import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

//depois de cada teste, remove da tela o que foi renderizado
afterEach(() => {
  cleanup();
});