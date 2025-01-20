from typing import Set
from sqlalchemy import String, Enum, LargeBinary, Integer, Column, DateTime
from sqlalchemy import select, func, and_
from sqlalchemy.orm import Mapped, mapped_column, relationship, column_property
import datetime
from .user_courses_table import user_courses
from .user_model import User, UserTypes
from ..db import db
from ..enums import Languages


class Course(db.Model):

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = mapped_column(String(100), unique=True, nullable=False)
    description = mapped_column(String(1000))
    language: Mapped[Languages] = mapped_column(Enum(Languages, native_enum = False))
    image = mapped_column(LargeBinary(),nullable=False)
    image_mime_type = mapped_column(String(50),nullable=False)
    date_created = mapped_column(DateTime(False), default=lambda: datetime.datetime.now(datetime.timezone.utc))

    users: Mapped[Set["User"]] = relationship("User", secondary=user_courses, back_populates="courses")

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
        select(func.concat(User.first_name," ",User.last_name))
        .where(
            and_(
                user_courses.c.user_id == User.id,
                user_courses.c.course_id == id,
                User.user_type == UserTypes.TEACHER,
            )
        )
        .scalar_subquery()
    )
