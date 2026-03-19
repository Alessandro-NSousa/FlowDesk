"""
Domain entities for the Tickets bounded context.
"""
from dataclasses import dataclass, field
from enum import Enum
from uuid import UUID
import uuid


class DefaultStatus(str, Enum):
    PENDING = "Pendente"
    OPEN = "Em Aberto"
    DONE = "Concluído"


@dataclass
class TicketEntity:
    title: str
    description: str
    requesting_sector_id: UUID
    responsible_sector_id: UUID
    created_by_id: UUID
    id: UUID = field(default_factory=uuid.uuid4)
