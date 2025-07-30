# domain/value_objects/gender.py
from enum import Enum

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
