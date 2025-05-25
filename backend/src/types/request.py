from typing import Any, Optional
from dataclasses import dataclass

@dataclass
class Request():
    headers: dict[str, str]
    body: str|dict[str, Any]
    cookies: dict[str, str]
    content_type: str
    url: str
    endpoint: Optional[str]
    user: Any|None
