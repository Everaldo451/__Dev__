from typing import TYPE_CHECKING, Set
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .permission_model import Permission
from .user_model import User
from .many_to_many.user_roles import user_roles
from .many_to_many.role_permissions import role_permissions
from ..db import db, ModelMixin

if TYPE_CHECKING:
    from .permission_model import Permission

class Role(db.Model, ModelMixin):

    name = mapped_column(String(100), unique=True)
    permissions: Mapped[Set['Permission']] = relationship(secondary=role_permissions, back_populates="roles")
    users: Mapped[Set['User']] = relationship(secondary=user_roles, back_populates="roles")