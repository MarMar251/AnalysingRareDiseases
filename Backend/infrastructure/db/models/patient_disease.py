from __future__ import annotations

from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from infrastructure.db.base import Base


class PatientDisease(Base):
    __tablename__ = "patient_diseases"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    disease_id = Column(Integer, ForeignKey("diseases.id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # relationships
    patient = relationship("Patient", back_populates="patient_diseases", passive_deletes=True)
    disease = relationship("Disease", back_populates="patient_diseases", passive_deletes=True)
    doctor = relationship("User", back_populates="diseases_assigned", passive_deletes=True)

    def __repr__(self) -> str:
        return f"<PatientDisease id={self.id} patient={self.patient_id} disease={self.disease_id}>"
