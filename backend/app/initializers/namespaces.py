from ..namespaces.csrf import api as csrf
from ..namespaces.courses import api as courses
from ..namespaces.auth import api as auth
from ..namespaces.users import api as users
from ..namespaces.me import api as me
from flask_restx import Api

def initialize_namespaces(api:Api):
    api.add_namespace(csrf)
    api.add_namespace(courses)
    api.add_namespace(auth)
    api.add_namespace(users)
    api.add_namespace(me)
