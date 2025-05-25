from ..routes.course_routes import api as courses
from ..routes.auth_routes import api as auth
from ..routes.user_routes import api as users
from ..routes.me_routes import api as me
from ..routes.csrf_token_routes import api as csrf
from flask_restx import Api

def initialize_api_routers(api:Api):
    api.add_namespace(courses)
    api.add_namespace(auth)
    api.add_namespace(users)
    api.add_namespace(me)
    api.add_namespace(csrf)
