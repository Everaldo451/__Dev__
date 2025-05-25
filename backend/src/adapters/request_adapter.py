from typing import Any
from flask import Request as FlaskRequest
from ..types.request import Request

class RequestAdapter:

    @classmethod
    def adapt_request(self, request:FlaskRequest, user:Any|None) -> Request:
        return Request(
            headers=dict(request.headers),
            body=request.get_json(silent=True) or request.form.to_dict(),
            cookies=request.cookies,
            content_type=request.content_type,
            url=request.url,
            endpoint=request.endpoint,
            user=user
        )