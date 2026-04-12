from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("sectors", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="SectorFeature",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("slug", models.CharField(max_length=50, unique=True, verbose_name="Slug")),
                ("name", models.CharField(max_length=100, verbose_name="Nome")),
                ("is_default", models.BooleanField(
                    default=False,
                    help_text="Habilitada automaticamente em novos setores.",
                    verbose_name="Padrão",
                )),
            ],
            options={
                "db_table": "sector_features",
                "verbose_name": "Funcionalidade de setor",
                "verbose_name_plural": "Funcionalidades de setor",
                "ordering": ["name"],
            },
        ),
        migrations.AddField(
            model_name="sector",
            name="features",
            field=models.ManyToManyField(
                blank=True,
                related_name="sectors",
                to="sectors.sectorfeature",
                verbose_name="Funcionalidades",
            ),
        ),
    ]
