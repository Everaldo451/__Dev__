from sqlalchemy import Column, ForeignKey
from ...db import db

user_courses = db.Table('user_courses',
    Column('user_id', ForeignKey('user.id')),
    Column('course_id', ForeignKey('course.id'))
)