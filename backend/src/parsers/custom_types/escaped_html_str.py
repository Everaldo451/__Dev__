import re
from html import escape

def escaped_html_str(value:str):
    if not isinstance(value, str):
        raise ValueError("The value should be a string.")

    return escape(value, quote=False)

escaped_html_str.__schema__ = {"type": "string", "format": "no-html-string"}
