from typing import Set
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..db import db, ModelMixin
from .role_model import Role, role_permissions

class Permission(db.Model, ModelMixin):

    name = mapped_column(String(100), unique=True)
    roles: Mapped[Set['Role']] = relationship(secondary=role_permissions, back_populates="permissions")
    