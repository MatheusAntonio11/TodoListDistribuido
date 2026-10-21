from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..auth import AuthUser, get_current_user
from ..database import get_db
from ..repositories import get_task_stats
from ..schemas import TaskStats

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("", response_model=TaskStats)
def my_stats(user: AuthUser = Depends(get_current_user), db: Session = Depends(get_db)):
    """Estatísticas do usuário autenticado (o id vem do token, nunca do cliente)."""
    return get_task_stats(db, user.id)


@router.get("/{usuario_id}", response_model=TaskStats)
def stats_by_id(
    usuario_id: int,
    user: AuthUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Autorização: só é possível consultar o próprio id."""
    if usuario_id != user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Acesso negado a dados de outro usuário.")
    return get_task_stats(db, usuario_id)
