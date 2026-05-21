// ============================================================
//  BARBERBOOK — Supabase Config
//  👉 Substitua as variáveis abaixo com suas credenciais do
//     Supabase (Settings > API no seu projeto)
// ============================================================

const SUPABASE_URL = 'https://owxtcojhihroyjkuofij.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_h00H7hmN0xysJnsIQZr0tQ_aKt8Shzy';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
//  HELPERS GLOBAIS
// ============================================================

function showToast(msg, type = 'success') {
  const existing = document.querySelector('.bb-toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.className = `bb-toast bb-toast--${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('bb-toast--show'), 10);
  setTimeout(() => { el.classList.remove('bb-toast--show'); setTimeout(() => el.remove(), 400); }, 3500);
}

function formatPhone(raw) {
  const n = raw.replace(/\D/g, '');
  if (n.length === 11) return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`;
  if (n.length === 10) return `(${n.slice(0,2)}) ${n.slice(2,6)}-${n.slice(6)}`;
  return raw;
}

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatCurrency(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

const DIAS_SEMANA = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const DIAS_SEMANA_SHORT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
