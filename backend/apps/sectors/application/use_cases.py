"""
Application use-cases for the Sectors bounded context.
"""
from apps.sectors.infrastructure.models import Sector, SectorFeature
from apps.users.infrastructure.models import User


class CreateSectorUseCase:
    """RF10 – Cadastro de setores."""

    def execute(self, name: str, description: str = "", feature_slugs: list[str] | None = None) -> Sector:
        if Sector.objects.filter(name=name).exists():
            raise ValueError(f"Já existe um setor com o nome '{name}'.")
        sector = Sector.objects.create(name=name, description=description)

        if feature_slugs is not None:
            # Garante que "tickets" sempre esteja presente
            slugs = set(feature_slugs) | {"tickets"}
            features = SectorFeature.objects.filter(slug__in=slugs)
        else:
            features = SectorFeature.objects.filter(is_default=True)

        sector.features.set(features)
        return sector


class UpdateSectorFeaturesUseCase:
    """Atualiza as funcionalidades habilitadas em um setor."""

    def execute(self, sector_id: str, feature_slugs: list[str]) -> Sector:
        sector = Sector.objects.get(pk=sector_id)
        # "tickets" não pode ser removido
        slugs = set(feature_slugs) | {"tickets"}
        features = SectorFeature.objects.filter(slug__in=slugs)
        sector.features.set(features)
        return sector


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
