from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

user_courses = db.Table('user_courses',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('course_id', db.Integer, db.ForeignKey('course.id'))
)

class User(db.Model):

    id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(1000), nullable=True)
    courses = db.relationship('Course', secondary=user_courses, backref='users')
    admin = db.Column(db.Boolean, default=False)



class Course(db.Model):

    id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(1000))
    language = db.Column(db.String(100),nullable=False)
    image = db.Column(db.LargeBinary(),nullable=False)