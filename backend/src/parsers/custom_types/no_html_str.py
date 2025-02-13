import re

def no_html_str(value:str):
    if not isinstance(value, str):
        raise ValueError("The value should be a string.")

    regex = r"(?=<(\/)?(\s*\w+\s*)(\w+(=(\"|\').*(\"|\'))?\s*)*(\/)?>)"
    result = re.search(regex, value)

    if result is not None:
        raise ValueError("The value cannot contain html tags.")
    return value

no_html_str.__schema__ = {"type": "string", "format": "no-html-string"}
