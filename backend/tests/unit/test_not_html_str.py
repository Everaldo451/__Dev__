import pytest
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.parsers.custom_types.no_html_str import no_html_str

def test_simple_html_tag():

    with pytest.raises(ValueError) as excinfo:
        no_html_str("<html>")

    assert excinfo.errisinstance(ValueError)
    assert str(excinfo.value) == "The value cannot contain html tags."


def test_html_tag_with_attributes():

    with pytest.raises(ValueError) as excinfo:
        no_html_str("<head  name='' src='image.jsx'>")

    assert excinfo.errisinstance(ValueError)
    assert str(excinfo.value) == "The value cannot contain html tags."


def test_auto_closer_html_tag():

    with pytest.raises(ValueError) as excinfo:
        no_html_str("<html/>")

    assert excinfo.errisinstance(ValueError)
    assert str(excinfo.value) == "The value cannot contain html tags."


def test_end_html_tag():

    with pytest.raises(ValueError) as excinfo:
        no_html_str("</ html>")

    assert excinfo.errisinstance(ValueError)
    assert str(excinfo.value) == "The value cannot contain html tags."


