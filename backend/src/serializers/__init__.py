from typing import Any, Optional
from typing import Type, get_args
from abc import abstractmethod, ABC


class Serializer[T](ABC):
    def __init__(self, obj:Optional[T], data:Optional[dict[str, Any]], many:Optional[bool]=False):
        if (obj is not None and data is not None):
            raise ValueError("You need to serialize or deserialize.")
        self.obj=obj
        self.many=many
        self.data=data
        self.validated_data={}
        self.is_valid = False


    @abstractmethod
    def validate(self):
        raise NotImplementedError

    @abstractmethod
    def serialize(self) -> dict[str, Any]:
        raise NotImplementedError
    
    @abstractmethod
    def deserialize(self) -> T|None:
        raise NotImplementedError
    

    
class SQLAlchemySerializer[ModelType](Serializer[ModelType]):

    def __init__(self, obj, data, many):
        super().__init__(obj, data, many)
        self.model: Type[ModelType] = get_args(self.__class__.__orig_bases__[0])[0]
    

    def validate(self):
        self.data
        return super().validate()
    
    
    def serialize(self):

        if self.many:
            serialized_data = []

            for model in self.obj:
                serialized_model={}
                for attr in self.model.__table__.columns:
                    serialized_model[attr.name]=getattr(model, attr.name)
                serialized_data.append(serialized_model)
                
            return serialized_data
        
        serialized_data={}
        for attr in self.model.__table__.columns:
            serialized_data[attr.name]=getattr(self.obj, attr.name)
        return serialized_data
    



    