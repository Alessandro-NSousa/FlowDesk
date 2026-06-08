from django.db import migrations


HR_FEATURES = [
    ("hr-employees", "Colaboradores"),
    ("hr-recruitment", "Recrutamento e Seleção"),
    ("hr-leave", "Férias e Ausências"),
    ("hr-performance", "Avaliação de Desempenho"),
    ("hr-training", "Treinamento e Desenvolvimento"),
]


def seed_hr_features(apps, schema_editor):
    SectorFeature = apps.get_model("sectors", "SectorFeature")

    for slug, name in HR_FEATURES:
        SectorFeature.objects.update_or_create(
            slug=slug,
            defaults={"name": name, "is_default": False},
        )


def reverse_seed_hr_features(apps, schema_editor):
    SectorFeature = apps.get_model("sectors", "SectorFeature")
    SectorFeature.objects.filter(slug__in=[slug for slug, _ in HR_FEATURES]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("sectors", "0003_seed_features"),
    ]

    operations = [
        migrations.RunPython(seed_hr_features, reverse_seed_hr_features),
    ]