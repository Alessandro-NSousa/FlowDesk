"""
Domain entities for the Sectors bounded context.
"""
from dataclasses import dataclass, field
from uuid import UUID
import uuid


@dataclass
class SectorEntity:
    name: str
    description: str = ""
    id: UUID = field(default_factory=uuid.uuid4)
