import uuid
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("sectors", "0003_seed_features"),
        ("users", "0003_user_can_assign_tickets"),
    ]

    operations = [
        migrations.CreateModel(
            name="Patrimony",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("number", models.CharField(max_length=50, unique=True, verbose_name="Número do patrimônio")),
                ("name", models.CharField(max_length=200, verbose_name="Nome")),
                ("user", models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name="patrimonies",
                    to="users.user",
                    verbose_name="Usuário responsável",
                )),
                ("sector", models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name="patrimonies",
                    to="sectors.sector",
                    verbose_name="Setor",
                )),
                ("adhesion_date", models.DateField(verbose_name="Data de adesão")),
                ("condition", models.CharField(
                    choices=[("Novo", "Novo"), ("Usado", "Usado")],
                    max_length=10,
                    verbose_name="Estado",
                )),
                ("situation", models.CharField(
                    choices=[("Disponível", "Disponível"), ("Depreciado", "Depreciado"), ("Em Uso", "Em Uso")],
                    max_length=15,
                    verbose_name="Situação",
                )),
                ("write_off_date", models.DateField(blank=True, null=True, verbose_name="Data da baixa")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="Criado em")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="Atualizado em")),
            ],
            options={
                "db_table": "patrimonies",
                "verbose_name": "Patrimônio",
                "verbose_name_plural": "Patrimônios",
                "ordering": ["number"],
            },
        ),
    ]
