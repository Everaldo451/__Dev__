from app.app import create_app
import os
from dotenv import load_dotenv


if __name__ == "main":
    load_dotenv()
    
    HOST = os.getenv("HOST")
    PORT = os.getenv("PORT")

    app = create_app()
    app.run(host=HOST, port=PORT)