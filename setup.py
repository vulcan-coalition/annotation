try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="vulcan-annotation",
    version="2.8",
    author="Chatavut Viriyasuthee",
    author_email="chatavut@lab.ai",
    description="Vulcan annotation for structured data.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/vulcan-coalition/vulcan_annotation",
    packages=["vulcan_annotation"],
    package_data={},
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.9',
    install_requires=[
        "shortuuid"
    ]
)
