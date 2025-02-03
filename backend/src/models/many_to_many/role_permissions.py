from sqlalchemy import Column, ForeignKey
from ...db import db

role_permissions = db.Table("role_permissions",
    Column('role_id', ForeignKey('role.id')),
    Column('permission_id', ForeignKey('permission.id'))                       
)
