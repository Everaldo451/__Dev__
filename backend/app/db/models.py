from typing import List, Set
import enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import select, func, alias, and_
from sqlalchemy import String, Boolean, Enum, LargeBinary, Integer, ForeignKey, Column
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, aliased, column_property
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

    courses: Mapped[Set["Course"]] = relationship(secondary=user_courses, back_populates="users")


class Course(db.Model):

    id = mapped_column(Integer, primary_key = True, autoincrement=True)
    name = mapped_column(String(100), unique=True, nullable=False)
    description = mapped_column(String(1000))
    language = mapped_column(String(100),nullable=False)
    image = mapped_column(LargeBinary(),nullable=False)

    users: Mapped[Set["User"]] = relationship(secondary=user_courses, back_populates="courses")

    @hybrid_property
    def students(self):
        return [user for user in filter(lambda user: user.user_type == UserTypes.STUDENT, self.users)]

    @hybrid_property
    def teachers(self):
        return [user for user in filter(lambda user: user.user_type == UserTypes.TEACHER, self.users)]
