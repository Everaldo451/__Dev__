from typing import Any
from dataclasses import dataclass

@dataclass
class Response():
    body: str|dict[str, Any]
    status: int
