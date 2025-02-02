from flask_wtf.form import FlaskForm
from functools import wraps
import logging
from typing import Callable

def get_form(form_object:FlaskForm, formdata:Callable|None, **form_kwargs):
    if formdata:
        return form_object(formdata=formdata(),**form_kwargs)
    else:
        return form_object(**form_kwargs)


def validate_data_on_submit(form_object:FlaskForm, formdata:Callable|None=None, **form_kwargs):

    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            form = get_form(form_object, formdata, **form_kwargs)
            if not form.validate_on_submit():
                logging.error(dict(form.errors))
                return {"message":"Invalid credentials.", "errors": dict(form.errors)}, 400
            
            return fn(*args, **kwargs)
        
        return decorator
    return wrapper


def validate_data(form_object:FlaskForm, formdata:Callable|None=None, **form_kwargs):

    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            form = get_form(form_object, formdata, **form_kwargs)
            if not form.validate():
                logging.error(dict(form.errors))
                return {"message":"Invalid credentials.", "errors": dict(form.errors)}, 400
            
            return fn(*args, **kwargs)
        
        return decorator
    return wrapper

