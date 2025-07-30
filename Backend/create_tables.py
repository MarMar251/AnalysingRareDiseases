from infrastructure.db.session import engine
from infrastructure.db.models import user, patient, disease, patient_disease
from infrastructure.db.base import Base


def create_all_tables():
    print(" Creating tables in the database...")
    Base.metadata.create_all(bind=engine)
    print(" All tables created successfully.")

if __name__ == "__main__":
    create_all_tables()
