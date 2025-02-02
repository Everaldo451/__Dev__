import enum

class UserTypes(enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"

class Languages(enum.Enum):
    PYTHON = "Python"
    JAVASCRIPT = "JavaScript"
    CSHARP = "C#"
    JAVA = "Java"
    PHP = "PHP"