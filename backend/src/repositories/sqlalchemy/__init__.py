from typing import Type, get_args
from flask_sqlalchemy.query import Query
from .. import IRepository
from ...db import db


class SQLAlchemyRepository[ModelType](IRepository[ModelType]):

    def __init__(self):
        self.model: Type[ModelType] = get_args(self.__class__.__orig_bases__[0])[0]

    def connect(self):
        self.session = db.session

    def get(self, id) -> ModelType|None:
        self.connect()
        query:Query = self.session.query(self.model)
        return query.get(id)
    
    def list(self) -> list[ModelType]:
        self.connect()
        query:Query = self.session.query(self.model)
        return query.all()
    
    def update(self, instance:ModelType, **kwargs):
        self.connect()
        for attribute_name, attribute_value in kwargs.items():
            if not hasattr(instance, attribute_name):
                raise AttributeError(instance, attribute_name)
            setattr(instance, attribute_name, attribute_value)
        self.session.commit()

    def delete(self, obj:ModelType):
        self.connect()
        self.session.delete(obj)
        self.session.commit()
    
    def create(self, **kwargs):
        self.connect()
        instance = self.model(**kwargs)
        self.session.add(instance)
        self.session.flush()
        self.session.commit()
        return instance
    
    def filter(self, many=False, **kwargs):
        self.connect()
        query = self.session.query(self.model)
        search_result = query.filter_by(**kwargs)
        return search_result.first() if not many else search_result.all()
    
    
    