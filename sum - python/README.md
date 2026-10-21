# Serviço 3 – Analisador de Tarefas (Python + FastAPI + SQLAlchemy)

## Rodar
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env     # ajuste banco e JWT_SECRET
uvicorn app.main:app --port 8002 --reload
```

## Endpoints
| Método | Rota | Auth | Resposta |
|---|---|---|---|
| GET | /stats | JWT (cookie ou Bearer) | estatísticas do usuário do token |
| GET | /stats/{usuarioId} | JWT | idem, mas 403 se o id != id do token |
| GET | /health | — | status |

```json
{ "usuarioId": 1, "total": 10, "concluidas": 6, "pendentes": 4 }
```