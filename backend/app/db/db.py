from flask import Request, g
from sqlalchemy import create_engine, Engine
from sqlalchemy.orm import Session
from sqlalchemy.exc import DatabaseError
from dotenv import load_dotenv
import os
import logging

testing_session = None

def connect_db(request=None, TESTING=False):
    load_dotenv()
    logging.basicConfig(level="DEBUG")
    is_testing = False

    try:

        if os.getenv("FLASK_ENV") == "development" and TESTING:
            is_testing = True
            engine = create_engine("sqlite://:memory:")
        else:
            engine = create_engine(os.getenv("DATABASE_URI"))
    
        if isinstance(request, Request):
            if not g.get('db'):
                g.db = Session(engine) if is_testing == False else testing_conn(engine)
            return g.db

        if is_testing:
            return testing_conn(engine)
        
        session = Session(engine)
        return session
    
    except DatabaseError as error:
        logging.error(error.code)
        return None


def testing_conn(engine:Engine):
    global testing_session

    if testing_session is None:
        session = Session(engine)
        testing_session = session
    
    return testing_session