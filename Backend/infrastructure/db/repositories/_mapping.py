# infrastructure/db/repositories/_mapping.py
from typing import TypeVar, Type, Any, Dict
import inspect

T = TypeVar("T")
M = TypeVar("M")


def orm_to_entity(orm_obj: M, entity_cls: Type[T], extra: Dict[str, Any] | None = None) -> T:
    """
    Convert a SQLAlchemy ORM instance to a pure Domain Entity.

    • Copies only fields accepted by the entity's __init__ signature.
    • Adds `extra` overrides if provided.
    """
    # All column names/values from ORM
    raw_data = {c.name: getattr(orm_obj, c.name) for c in orm_obj.__table__.columns}

    # Keep only parameters the Entity constructor accepts
    ctor_params = set(inspect.signature(entity_cls).parameters)
    
    if "created_by" in ctor_params and "created_by" not in raw_data and "doctor_id" in raw_data:
        raw_data["created_by"] = raw_data["doctor_id"]
    
    if "assigned_by" in ctor_params and "assigned_by" not in raw_data and "doctor_id" in raw_data:
        raw_data["assigned_by"] = raw_data["doctor_id"]

    data = {k: v for k, v in raw_data.items() if k in ctor_params}

    if extra:
        data.update(extra)

    return entity_cls(**data)
