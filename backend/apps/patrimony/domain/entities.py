"""
Domain entities for the Patrimony bounded context.
"""
from dataclasses import dataclass, field
from uuid import UUID
import uuid
from typing import Optional


@dataclass
class PatrimonyEntity:
    number: str
    name: str
    sector_id: UUID
    adhesion_date: str
    condition: str
    situation: str
    user_id: Optional[UUID] = None
    write_off_date: Optional[str] = None
    id: UUID = field(default_factory=uuid.uuid4)
