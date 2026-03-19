from rest_framework import serializers

from apps.sectors.infrastructure.models import Sector
from apps.users.infrastructure.models import User
from apps.users.interface.serializers import UserSerializer


class SectorSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Sector
        fields = ["id", "name", "description", "members", "member_count", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_member_count(self, obj) -> int:
        return obj.members.count()


class SectorWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sector
        fields = ["name", "description"]


class SectorMemberSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()
