# TODO - Diário de Alimentação Pet - Deploy Render

## Status Atual
- [x] Backend completo (Node.js + Express + MongoDB)
- [x] Frontend completo (React + PWA)
- [x] GitHub enviado
- [x] Render conectado ao GitHub
- [ ] **Render mostrando "Not Found" - CORRIGIR**

---

## Como Corrigir o Erro "Not Found" no Render

### Passo 1: Configurar Variável de Ambiente MONGO_URI
1. Acesse https://dashboard.render.com
2. Clique no seu serviço `registroalimentar`
3. Vá na aba **"Environment"** (ou "Variables de Ambiente")
4. Adicione:
   - **Key:** `MONGO_URI`
   - **Value:** `mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mongodb.net/pet_diary?retryWrites=true&w=majority`
5. Clique em **"Save Changes"**

> **IMPORTANTE:** Substitua YOUR_USERNAME e YOUR_PASSWORD pelos seus dados reais do MongoDB Atlas!

### Passo 2: Verificar Configuração do Serviço
Na mesma página do serviço no Render, verifique:

| Configuração | Valor Correto |
|-------------|---------------|
| Runtime | Node |
| Build Command | `cd backend && npm install` |
| Start Command | `cd backend && npm start` |
| Root Directory | *(deixe vazio)* |

### Passo 3: Verificar Logs
1. Na aba **"Logs"** do Render
2. Procure por `Erro ao conectar no MongoDB` ou `Servidor rodando na porta X`
3. Se mostrar erro MongoDB → MONGO_URI está errada
4. Se mostrar `Servidor rodando` → deve funcionar!

### Passo 4: Forçar Rebuild
Depois de configurar o MONGO_URI:
1. Na aba **"Deploy"** do Render
2. Clique em **"Manual Deploy"** → **"Deploy latest commit"**
3. Aguarde o deploy terminar (pode levar 2-3 minutos)
4. Acesse a URL do serviço novamente

---

## Links Importantes
- **GitHub:** https://github.com/kaua698/registroalimentar.git
- **Render Dashboard:** https://dashboard.render.com
- **URL da aplicação:** https://registroalimentar.onrender.com (ou conforme seu link)

---

## Testar em Qualquer Celular

1. Acesse a URL deployada no celular
2. Adicione à tela inicial (Chrome: menu → "Adicionar à tela inicial")
3. Use normalmente! O app funciona offline depois do primeiro acesso.

