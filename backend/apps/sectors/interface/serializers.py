from rest_framework import serializers

from apps.sectors.infrastructure.models import Sector, SectorFeature
from apps.users.interface.serializers import UserSerializer


class SectorFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectorFeature
        fields = ["id", "slug", "name", "is_default"]


class SectorSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    member_count = serializers.SerializerMethodField()
    features = SectorFeatureSerializer(many=True, read_only=True)

    class Meta:
        model = Sector
        fields = ["id", "name", "description", "members", "member_count", "features", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_member_count(self, obj) -> int:
        return obj.members.count()


class SectorWriteSerializer(serializers.ModelSerializer):
    features = serializers.ListField(
        child=serializers.SlugField(),
        required=False,
        write_only=True,
        help_text="Lista de slugs das funcionalidades habilitadas (ex: ['tickets', 'patrimony']).",
    )

    class Meta:
        model = Sector
        fields = ["name", "description", "features"]


class SectorMemberSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()
