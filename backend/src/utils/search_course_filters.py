from ..models.course_model import Course, Languages
from ..models.user_model import User

def add_name_filter(name:str, filters:list):
    if name:
        filters.append(Course.name.ilike(f'%{name}%'))


def add_price_filter(price:list[int,int], filters:list):
    if price:
        try:
            min_value, max_value = price
            filters.append(Course.price>=min_value)
            filters.append(Course.price<=max_value)
            return {"error": False}
        except:
            return {"error":True, "message": "Invalid values.", "status": 400}
        
    return {"error":False}


def add_language_filter(language:str, filters:list):
    try:
        filters.append(Course.language == Languages(language))
    except ValueError as error: pass


def add_user_is_not_current_filter(current_user:User|None, filters:list):
    if current_user != None:
        filters.append(~Course.users.any(User.id == current_user.id))


def add_user_is_current_filter(current_user:User|None, filters:list):
    if current_user != None:
        filters.append(Course.users.any(User.id == current_user.id))