"""
Domain entities for the Users bounded context.
Pure Python dataclasses — no Django dependency.
"""
from dataclasses import dataclass, field
from uuid import UUID
import uuid


@dataclass
class UserEntity:
    email: str
    first_name: str
    last_name: str
    is_admin: bool = False
    is_active: bool = False
    id: UUID = field(default_factory=uuid.uuid4)

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()
