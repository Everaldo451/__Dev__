from typing import Set, TYPE_CHECKING
from sqlalchemy import String, Boolean, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.ext.hybrid import hybrid_property
from werkzeug.security import generate_password_hash, check_password_hash
from .many_to_many.user_courses import user_courses
from ..db import db
from ..enums import UserTypes

if TYPE_CHECKING:
    from .course_model import Course

class User(db.Model):

    first_name = mapped_column(String(50), nullable=False)
    last_name = mapped_column(String(100), nullable=False)
    email = mapped_column(String(100),unique=True, nullable=False)
    password = mapped_column(String(50), nullable=False)
    user_type: Mapped[UserTypes] = mapped_column(Enum(UserTypes, native_enum = False), default=UserTypes.STUDENT)
    admin = mapped_column(Boolean(), default=False)

    courses: Mapped[Set["Course"]] = relationship(secondary=user_courses, back_populates="users")

    @hybrid_property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @classmethod
    def authenticate(cls, email:str, password:str):
        user = cls.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password): return user
            return None
        return None

    def _modify_password(self,kwargs:dict):
        if "password" in kwargs:
            kwargs["password"] = generate_password_hash(kwargs.get("password"))

    def __init__(self, **kwargs):
        self._modify_password(kwargs)

        super().__init__(**kwargs)