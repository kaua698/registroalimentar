# Diário de Alimentação Pet

**Quem já comeu hoje? Agora você sabe.**

PWA fullstack para registrar as refeições dos pets da casa e acompanhar a meta de cada um. Mostra quanto cada pet comeu, quando é a próxima refeição, quando a ração vai acabar e se o dia está quente. Funciona no celular como app, abre sem internet e tem tema escuro e claro.

| Hoje | Registrar | Relatório | Tema claro |
|---|---|---|---|
| ![Tela Hoje com metas, próxima refeição, água, ração e clima](docs/screenshots/hoje.png) | ![Registrar refeição em um toque](docs/screenshots/registrar.png) | ![Relatório semanal do pet](docs/screenshots/relatorios.png) | ![Tela Hoje no tema claro](docs/screenshots/hoje-claro.png) |

## Funcionalidades

- **Hoje (dashboard):** anéis com a meta de cada pet, próxima refeição do plano com contagem regressiva, água do dia, dias de ração restantes, clima e as refeições do dia
- **Registrar em um toque:** a quantidade já vem com o que falta para a meta; tipos Ração, Úmida, Petisco e Água; "como foi" (comeu tudo, deixou um pouco, recusou)
- **Pets:** peso, espécie, meta diária com **sugestão calculada pelo peso**, meta de água, horários do plano e estoque de ração
- **Estoque de ração:** informe quanto tem em casa; cada refeição de ração registrada desconta e o app avisa em quantos dias acaba
- **Histórico:** calendário do mês colorido pela meta batida e a lista de cada dia, com edição e exclusão
- **Relatórios:** consumo diário de 7, 14 ou 30 dias contra a meta, média, apetite e **download em CSV**
- **Clima:** com a localização ativada, a máxima do dia vem do Open-Meteo e o app sugere trocar a água 2× em dias acima de 30°
- **Sequência:** quantos dias seguidos todos os pets chegaram a 90% da meta
- **Tema escuro e claro**, salvo no aparelho
- **PWA:** instala no celular, abre offline com os últimos dados; gravações só acontecem com conexão e avisam quando falham

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Front-end | React 19, Vite 8, vite-plugin-pwa (Workbox) |
| Fontes | Bricolage Grotesque e DM Sans (Fontsource, sem depender do Google Fonts) |
| Back-end | Node.js, Express 4, Mongoose 8 |
| Banco | MongoDB (local ou Atlas) |
| API externa | Open-Meteo (clima, sem chave) |
| Deploy | Render (`render.yaml`): um serviço para API e front |

## Rodar localmente

Pré-requisitos: **Node.js 20.19+** e um **MongoDB** (no PC ou um cluster gratuito do MongoDB Atlas).

```bash
git clone https://github.com/kaua698/registroalimentar.git
cd registroalimentar
npm --prefix backend install
npm --prefix frontend install
```

Crie `backend/.env` a partir de `backend/.env.example`:

```env
PORT=3000
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/pet_diary
```

Sem `MONGO_URI`, o servidor usa `mongodb://127.0.0.1:27017/pet_diary`.

**Desenvolvimento** (dois terminais):

```bash
npm run dev:api   # API em http://localhost:3000
npm run dev:web   # app em http://localhost:5173 (o Vite repassa /api para a porta 3000)
```

**Como em produção** (o Express serve o build do front):

```bash
npm run build
npm start         # http://localhost:3000
```

## API

