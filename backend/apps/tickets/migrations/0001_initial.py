import uuid
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("sectors", "0001_initial"),
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="TicketStatus",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=100, verbose_name="Nome")),
                ("is_default", models.BooleanField(default=False, verbose_name="Padrão")),
                ("order", models.PositiveSmallIntegerField(default=0, verbose_name="Ordem")),
                ("sector", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="custom_statuses", to="sectors.sector", verbose_name="Setor")),
            ],
            options={"db_table": "ticket_statuses", "verbose_name": "Status de chamado", "verbose_name_plural": "Status de chamados", "ordering": ["order", "name"], "unique_together": {("name", "sector")}},
        ),
        migrations.CreateModel(
            name="Ticket",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("title", models.CharField(max_length=200, verbose_name="Título")),
                ("description", models.TextField(verbose_name="Descrição")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="Criado em")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="Atualizado em")),
                ("requesting_sector", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="requested_tickets", to="sectors.sector", verbose_name="Setor solicitante")),
                ("responsible_sector", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="responsible_tickets", to="sectors.sector", verbose_name="Setor responsável")),
                ("status", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="tickets", to="tickets.ticketstatus", verbose_name="Status")),
                ("created_by", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="created_tickets", to="users.user", verbose_name="Criado por")),
                ("updated_by", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="updated_tickets", to="users.user", verbose_name="Atualizado por")),
            ],
            options={"db_table": "tickets", "verbose_name": "Chamado", "verbose_name_plural": "Chamados", "ordering": ["-created_at"]},
        ),
    ]
