from flask import current_app
from jwt import jwk_from_dict,JWT
import base64
from datetime import datetime, timedelta

class Jwt:

    def encode(self,payload):

        time = datetime.utcnow()

        message = {
            "iss":"http://localhost:5000",
            "iat":time.timestamp(),
            "expire":(time + self._token_expire).timestamp(),
            "token_type":self._token_type
        }

        if dict(payload):

            for key, value in dict(payload).items():
                message[str(key)] = value

    
        jwt = JWT()

        signing_key = jwk_from_dict({
            'kty':'oct',
            'k':base64.urlsafe_b64encode(current_app.secret_key.encode()).decode("utf-8").rstrip("="),
            'alg':'HS256',
            'use':'sig'
        })

        return jwt.encode(payload=message, key=signing_key,alg='HS256')

    def decode(self,jw):

        jwt = JWT()

        signing_key = jwk_from_dict({
            'kty':'oct',
            'k':base64.urlsafe_b64encode(current_app.secret_key.encode()).decode("utf-8").rstrip("="),
            'alg':'HS256',
            'use':'sig'
        })

        return jwt.decode(message=jw,key=signing_key)


class AccessToken(Jwt):

    def __init__(self):
        self._token_type = "access"
        self._token_expire = timedelta(minutes=10)


