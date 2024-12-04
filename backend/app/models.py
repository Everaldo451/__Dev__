from typing import List
import enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import select, func, alias, and_
from sqlalchemy import String, Boolean, Enum, LargeBinary, Integer, ForeignKey, Column
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, aliased
from sqlalchemy.ext.hybrid import hybrid_property

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

user_courses = db.Table('user_courses',
    Column('user_id', ForeignKey('user.id')),
    Column('course_id', ForeignKey('course.id'))
)

class UserTypes(enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"

class User(db.Model):

    id = mapped_column(Integer, primary_key=True, autoincrement=True)
    username = mapped_column(String(50),unique=True, nullable=False)
    email = mapped_column(String(100),unique=True, nullable=False)
    password = mapped_column(String(1000), nullable=False)
    user_type: Mapped[UserTypes] = mapped_column(Enum(UserTypes, native_enum = False))
    admin = mapped_column(Boolean(), default=False)

    courses: Mapped[List["Course"]] = relationship(secondary=user_courses)


class Course(db.Model):

    id = mapped_column(Integer, primary_key = True, autoincrement=True)
    name = mapped_column(String(100), unique=True, nullable=False)
    description = mapped_column(String(1000))
    language = mapped_column(String(100),nullable=False)
    image = mapped_column(LargeBinary(),nullable=False)

    users: Mapped[List["User"]] = relationship(
        secondary=user_courses, back_populates="courses"
    )

    @hybrid_property
    def students(self):
        user_alias = aliased(User)
        return select(user_alias).where(
            and_(
                user_courses.c.course_id == self.id,
                user_courses.c.user_id == user_alias.id,
                user_alias.user_type == UserTypes.STUDENT
            )
        )

    @hybrid_property
    def teachers(self):
        user_alias = aliased(User)
        return select(user_alias).where(
            and_(
                user_courses.c.course_id == self.id,
                user_courses.c.user_id == user_alias.id,
                user_alias.user_type == UserTypes.TEACHER
            )
        )