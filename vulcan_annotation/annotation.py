"""
version: 2.6
added: queryMetadata
"""


import json
import os
import shortuuid


class Annotation:

    def __init__(self, category):
        self.id = shortuuid.uuid()
        self.inputType = category["inputType"] if "inputType" in category else None
        self.key = category["key"] if "key" in category else None
        self.description = category["description"] if "description" in category else self.key
        self.required = category["required"] if "required" in category else False
        self.metadata = category["metadata"] if "metadata" in category else None
        self.children = []
        if "choices" in category:
            for child in category["choices"]:
                self.children.append(Annotation(child))

    def __querySelector(self, annotation, tokens):
        token = tokens[0]
        parts = token.split(".")

        if annotation["key"] == parts[0] or parts[0] == "*":
            tokens = tokens[1:]
            if len(tokens) == 0:
                if len(parts) == 1:
                    return True if self.inputType is None else annotation["value"]
                elif parts[1] == "description":
                    return self.description
                elif parts[1] == "key":
                    return self.key
                elif parts[1] == "inputType":
                    return self.inputType

        if "value" in annotation:
            value = annotation["value"]
            if isinstance(value, list):
                for c in self.children:
                    for child in value:
                        if c.key == child["key"]:
                            result = c.__querySelector(child, tokens)
                            if result is not None:
                                return result
                            break
            elif isinstance(value, dict):
                for c in self.children:
                    if c.key == value["key"]:
                        return c.__querySelector(value, tokens)

        return None

    def querySelector(self, annotation, selector, value_first=False):
        tokens = selector.split(" ")
        if value_first:
            result = self.__querySelector(
                {"key": None, "value": annotation}, tokens)
        else:
            result = self.__querySelector(annotation, tokens)
        return None if result is None else result

    def __traverse(self, annotation, handler):
        handler(self, annotation)
        if "value" in annotation:
            value = annotation["value"]
            if isinstance(value, list):
                for c in self.children:
                    for child in value:
                        if c.key == child["key"]:
                            c.__traverse(child, handler)
            elif isinstance(value, dict):
                for c in self.children:
                    if c.key == value["key"]:
                        c.__traverse(value, handler)

    def traverse(self, annotation, handler, value_first=False):
        if value_first:
            self.__traverse({"key": None, "value": annotation}, handler)
        else:
            self.__traverse(annotation, handler)

    def get_all_nodes(self):
        nodes = [self]
        for c in self.children:
            nodes += c.get_all_nodes()
        return nodes

    def __queryMetadata(self, tokens):
        token = tokens[0]
        parts = token.split(".")

        if self.key == parts[0] or parts[0] == "*":
            tokens = tokens[1:]
            if len(tokens) == 0:
                if len(parts) == 1:
                    return None
                elif parts[1] == "description":
                    return self.description
                elif parts[1] == "key":
                    return self.key
                elif parts[1] == "inputType":
                    return self.inputType

        if isinstance(self.children, list):
            for c in self.children:
                result = c.__queryMetadata(tokens)
                if result is not None:
                    return result

        return None

    def queryMetadata(self, selector):
        tokens = selector.split(" ")
        result = self.__queryMetadata(tokens)
        return None if result is None else result


if __name__ == '__main__':
    pass
