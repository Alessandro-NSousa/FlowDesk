import uuid
from django.db import models


class SectorFeature(models.Model):
    """Funcionalidade que pode ser habilitada em um setor."""
    slug = models.CharField(max_length=50, unique=True, verbose_name="Slug")
    name = models.CharField(max_length=100, verbose_name="Nome")
    is_default = models.BooleanField(
        default=False,
        verbose_name="Padrão",
        help_text="Habilitada automaticamente em novos setores.",
    )

    class Meta:
        db_table = "sector_features"
        verbose_name = "Funcionalidade de setor"
        verbose_name_plural = "Funcionalidades de setor"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


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
    features = models.ManyToManyField(
        SectorFeature,
        blank=True,
        related_name="sectors",
        verbose_name="Funcionalidades",
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
