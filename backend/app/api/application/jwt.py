from flask import current_app, request, make_response
from jwt import jwk_from_dict,JWT
import base64
from datetime import datetime, timedelta
from .exceptions import JWTExceptions

def jwt_authorization_verify(function):
    def verify(*args, **kwargs):
        access = AccessToken()
        refresh = RefreshToken()

        try:
                
            jwt = access.decode(request.authorization.token)

            return function(*args, **kwargs)
        
        except:
            pass

        

        try:

            response = make_response({"message":"Unauthorized","code":1})
            response.status_code = 401

            jwt = refresh.decode(request.cookies.get("refresh"))

            response.set_cookie("access",access.encode(jwt))

            return response
            
        except: 

            response = make_response({"message":"Unauthorized","code":2})
            response.status_code = 401
            
            return response
        
    verify.__name__ = function.__name__
        
    return verify


class Jwt:

    def __init__(self):
        self._jwt_headers = ["iss","iat","expire","token_type"]

    #ENCODE

    def encode(self,payload:dict) -> str:

        time = datetime.utcnow()

        message = {
            "iss":"http://localhost:5000",
            "iat":time.timestamp(),
            "expire":(time + self._token_expire).timestamp(),
            "token_type":self._token_type
        }

        for key, value in payload.items():
            message[str(key)] = value
        
    
        jwt = JWT()

        if current_app.secret_key:

            signing_key = jwk_from_dict({
                'kty':'oct',
                'k':base64.urlsafe_b64encode(current_app.secret_key.encode()).decode("utf-8").rstrip("="),
                'alg':'HS256',
                'use':'sig'
            })

        else: raise ValueError("Secret Key cannot be null")

        return jwt.encode(payload=message, key=signing_key,alg='HS256')
    

    #DECODE

    def decode(self,jw:str) -> dict:

        jwt = JWT()

        if current_app.secret_key:

            signing_key = jwk_from_dict({
                'kty':'oct',
                'k':base64.urlsafe_b64encode(current_app.secret_key.encode()).decode("utf-8").rstrip("="),
                'alg':'HS256',
                'use':'sig'
            })
        
        else: raise ValueError("Secret Key cannot be null")

        token = jwt.decode(message=jw,key=signing_key)

        if self._token_type and token.get("token_type") == self._token_type:

            if int(token.get("expire")) > datetime.utcnow().timestamp():

                message = jwt.decode(message=jw,key=signing_key)

                for v in self._jwt_headers:

                    message.pop(v)

                return message
            
            else: raise JWTExceptions().TokenLifetimeExceded("Tempo do token excedido")
        
        else: raise JWTExceptions().TokenTypeError("Incorrect Token Type")

    def lifetime(self):
        return self._token_expire


class AccessToken(Jwt):

    def __init__(self):
        super().__init__()
        self._token_type = "access"
        self._token_expire = timedelta(minutes=10)

class RefreshToken(Jwt):

    def __init__(self):
        super().__init__()
        self._token_type = "refresh"
        self._token_expire = timedelta(days=1)


