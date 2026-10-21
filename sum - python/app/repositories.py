"""Camada de acesso a dados: só SQLAlchemy ORM/Core expressions, sem SQL puro."""
from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from .models import CookieBlackList, Task
from .schemas import TaskStats


def get_task_stats(db: Session, usuario_id: int) -> TaskStats:
    stmt = (
        select(
            func.count(Task.id),
            func.coalesce(func.sum(case((Task.concluida.is_(True), 1), else_=0)), 0),
        )
        .where(Task.userid == usuario_id)  # filtro obrigatório por usuário
    )
    total, concluidas = db.execute(stmt).one()

    return TaskStats(
        usuarioId=usuario_id,
        total=int(total),
        concluidas=int(concluidas),
        pendentes=int(total) - int(concluidas),
    )


def is_token_blacklisted(db: Session, token: str) -> bool:
    stmt = select(CookieBlackList.id).where(CookieBlackList.token == token).limit(1)
    return db.execute(stmt).first() is not None
