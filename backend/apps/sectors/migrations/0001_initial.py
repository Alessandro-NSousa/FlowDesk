import uuid
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Sector",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=100, unique=True, verbose_name="Nome")),
                ("description", models.TextField(blank=True, verbose_name="Descrição")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="Criado em")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="Atualizado em")),
                ("members", models.ManyToManyField(blank=True, related_name="sectors", to="users.user", verbose_name="Membros")),
            ],
            options={"db_table": "sectors", "verbose_name": "Setor", "verbose_name_plural": "Setores", "ordering": ["name"]},
        ),
    ]
