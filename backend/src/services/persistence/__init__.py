from abc import ABC, abstractmethod


class PersistenceService(ABC):

    def __init__(self):
        pass

    @abstractmethod
    def connect(self):
        raise NotImplementedError
    
    @abstractmethod
    def save(self):
        raise NotImplementedError
    
    @abstractmethod
    def undo(self):
        raise NotImplementedError

