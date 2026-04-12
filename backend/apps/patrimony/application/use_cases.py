"""
Application use-cases for the Patrimony bounded context.
"""
from apps.patrimony.infrastructure.models import Patrimony


class ListPatrimoniesUseCase:
    def execute(self, user, sector_id=None, user_id=None, situation=None, condition=None):
        qs = Patrimony.objects.select_related("sector", "user").all()
        if not user.is_admin and not user.can_manage_patrimony:
            user_sector_ids = user.sectors.values_list("id", flat=True)
            qs = qs.filter(sector_id__in=user_sector_ids)
        if sector_id:
            qs = qs.filter(sector_id=sector_id)
        if user_id:
            qs = qs.filter(user_id=user_id)
        if situation:
            qs = qs.filter(situation=situation)
        if condition:
            qs = qs.filter(condition=condition)
        return qs


class CreatePatrimonyUseCase:
    def execute(self, **kwargs) -> Patrimony:
        return Patrimony.objects.create(**kwargs)


class UpdatePatrimonyUseCase:
    def execute(self, patrimony_id: str, **kwargs) -> Patrimony:
        patrimony = Patrimony.objects.get(pk=patrimony_id)
        for attr, value in kwargs.items():
            setattr(patrimony, attr, value)
        patrimony.save()
        return patrimony


class DeletePatrimonyUseCase:
    def execute(self, patrimony_id: str) -> None:
        Patrimony.objects.filter(pk=patrimony_id).delete()
