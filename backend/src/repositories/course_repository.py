from . import SQLAlchemyRepository
from ..models.course_model import Course

class CourseRepository(SQLAlchemyRepository[Course]):
    pass