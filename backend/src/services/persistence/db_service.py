from . import PersistenceService
from ...db import db

class SQLAlchemyService(PersistenceService):

    def connect(self):
        self.connection = db.session
    
    def save(self):
        self.connect()
        self.connection.commit()

    def undo(self):
        self.connect()
        self.connection.rollback()