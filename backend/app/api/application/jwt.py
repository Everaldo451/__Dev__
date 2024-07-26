from flask import current_app
from jwt import jwk_from_dict,JWT
import base64

def encode(message):

    nmessage = {
        "iss":"http://localhost:5000"
    }

    if dict(message):

        for key, value in dict(message).items():
            nmessage[str(key)] = value

    
    jw = JWT()

    signing_key = jwk_from_dict({
        'kty':'oct',
        'k':base64.urlsafe_b64encode(current_app.secret_key.encode()).decode("utf-8").rstrip("="),
        'alg':'HS256',
        'use':'sig'
    })

    return jw.encode(payload=nmessage, key=signing_key,alg='HS256')