from app.app import create_app
from dotenv import load_dotenv
import os

if __name__ == "main":
    load_dotenv()
    
    HOST = os.getenv("HOST")
    PORT = os.getenv("PORT")

    app = create_app()