### Registros: `/api/registros`

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/registros?desde=AAAA-MM-DD` | Lista do mais recente ao mais antigo (`desde` é opcional) |
| GET | `/api/registros/:id` | Busca um registro |
| POST | `/api/registros` | Cria |
| PUT | `/api/registros/:id` | Atualiza |
| DELETE | `/api/registros/:id` | Remove |

```json
{
  "nomePet": "Thor",
  "tipoAlimento": "Ração",
  "quantidade": 110,
  "horarioRefeicao": "2026-10-07T10:02:00.000Z",
  "apetite": "tudo",
  "observacoes": ""
}
```

`tipoAlimento`: `Ração`, `Humida`, `Petisco` ou `Água` (quantidade em ml). `apetite`: `tudo`, `pouco` ou `recusou`.

> O valor gravado para comida úmida continua `Humida` para não quebrar registros antigos. A tela mostra **Úmida**.

### Pets: `/api/pets`

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/pets` | Lista os pets |
| POST | `/api/pets` | Cadastra |
| PUT | `/api/pets/:id` | Atualiza (renomear leva os registros junto) |
| DELETE | `/api/pets/:id` | Remove o pet; o histórico continua guardado |

```json
{
  "nome": "Thor",
  "especie": "Cão",
  "peso": 12.4,
  "metaDiaria": 220,
  "metaAgua": 900,
  "horarios": [{ "hora": "07:00", "quantidade": 110, "tipoAlimento": "Ração", "ativo": true }],
  "estoqueGramas": 10000
}
```

Ao mudar `estoqueGramas`, a API grava `estoqueDesde` com a data atual: o consumo de ração passa a ser descontado dali em diante.

Erros de validação ou id inválido respondem `400`; qualquer outra rota em `/api` responde `404` em JSON.

## Como a meta é sugerida

Energia de repouso = 70 × peso^0,75 (kcal). Multiplicada por 1,6 para cães adultos ou 1,2 para gatos adultos e dividida pela energia da ração (3,6 kcal/g como referência). Água: cerca de 55 ml por kg. É só um ponto de partida: o veterinário define a meta certa.

## Funcionamento offline

- O service worker (gerado pelo vite-plugin-pwa) guarda o app inteiro, inclusive as fontes.
- **Leituras** da API e do clima: tenta a rede e, sem internet, usa a última resposta.
- **Gravações** (POST, PUT, DELETE) vão sempre para a rede. Sem internet, o app mostra o aviso e nada é perdido em silêncio.

## Deploy no Render

O `render.yaml` cria um web service:

- **Build:** `npm run build` (instala e gera o front, instala o back)
- **Start:** `npm start`
- **Variável:** `MONGO_URI` (defina no painel do Render)

## Estrutura

```
registroalimentar/
├── backend/
│   ├── controllers/   registroAlimentarController.js, petController.js
│   ├── models/        RegistroAlimentar.js, Pet.js
│   ├── routes/        registroAlimentarRoutes.js, petRoutes.js
│   ├── server.js      API + arquivos do front (frontend/dist)
│   └── .env.example
├── frontend/
│   ├── public/icons/
│   ├── src/
│   │   ├── App.jsx           abas, carregamento e gravações
│   │   ├── screens/          Hoje, Registrar, Historico, Relatorios, Pets, Ajustes
│   │   ├── components/       ícones, anéis, folha de baixo, avisos
│   │   ├── lib/              api, cálculos (metas, estoque, sequência), datas, tema, clima
│   │   └── styles.css        tokens dos temas escuro e claro
│   ├── index.html
│   └── vite.config.js        PWA e proxy de desenvolvimento
├── docs/screenshots/
├── render.yaml
└── package.json              scripts de build, start e dev
```

## Limitações conhecidas

- Não há login: todos que acessam a mesma instância veem os mesmos pets e registros.
- Gravações feitas sem internet não entram em fila; é preciso registrar de novo quando a conexão voltar.
- O pet é ligado aos registros pelo nome (compatível com a versão 1).

## Próximos passos

- Fila de gravações offline com envio automático
- Lembretes dos horários com notificações do PWA
- Leitura do código de barras da ração (Open Pet Food Facts)
- Contas e família compartilhando os mesmos pets

## Autor

Feito por **Kauã Oliveira Matos Borba**: [GitHub](https://github.com/kaua698) · [LinkedIn](https://www.linkedin.com/in/kau%C3%A3-oliveira-9212153a9/)
