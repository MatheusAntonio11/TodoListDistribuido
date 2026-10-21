"""
Mapeamento (somente leitura) das tabelas criadas pelo Prisma na API Node.
Este serviço NUNCA cria nem altera tabelas: não existe create_all().
"""
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Task(Base):
    __tablename__ = "Task"  # nome gerado pelo Prisma (maiúsculo; o SQLAlchemy aplica aspas)

    # PK composta (id, userid), igual ao schema.prisma
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    userid: Mapped[int] = mapped_column(Integer, primary_key=True)
    titulo: Mapped[str] = mapped_column(String)
    descricao: Mapped[str | None] = mapped_column(String, nullable=True)
    concluida: Mapped[bool] = mapped_column(Boolean, default=False)


class CookieBlackList(Base):
    __tablename__ = "CookieBlackList"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    token: Mapped[str] = mapped_column(String, unique=True)
    user_id: Mapped[int] = mapped_column(Integer)
    expire_at: Mapped[datetime] = mapped_column(DateTime)
