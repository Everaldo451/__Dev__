import pytest
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.parsers.custom_types.escaped_html_str import escaped_html_str

def test_simple_html_tag():

    initial_value = "<html>"
    value = escaped_html_str("<html>")

    assert value != initial_value


def test_html_tag_with_attributes():

    initial_value = "<head  name='' src='image.jsx'>"
    value = escaped_html_str("<html>")

    assert value != initial_value

def test_auto_closer_html_tag():

    initial_value = "<html/>"
    value = escaped_html_str("<html>")

    assert value != initial_value


def test_end_html_tag():

    initial_value = "</ html>"
    value = escaped_html_str("<html>")

    assert value != initial_value


