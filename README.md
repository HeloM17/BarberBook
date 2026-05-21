# ✂️ BarberBook — Sistema de Agendamento para Barbearias

Sistema de agendamento online para barbearias. O cliente agenda pelo celular em menos de 1 minuto, o barbeiro recebe no WhatsApp e o horário some automaticamente.

---

## 🚀 Como colocar no ar (passo a passo)

### 1. Criar conta no Supabase (banco de dados gratuito)

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Clique em **New Project**, dê um nome e uma senha forte
3. Aguarde o projeto subir (leva ~1 minuto)

### 2. Criar as tabelas no banco

No painel do Supabase, vá em **SQL Editor** e execute o seguinte SQL:

```sql
-- BARBEARIAS
create table barbearias (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  nome text not null,
  slug text not null unique,
  whatsapp text not null,
  endereco text,
  dono_nome text,
  mensagem_boas_vindas text,
  ativo boolean default true,
  criado_em timestamptz default now()
);

-- SERVIÇOS
create table servicos (
  id uuid default gen_random_uuid() primary key,
  barbearia_id uuid references barbearias(id) on delete cascade not null,
  nome text not null,
  preco numeric(10,2) not null,
  duracao_min integer not null default 30,
  emoji text default '✂️',
  criado_em timestamptz default now()
);

-- HORÁRIOS DE FUNCIONAMENTO
create table horarios (
  id uuid default gen_random_uuid() primary key,
  barbearia_id uuid references barbearias(id) on delete cascade not null,
  dia_semana integer not null, -- 0=Dom, 1=Seg, ..., 6=Sáb
  ativo boolean default true,
  hora_inicio time not null default '08:00',
  hora_fim time not null default '18:00',
  unique(barbearia_id, dia_semana)
);

-- AGENDAMENTOS
create table agendamentos (
  id uuid default gen_random_uuid() primary key,
  barbearia_id uuid references barbearias(id) on delete cascade not null,
  cliente_nome text not null,
  cliente_whatsapp text not null,
  servicos jsonb not null,
  data date not null,
  hora time not null,
  valor_total numeric(10,2) not null,
  status text default 'ativo', -- ativo | cancelado
  criado_em timestamptz default now()
);
```

### 3. Configurar permissões (RLS)

Ainda no **SQL Editor**, execute:

```sql

alter table barbearias enable row level security;
alter table servicos enable row level security;
alter table horarios enable row level security;
alter table agendamentos enable row level security;


create policy "leitura publica barbearias" on barbearias for select using (true);
create policy "inserir propria barbearia" on barbearias for insert with check (auth.uid() = user_id);
create policy "atualizar propria barbearia" on barbearias for update using (auth.uid() = user_id);


create policy "leitura publica servicos" on servicos for select using (true);
create policy "gerenciar proprios servicos" on servicos for all
  using (barbearia_id in (select id from barbearias where user_id = auth.uid()));


create policy "leitura publica horarios" on horarios for select using (true);
create policy "gerenciar proprios horarios" on horarios for all
  using (barbearia_id in (select id from barbearias where user_id = auth.uid()));


create policy "inserir agendamento" on agendamentos for insert with check (true);
create policy "leitura agendamentos da barbearia" on agendamentos for select using (true);
create policy "cancelar agendamento" on agendamentos for update
  using (barbearia_id in (select id from barbearias where user_id = auth.uid()));
```

### 4. Pegar as credenciais do Supabase

1. No painel do Supabase, vá em **Settings → API**
2. Copie a **Project URL** e a **anon public key**

### 5. Configurar o projeto

Abra o arquivo `js/supabase.js` e substitua:

```javascript
const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';     // ← sua URL
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANONIMA_AQUI';         // ← sua chave
```

### 6. Subir no GitHub

```bash
git init
git add .
git commit -m "feat: barberbook MVP"
git remote add origin https://github.com/SEU_USUARIO/barberbook.git
git push -u origin main
```

### 7. Ativar GitHub Pages (hospedagem gratuita)

1. No repositório GitHub, vá em **Settings → Pages**
2. Em **Source**, selecione `Deploy from a branch`
3. Escolha a branch `main` e a pasta `/root`
4. Clique em **Save**

Seu sistema vai estar disponível em:
`https://SEU_USUARIO.github.io/barberbook`

---

## 📱 Como usar

### O barbeiro:
1. Acessa `index.html` → Criar conta
2. Cadastra nome, WhatsApp e endereço da barbearia
3. Vai em **Serviços** e adiciona corte, barba, etc.
4. Vai em **Horários** e define os dias/horas de atendimento
5. Copia o link e compartilha no Instagram, WhatsApp, etc.

### O cliente:
1. Clica no link da barbearia
2. Escolhe os serviços
3. Escolhe o dia e o horário disponível
4. Informa nome e WhatsApp
5. Confirma — recebe o resumo e os botões de WhatsApp

---

## 📁 Estrutura de arquivos

```
barberbook/
├── index.html              ← Landing page (pra postar no LinkedIn)
├── css/
│   └── style.css           ← Estilos globais
├── js/
│   └── supabase.js         ← Config do banco + helpers
└── pages/
    ├── cadastro.html       ← Cadastro da barbearia
    ├── login.html          ← Login
    ├── painel.html         ← Agenda do dia
    ├── servicos.html       ← Gerenciar serviços
    ├── horarios.html       ← Configurar horários
    ├── configuracoes.html  ← Dados da barbearia
    ├── agendar.html        ← Página do cliente (pública)
    └── confirmacao.html    ← Tela de sucesso
```

---

## 🛠️ Tecnologias

| Tecnologia | Uso | Custo |
|---|---|---|
| HTML/CSS/JS | Frontend | Gratuito |
| [Supabase](https://supabase.com) | Banco de dados + Auth | Gratuito |
| [GitHub Pages](https://pages.github.com) | Hospedagem | Gratuito |
| WhatsApp `wa.me` | Notificações | Gratuito |

---

## 💡 Próximas funcionalidades (roadmap)

- [ ] Foto de perfil da barbearia
- [ ] Múltiplos barbeiros por barbearia
- [ ] Lembretes automáticos por WhatsApp
- [ ] Relatório de faturamento mensal
- [ ] Link de cancelamento para o cliente
- [ ] Integração com Google Calendar
- [ ] Plano pago (assinatura mensal)

---

Feito com ☕ para barbeiros que valorizam o tempo.
