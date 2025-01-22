from dotenv import load_dotenv
import os

load_dotenv()

bind = f"{os.getenv("HOST")}:{os.getenv("PORT")}"
workers = 1