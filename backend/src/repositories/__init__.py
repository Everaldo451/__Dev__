from abc import ABC, abstractmethod
from ..db import db

class Repository[T](ABC):
    
    @abstractmethod
    def get(self, id:int) -> T|None:
        raise NotImplementedError
    
    @abstractmethod
    def get_all(self) -> list[T]:
        raise NotImplementedError
    
    @abstractmethod
    def update(self, instance, **kwargs) -> None:
        raise NotImplementedError
    
    @abstractmethod
    def delete(self, obj) -> None:
        raise NotImplementedError
    
    @abstractmethod
    def create(self, **kwargs) -> T:
        raise NotImplementedError
    
    @abstractmethod
    def filter_by(self, many=False, **kwargs) -> T|list[T]:
        raise NotImplementedError
