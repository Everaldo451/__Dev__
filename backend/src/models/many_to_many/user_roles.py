from sqlalchemy import Column, ForeignKey
from ...db import db

user_roles = db.Table('user_roles',
    Column('user_id', ForeignKey('user.id')),
    Column('role_id', ForeignKey('role.id'))
)