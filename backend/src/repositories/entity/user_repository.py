from typing import Any
from .. import IRepository
from abc import abstractmethod

class IUserRepository[User](IRepository[User]):
    
    @abstractmethod
    def authenticate(self, unique_field_value:Any, password:str) -> User|None:
        raise NotImplementedError
        