import { apiGet, apiPost } from '../api.js';

function paraUsuario(doc, tipo) {
  return {
    _id: doc._id,
    nome: doc.nome,
    tipo,
    papel: tipo === 'autor' ? doc.papel : 'leitor',
    sala: doc.sala ?? null,
  };
}

export async function cadastrarUsuario({ conta, nome, email, sala }) {
  const base = { nome: nome.trim(), email: email.trim() };

  if (conta === 'leitor') {
    const doc = await apiPost('/leitores', base);
    return paraUsuario(doc, 'leitor');
  }

  const corpo = { ...base, papel: conta };
  if (conta === 'representante') corpo.sala = sala.trim();
  const doc = await apiPost('/autores', corpo);
  return paraUsuario(doc, 'autor');
}

export async function entrarComId(id, tipo) {
  const idLimpo = id.trim();

  if (tipo === 'autor') {
    const doc = await apiGet(`/autores/${idLimpo}`);
    return paraUsuario(doc, 'autor');
  }
  
  return { _id: idLimpo, nome: 'Leitor', tipo: 'leitor', papel: 'leitor', sala: null };
}