from typing import List, Set
import enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Enum, LargeBinary, Integer, ForeignKey, Column
from sqlalchemy import select, func, and_
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, declared_attr, column_property, aliased
from sqlalchemy.ext.hybrid import hybrid_property
from werkzeug.security import generate_password_hash, check_password_hash

class Base(DeclarativeBase):
    @declared_attr
    @classmethod
    def id(cls):
        for base in cls.__mro__[1:-1]:
            if getattr(base, "__table__", None) is not None:
                return mapped_column(ForeignKey(base.id), primary_key=True)
            else:
                return mapped_column(Integer, primary_key=True, autoincrement=True)
    
    
    

db = SQLAlchemy(model_class=Base)

user_courses = db.Table('user_courses',
    Column('user_id', ForeignKey('user.id')),
    Column('course_id', ForeignKey('course.id'))
)

class UserTypes(enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"

class Languages(enum.Enum):
    PYTHON = "Python"
    JAVASCRIPT = "JavaScript"
    CSHARP = "C#"
    JAVA = "Java"
    PHP = "PHP"

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



class Course(db.Model):

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = mapped_column(String(100), unique=True, nullable=False)
    description = mapped_column(String(1000))
    language: Mapped[Languages] = mapped_column(Enum(Languages, native_enum = False))
    image = mapped_column(LargeBinary(),nullable=False)

    users: Mapped[Set["User"]] = relationship(secondary=user_courses, back_populates="courses")

    student_count = column_property(
        select(func.count(User.id))
        .where(
            and_(
                user_courses.c.user_id == User.id,
                user_courses.c.course_id == id,
                User.user_type == UserTypes.STUDENT,
            )
        )
        .scalar_subquery()
    )

    teachers = column_property(
        select(func.concat(User.first_name + " " + User.last_name))
        .where(
            and_(
                user_courses.c.user_id == User.id,
                user_courses.c.course_id == id,
                User.user_type == UserTypes.TEACHER,
            )
        )
        .scalar_subquery()
    )
