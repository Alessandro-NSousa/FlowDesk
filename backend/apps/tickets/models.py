# Re-export models so Django's app registry can discover them.
from apps.tickets.infrastructure.models import Ticket, TicketStatus  # noqa: F401
