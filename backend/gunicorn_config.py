from dotenv import load_dotenv
import os

bind = f"{os.getenv("HOST")}:{os.getenv("PORT")}"
workers = 2