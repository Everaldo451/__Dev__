from typing import List
from abc import ABC, abstractmethod

class IRepository[T](ABC):

    @abstractmethod
    def connect(self) -> None:
        raise NotImplementedError
    
    @abstractmethod
    def get(self, id:int) -> T|None:
        raise NotImplementedError
    
    @abstractmethod
    def list(self) -> List[T]:
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
    def filter(self, many=False, **kwargs) -> T|List[T]|None:
        raise NotImplementedError
    