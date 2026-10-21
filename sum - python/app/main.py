from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import stats

app = FastAPI(title="Serviço 3 - Analisador de Tarefas")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,  # origem exata (necessário com cookies)
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(stats.router)


@app.get("/health")
def health():
    return {"status": "ok"}
