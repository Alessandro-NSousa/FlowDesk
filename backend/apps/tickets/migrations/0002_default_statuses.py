"""Data migration – cria os três status padrão (RF18)."""
import uuid
from django.db import migrations


DEFAULT_STATUSES = [
    {"name": "Pendente", "order": 0},
    {"name": "Em Aberto", "order": 1},
    {"name": "Concluído", "order": 2},
]


def create_default_statuses(apps, schema_editor):
    TicketStatus = apps.get_model("tickets", "TicketStatus")
    for s in DEFAULT_STATUSES:
        TicketStatus.objects.get_or_create(
            name=s["name"],
            sector=None,
            defaults={"is_default": True, "order": s["order"]},
        )


def reverse_default_statuses(apps, schema_editor):
    TicketStatus = apps.get_model("tickets", "TicketStatus")
    TicketStatus.objects.filter(is_default=True, sector=None).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("tickets", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_default_statuses, reverse_default_statuses),
    ]
