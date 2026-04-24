# ✅ TODO COMPLETO — Diário de Alimentação Pet (Do zero até o Celular)

> Última atualização: agora. Siga na ordem. Não pule etapas.

---

## 🔴 ERRO CRÍTICO NO `.env` — CORRIJA AGORA

Você já colocou a URL do MongoDB Atlas no `backend/.env`, mas **FALTA O NOME DO BANCO DE DADOS**.

**Como está (ERRADO):**
```env
PORT=3000
MONGO_URI=mongodb://kauaborba134_db_user:0Gd73NOe8xqZl0sw@ac-46g1ubq-shard-00-00.bs6dwyn.mongodb.net:27017,ac-46g1ubq-shard-00-01.bs6dwyn.mongodb.net:27017,ac-46g1ubq-shard-00-02.bs6dwyn.mongodb.net:27017/?ssl=true&replicaSet=atlas-ajeq1m-shard-0&authSource=admin&appName=diario
```

**Como deve ficar (CORRETO):**
```env
PORT=3000
MONGO_URI=mongodb://kauaborba134_db_user:0Gd73NOe8xqZl0sw@ac-46g1ubq-shard-00-00.bs6dwyn.mongodb.net:27017,ac-46g1ubq-shard-00-01.bs6dwyn.mongodb.net:27017,ac-46g1ubq-shard-00-02.bs6dwyn.mongodb.net:27017/pet_diary?ssl=true&replicaSet=atlas-ajeq1m-shard-0&authSource=admin&appName=diario
```

> 📝 **O que mudou:** Adicionei `pet_diary` entre `27017/` e `?ssl=true`. Isso diz pro MongoDB qual banco de dados usar.

**Ação:** Abra `app-pet/app-pet/backend/.env` e cole o texto correto acima. Salve (Ctrl+S).

---

## PROGRESSO ATUAL

### ✅ Já feito:
- [x] Código do backend criado (CRUD completo)
- [x] Código do frontend criado (React, PWA, mobile-first)
- [x] React e Babel baixados localmente (funciona offline)
- [x] Service Worker configurado
- [x] Manifest.json configurado
- [x] MongoDB Atlas criado
- [x] URL do MongoDB colocada no `.env` (mas precisa da correção acima)
- [x] Git instalado (seu terminal reconhece o comando `git`)

### ⬜ Ainda falta:
- [ ] **Corrigir o `.env`** (erro crítico acima ☝️)
- [ ] Inicializar repositório Git (`git init`)
- [ ] Criar conta/repositório no GitHub
- [ ] Enviar código com `git push`
- [ ] Deploy no Render
- [ ] Testar no celular

---

## ETAPA 1: Corrigir `.env` (FAÇA ISSO PRIMEIRO)

1. Abra o arquivo: `app-pet/app-pet/backend/.env`
2. Substitua TODO o conteúdo pelo texto correto na seção "ERRO CRÍTICO" acima
3. Salve (Ctrl + S)
4. Teste localmente no terminal:
```bash
cd c:/Users/Kaua/Downloads/Atividadefullstack/app-pet/app-pet/backend
npm start
```
Se aparecer `Servidor rodando na porta 3000`, deu certo! Se der erro de MongoDB, confira se colocou `pet_diary` no lugar certo.

---

## ETAPA 2: Criar conta no GitHub (se ainda não tem)

1. Acesse https://github.com/signup
2. Use seu e-mail, crie uma senha e confirme
3. Verifique seu e-mail

---

## ETAPA 3: Criar repositório no GitHub

1. Acesse https://github.com/new
2. Em **Repository name**, digite: `diario-alimentacao-pet`
3. Deixe **Public** marcado
4. **NÃO** marque "Add a README file" (já temos um)
5. **NÃO** marque "Add .gitignore" (já temos um)
6. Clique em **Create repository**

Vai aparecer uma tela com comandos. Você vai usar os comandos do **"...or push an existing repository from the command line"**

---

## ETAPA 4: Enviar código para o GitHub (terminal do VSCode)

