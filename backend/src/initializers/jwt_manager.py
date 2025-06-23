from ..services.jwt_service import create_token_blocklist_loader, user_loader
from ..repositories import IRepository
from flask_jwt_extended import JWTManager

def jwt_manager_initializer(persistence_repository:IRepository):
    jwt_manager = JWTManager()
    jwt_manager.token_in_blocklist_loader(
        create_token_blocklist_loader(persistence_repository)
    )
    jwt_manager.user_lookup_loader(user_loader)
    
    return jwt_manager