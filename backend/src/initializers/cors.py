from flask_cors import CORS

def cors_initializer(frontend_domain:str, frontend_port:int):
    return CORS(
        origins=f"http://{frontend_domain}:{frontend_port}", 
        supports_credentials=True
    )