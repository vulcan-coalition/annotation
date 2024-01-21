from .annotation import Annotation
from . import utilities

import pkg_resources
import os

__version__ = pkg_resources.get_distribution('vulcan_annotation').version

def load_js():
    resource_package = __name__
    resource_path = os.path.join('js', 'vulcan_annotation.js')
    return pkg_resources.resource_string(resource_package, resource_path).decode()


def load_va_dom():
    resource_package = __name__
    resource_path = os.path.join('js', 'va_dom.js')
    return pkg_resources.resource_string(resource_package, resource_path).decode()
