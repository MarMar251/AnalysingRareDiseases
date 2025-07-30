from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import enum
from infrastructure.db.base import Base

class GenderEnum(str, enum.Enum):
    male = "male"
    female = "female"

# Patient table
class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    phone_number = Column(String, unique=True, nullable=False)
    birth_date = Column(DateTime, nullable=False)
    gender = Column(Enum(GenderEnum, name="genderenum"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    patient_diseases = relationship("PatientDisease", back_populates="patient", cascade="all, delete")

