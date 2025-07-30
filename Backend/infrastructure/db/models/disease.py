from __future__ import annotations

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from infrastructure.db.base import Base
from sqlalchemy import Text

class Disease(Base):
    __tablename__ = "diseases"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    doctor_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    description = Column(Text, nullable=False) 

    doctor = relationship(
        "User",
        back_populates="diseases_added",
        passive_deletes=True,
        foreign_keys=[doctor_id],
    )
    patient_diseases = relationship(
        "PatientDisease",
        back_populates="disease",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __repr__(self) -> str:
        return f"<Disease id={self.id} name={self.name}>"