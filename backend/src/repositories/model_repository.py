from typing import Generic, Type, get_args
from sqlalchemy.orm import Session
from flask_sqlalchemy.query import Query
from . import Repository

class ModelRepository[ModelType](Repository[ModelType]):

    def __init__(self, session:Session):
        self.session = session
        self.model: Type[ModelType] = get_args(self.__class__.__orig_bases__[0])[0]

    def get(self, id) -> ModelType|None:
        query:Query = self.session.query(self.model)
        return query.get(id)
    
    def get_all(self) -> list[ModelType]:
        query:Query = self.session.query(self.model)
        return query.all()
    
    def update(self, instance:ModelType, **kwargs):
        for attribute_name, attribute_value in kwargs.items():
            if not hasattr(instance, attribute_name):
                raise AttributeError(instance, attribute_name)
            setattr(instance, attribute_name, attribute_value)
        self.session.commit()

    def delete(self, obj:ModelType):
        self.session.delete(obj)
        self.session.commit()
    
    def create(self, **kwargs):
        instance = self.model(**kwargs)
        self.session.add(instance)
        self.session.flush()
        self.session.commit()
        return instance
    
    def filter_by(self, many=False, **kwargs):
        query = self.session.query(self.model)
        search_result = query.filter_by(**kwargs)
        return search_result.first() if not many else search_result.all()
    