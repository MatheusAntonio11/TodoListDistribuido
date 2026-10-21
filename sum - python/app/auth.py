from dataclasses import dataclass

import jwt
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from .config import settings
from .database import get_db
from .repositories import is_token_blacklisted


@dataclass(frozen=True)
class AuthUser:
    id: int
    email: str | None
    nome: str | None


def _extract_token(request: Request) -> str | None:
    header = request.headers.get("Authorization", "")
    if header.lower().startswith("bearer "):
        return header[7:].strip()
    return request.cookies.get(settings.jwt_cookie_name)


def get_current_user(request: Request, db: Session = Depends(get_db)) -> AuthUser:
    """Autenticação: valida o JWT HS256 emitido pela API Node."""
    token = _extract_token(request)
    if not token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token ausente.")

    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token inválido ou expirado.")

    user_id = payload.get("id")
    if not isinstance(user_id, int):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token sem id de usuário.")

    # Banco compartilhado: respeita o logout feito na API Node
    if settings.check_blacklist and is_token_blacklisted(db, token):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Sessão encerrada.")

    return AuthUser(id=user_id, email=payload.get("email"), nome=payload.get("nome"))
