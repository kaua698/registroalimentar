# TODO - Diário de Alimentação Pet

## ONDE COLOCAR AS INFORMAÇÕES NO RENDER (PASSO A PASSO COM SEUS DADOS)

### Seus dados do MongoDB:
- **Usuário do banco:** `kauaborba134_db_user`
- **Senha do banco:** `1kjoOJpVKEasfelj`
- **Connection string:** `mongodb://kauaborba134_db_user:1kjoOJpVKEasfelj@ac-omowred-shard-00-00.l13ux3x.mongodb.net:27017,ac-omowred-shard-00-01.l13ux3x.mongodb.net:27017,ac-omowred-shard-00-02.l13ux3x.mongodb.net:27017/?ssl=true&replicaSet=atlas-dt0ppw-shard-0&authSource=admin&appName=Cluster0`
- **Senha admin do Atlas:** `NiIc0PMeolG2bSE9` (só serve para logar no site do Atlas, NÃO usa no Render)

---

## PASSO 1: Acessar o Render

1. [ ] Vá para https://dashboard.render.com
2. [ ] Faça login na sua conta

---

## PASSO 2: Criar o Serviço (se ainda não criou)

1. [ ] Clique no botão **"New +"** (canto superior direito)
2. [ ] Clique em **"Web Service"**
3. [ ] Conecte com sua conta do **GitHub**
4. [ ] Procure e clique no repositório: `kaua698/registroalimentar`
5. [ ] Clique em **"Connect"**

---

## PASSO 3: Preencher as Configurações do Serviço

Na tela de configuração, preencha EXATAMENTE assim:

| Campo | O que colocar |
|-------|---------------|
| **Name** | `registroalimentar` |
| **Region** | `Oregon (US West)` |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `cd backend && npm start` |
| **Instance Type** | `Free` |

---

## PASSO 4: O MAIS IMPORTANTE - Variáveis de Ambiente

Agora você precisa rolar a página para baixo até achar a seção chamada **"Environment Variables"** (Variáveis de Ambiente).

É AQUI que você vai colocar a connection string do MongoDB!

### Clique em "Add Environment Variable"

Vai aparecer dois campos: **Key** e **Value**

#### Primeira variável (MONGO_URI):

| Campo | O que colocar |
|-------|---------------|
| **Key** | `MONGO_URI` |
| **Value** | `mongodb://kauaborba134_db_user:1kjoOJpVKEasfelj@ac-omowred-shard-00-00.l13ux3x.mongodb.net:27017,ac-omowred-shard-00-01.l13ux3x.mongodb.net:27017,ac-omowred-shard-00-02.l13ux3x.mongodb.net:27017/pet_diary?ssl=true&replicaSet=atlas-dt0ppw-shard-0&authSource=admin&appName=Cluster0` |

**⚠️ ATENÇÃO:** Eu modifiquei sua connection string original. Adicionei `/pet_diary` antes do `?ssl=true`. Isso é necessário para definir o nome do banco de dados!

**URI COMPLETA PARA COPIAR E COLAR NO VALUE:**

```
mongodb://kauaborba134_db_user:1kjoOJpVKEasfelj@ac-omowred-shard-00-00.l13ux3x.mongodb.net:27017,ac-omowred-shard-00-01.l13ux3x.mongodb.net:27017,ac-omowred-shard-00-02.l13ux3x.mongodb.net:27017/pet_diary?ssl=true&replicaSet=atlas-dt0ppw-shard-0&authSource=admin&appName=Cluster0
```

#### Segunda variável (NODE_ENV):

| Campo | O que colocar |
|-------|---------------|
| **Key** | `NODE_ENV` |
| **Value** | `production` |

---

## PASSO 5: Criar o Serviço

1. [ ] Depois de preencher tudo, clique no botão **"Create Web Service"** (embaixo da página)
2. [ ] O Render vai começar a fazer o deploy automaticamente
3. [ ] Você vai ver uma tela com os **logs** (texto subindo)
4. [ ] Aguarde até aparecer a mensagem **"Your service is live"** ou **"Server running on port XXXX"**
5. [ ] Isso pode levar 2 a 5 minutos na primeira vez

---

## PASSO 6: Pegar a URL

1. [ ] No topo da página do Render, vai aparecer uma URL tipo:
   ```
   https://registroalimentar.onrender.com
   ```
2. [ ] Clique nessa URL ou copie e cole no navegador
3. [ ] Se tudo der certo, vai aparecer o **Diário de Alimentação Pet**!

---

## SE DER ERRO "Not Found"

Isso acontece quando o MONGO_URI está errado ou faltando. Verifique:

- [ ] A variável MONGO_URI foi adicionada corretamente?
- [ ] A connection string está completa (com senha, /pet_diary, etc.)?
- [ ] No MongoDB Atlas, o IP 0.0.0.0/0 está liberado? (Network Access)

---

## TESTAR NO CELULAR

1. [ ] Abra a URL do Render no celular
2. [ ] No Chrome, clique nos 3 pontinhos (menu)
3. [ ] Clique em **"Adicionar à tela inicial"**
4. [ ] Pronto! Agora tem um app instalado no celular!

---

## RESUMO VISUAL

```
RENDER DASHBOARD
├── New + → Web Service
├── Conectar GitHub → kaua698/registroalimentar
├── Configurar:
│   ├── Name: registroalimentar
│   ├── Build Command: cd backend && npm install
│   ├── Start Command: cd backend && npm start
│   └── Environment Variables:
│       ├── Key: MONGO_URI
│       │   Value: mongodb://kauaborba134_db_user:1kjoOJpVKEasfelj@...
│       └── Key: NODE_ENV
│           Value: production
└── Create Web Service → Aguardar deploy → Pronto!
