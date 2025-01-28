from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import DeclarativeBase, mapped_column, declared_attr

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

class ModelMixin():
    def create(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()