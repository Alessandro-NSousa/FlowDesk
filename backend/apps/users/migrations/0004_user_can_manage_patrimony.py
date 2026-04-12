from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_user_can_assign_tickets'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='can_manage_patrimony',
            field=models.BooleanField(
                default=False,
                help_text='Quando True, o usuário pode criar, editar e excluir patrimônios nos setores que possui acesso.',
                verbose_name='Pode gerenciar patrimônio',
            ),
        ),
    ]
