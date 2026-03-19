"""
Application use-cases for the Sectors bounded context.
"""
from apps.sectors.infrastructure.models import Sector
from apps.users.infrastructure.models import User


class CreateSectorUseCase:
    """RF10 – Cadastro de setores."""

    def execute(self, name: str, description: str = "") -> Sector:
        if Sector.objects.filter(name=name).exists():
            raise ValueError(f"Já existe um setor com o nome '{name}'.")
        return Sector.objects.create(name=name, description=description)


class AddUserToSectorUseCase:
    """RF11 – Adicionar usuário a um setor."""

    def execute(self, sector_id: str, user_id: str) -> Sector:
        sector = Sector.objects.get(pk=sector_id)
        user = User.objects.get(pk=user_id)
        sector.members.add(user)
        return sector


class RemoveUserFromSectorUseCase:
    """RF11 – Remover usuário de um setor."""

    def execute(self, sector_id: str, user_id: str) -> Sector:
        sector = Sector.objects.get(pk=sector_id)
        user = User.objects.get(pk=user_id)
        sector.members.remove(user)
        # RF12 – Garante que o usuário continue em pelo menos um setor
        if not user.sectors.exists():
            sector.members.add(user)
            raise ValueError("O usuário precisa permanecer em pelo menos um setor.")
        return sector
