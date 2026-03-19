import django_filters
from apps.tickets.infrastructure.models import Ticket


class TicketFilter(django_filters.FilterSet):
    """RF24 – Filtros por status, setor e data."""
    status = django_filters.UUIDFilter(field_name="status__id")
    requesting_sector = django_filters.UUIDFilter(field_name="requesting_sector__id")
    responsible_sector = django_filters.UUIDFilter(field_name="responsible_sector__id")
    created_after = django_filters.DateTimeFilter(field_name="created_at", lookup_expr="gte")
    created_before = django_filters.DateTimeFilter(field_name="created_at", lookup_expr="lte")

    class Meta:
        model = Ticket
        fields = ["status", "requesting_sector", "responsible_sector", "created_after", "created_before"]
