from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

class User(db.Model):

    id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(1000), nullable=True)
    admin = db.Column(db.Boolean)


class Course(db.Model):

    id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(1000))
    language = db.Column(db.String(100),nullable=False)
    image = db.Column(db.LargeBinary(),nullable=False)