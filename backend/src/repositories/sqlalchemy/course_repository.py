from . import SQLAlchemyRepository
from ...models.course_model import Course
from ..entity.course_repository import ICourseyRepository

class CourseRepository(SQLAlchemyRepository[Course], ICourseyRepository[Course]):
    pass