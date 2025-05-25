from . import SQLAlchemyRepository
from ..models.user_model import User

class UserRepository(SQLAlchemyRepository[User]):
    pass
        