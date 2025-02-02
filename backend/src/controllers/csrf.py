from flask import Blueprint
from flask_restx import Namespace, Resource
from flask_wtf.csrf import CSRFError, generate_csrf

api = Namespace("csrf", path="/csrf")

@api.route("")
class CSRFToken(Resource):

    def get(self):
        print("accessing csrf route")
        return {"csrf":generate_csrf()}


@api.errorhandler(CSRFError)
def error(e):
    return {"message":"error"}, 400

    
    
    
