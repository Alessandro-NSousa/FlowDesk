import uuid
from django.db import models


class Sector(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, verbose_name="Nome")
    description = models.TextField(blank=True, verbose_name="Descrição")
    members = models.ManyToManyField(
        "users.User",
        blank=True,
        related_name="sectors",
        verbose_name="Membros",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    class Meta:
        db_table = "sectors"
        verbose_name = "Setor"
        verbose_name_plural = "Setores"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name
