from django.db import migrations


def seed_features(apps, schema_editor):
    SectorFeature = apps.get_model("sectors", "SectorFeature")
    Sector = apps.get_model("sectors", "Sector")

    tickets_feature, _ = SectorFeature.objects.get_or_create(
        slug="tickets",
        defaults={"name": "Chamados", "is_default": True},
    )
    SectorFeature.objects.get_or_create(
        slug="patrimony",
        defaults={"name": "Patrimônio", "is_default": False},
    )

    # Associa "Chamados" a todos os setores existentes
    for sector in Sector.objects.all():
        sector.features.add(tickets_feature)


def reverse_seed(apps, schema_editor):
    SectorFeature = apps.get_model("sectors", "SectorFeature")
    SectorFeature.objects.filter(slug__in=["tickets", "patrimony"]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("sectors", "0002_sector_features"),
    ]

    operations = [
        migrations.RunPython(seed_features, reverse_seed),
    ]
