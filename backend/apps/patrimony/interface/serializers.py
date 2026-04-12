from rest_framework import serializers

from apps.patrimony.infrastructure.models import Patrimony
from apps.sectors.interface.serializers import SectorSerializer
from apps.users.interface.serializers import UserSerializer


class PatrimonySerializer(serializers.ModelSerializer):
    sector = SectorSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Patrimony
        fields = [
            "id", "number", "name", "sector", "user",
            "adhesion_date", "condition", "situation",
            "write_off_date", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class PatrimonyWriteSerializer(serializers.ModelSerializer):
    sector_id = serializers.UUIDField()
    user_id = serializers.UUIDField(required=False, allow_null=True)

    class Meta:
        model = Patrimony
        fields = [
            "number", "name", "sector_id", "user_id",
            "adhesion_date", "condition", "situation", "write_off_date",
        ]
