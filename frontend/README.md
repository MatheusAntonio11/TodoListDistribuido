# Front-end – Multi API TodoList

HTML + CSS + JavaScript (ES modules), sem build.

## Rodar
Módulos ES não funcionam via `file://`; sirva a pasta em **http://localhost:5173**
(origem que está liberada no CORS dos serviços):

```bash
cd frontend
python3 -m http.server 5173      # ou: npx serve -l 5173
```

## Configurar (js/api.js)
- `API_CONFIG`: URLs da API Node, do Laravel (terminando em /api) e do Python.
- `ROUTES`: caminhos da API Node (login, cadastro, logout, tarefas). Ajuste ao que você realmente tem.

## O que usa cada serviço
| Tela | Serviço |
|---|---|
| Login / cadastro / sair / tarefas | API Node |
| Estatísticas | Python (`GET /stats`) |
| Histórico de atividades | Laravel (`GET /logs`) |

## Requisitos nos backends
- Node: CORS com `origin: "http://localhost:5173"` e `credentials: true`.
- Laravel e Python: `CORS_ALLOWED_ORIGINS=http://localhost:5173` e mesmo `JWT_SECRET` / `JWT_COOKIE_NAME` da API Node.
