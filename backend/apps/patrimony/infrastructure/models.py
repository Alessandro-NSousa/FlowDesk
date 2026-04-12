import uuid
from django.db import models


class Patrimony(models.Model):
    CONDITION_CHOICES = [
        ("Novo", "Novo"),
        ("Usado", "Usado"),
    ]
    SITUATION_CHOICES = [
        ("Disponível", "Disponível"),
        ("Depreciado", "Depreciado"),
        ("Em Uso", "Em Uso"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    number = models.CharField(max_length=50, unique=True, verbose_name="Número do patrimônio")
    name = models.CharField(max_length=200, verbose_name="Nome")
    user = models.ForeignKey(
        "users.User",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="patrimonies",
        verbose_name="Usuário responsável",
    )
    sector = models.ForeignKey(
        "sectors.Sector",
        on_delete=models.CASCADE,
        related_name="patrimonies",
        verbose_name="Setor",
    )
    adhesion_date = models.DateField(verbose_name="Data de adesão")
    condition = models.CharField(
        max_length=10,
        choices=CONDITION_CHOICES,
        verbose_name="Estado",
    )
    situation = models.CharField(
        max_length=15,
        choices=SITUATION_CHOICES,
        verbose_name="Situação",
    )
    write_off_date = models.DateField(
        null=True,
        blank=True,
        verbose_name="Data da baixa",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    class Meta:
        db_table = "patrimonies"
        verbose_name = "Patrimônio"
        verbose_name_plural = "Patrimônios"
        ordering = ["number"]

    def __str__(self) -> str:
        return f"{self.number} – {self.name}"
