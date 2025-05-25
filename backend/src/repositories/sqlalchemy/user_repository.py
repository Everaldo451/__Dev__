from . import SQLAlchemyRepository
from ...models.user_model import User
from ..entity.user_repository import IUserRepository


class UserRepository(SQLAlchemyRepository[User], IUserRepository[User]):

    def authenticate(self, unique_field_value, password):
        return User.authenticate(unique_field_value, password)
        