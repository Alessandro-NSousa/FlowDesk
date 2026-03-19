from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="must_change_password",
            field=models.BooleanField(
                default=False,
                verbose_name="Deve trocar a senha",
                help_text="Quando True, o usuário é forçado a definir uma senha pessoal no próximo acesso.",
            ),
        ),
    ]