Abra o terminal do VSCode e execute **UM COMANDO DE CADA VEZ**:

```bash
cd c:/Users/Kaua/Downloads/Atividadefullstack/app-pet/app-pet
```

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "feat: diario alimentacao pet com crud, react e pwa"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/SEU_USUARIO_GITHUB/diario-alimentacao-pet.git
```
> Troque `SEU_USUARIO_GITHUB` pelo seu nome de usuário do GitHub!

```bash
git push -u origin main
```

**Se pedir senha:**
- User: seu e-mail do GitHub
- Password: **NÃO use sua senha do GitHub!** Use um **Personal Access Token**:
  - Vá em https://github.com/settings/tokens
  - Clique **Generate new token (classic)**
  - Marque a opção `repo`
  - Gere o token e cole no terminal como senha

---

## ETAPA 5: Deploy no Render (gratuito)

1. Acesse https://render.com
2. Faça login com sua conta do **GitHub** (é mais fácil)
3. No Dashboard, clique em **New +** → **Web Service**
4. Clique em **Build and deploy from a Git repository**
5. Conecte sua conta do GitHub e escolha o repositório `diario-alimentacao-pet`
6. Configure:
   - **Name:** `diario-pet` (ou outro nome)
   - **Environment:** `Node`
   - **Region:** Ohio (US East) — padrão
   - **Branch:** `main`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** Free
7. Role para baixo até **Environment Variables** e clique em **Add Environment Variable**:
   - **Key:** `MONGO_URI`
   - **Value:** cole a MESMA URL do MongoDB Atlas que você colocou no `.env` (com `pet_diary` incluído)
8. Clique em **Create Web Service**

O Render vai construir e deployar automaticamente. Aguarde 1-2 minutos.

A URL vai ser algo como: `https://diario-pet.onrender.com`

---

## ETAPA 6: Testar no celular

1. Aguarde o deploy finalizar (barra verde no Render)
2. No celular, abra o **Chrome** e digite a URL do Render
3. Toque no menu (⋮) → **"Adicionar à tela inicial"** ou **"Instalar aplicativo"**
4. O app aparece como ícone nativo na home do celular
5. Teste tudo:
   - Cadastrar uma refeição para seu pet
   - Ver o Dashboard com consumo do dia
   - Editar uma refeição
   - Excluir uma refeição
6. **Teste offline:** ligue o **Modo Avião**, feche e abra o app novamente. O histórico deve aparecer!

---

## ETAPA 7: Entregar ao professor

Envie por e-mail ou Teams:
1. **Link do repositório GitHub:** `https://github.com/SEU_USUARIO/diario-alimentacao-pet`
2. **Link da aplicação publicada:** `https://diario-pet.onrender.com`

---

## 🆘 Resolução de Problemas

| Problema | Solução |
|----------|---------|
| `Erro ao conectar no MongoDB` | Verifique se colocou `pet_diary` na URL do `.env` |
| `fatal: not a git repository` | Você esqueceu de rodar `git init` |
| `git push` pede senha | Use Personal Access Token, não senha do GitHub |
| `npm install` dá erro | Verifique se o Node.js está instalado: `node --version` |
| App não instala no celular | Use Chrome (não Safari), o site precisa estar em HTTPS |
| Offline não funciona | A primeira vez precisa de internet para instalar o Service Worker |

---

## ✅ Checklist Final

- [x] MongoDB Atlas configurado
- [x] URL do Atlas colada no `backend/.env`
- [ ] **`.env` corrigido com `pet_diary` na URL**
- [ ] Servidor testado localmente (`npm start`)
- [ ] Conta no GitHub criada
- [ ] Repositório criado no GitHub
- [ ] Código enviado com `git push`
- [ ] Web Service criado no Render
- [ ] Variável `MONGO_URI` configurada no Render
- [ ] URL pública acessível
- [ ] Testado no celular e instalado na tela inicial
- [ ] Testado no modo offline

---

**Próximo passo AGORA: Corrija o `.env` com `pet_diary` e rode `npm start` para testar! 🚀**

