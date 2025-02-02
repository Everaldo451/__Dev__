from ..controllers.csrf import api as csrf
from ..controllers.courses import api as courses
from ..controllers.auth import api as auth
from ..controllers.users import api as users
from ..controllers.me import api as me
from flask_restx import Api

def initialize_api_controllers(api:Api):
    api.add_namespace(csrf)
    api.add_namespace(courses)
    api.add_namespace(auth)
    api.add_namespace(users)
    api.add_namespace(me)
