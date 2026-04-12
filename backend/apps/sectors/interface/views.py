from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.sectors.application.use_cases import (
    AddUserToSectorUseCase,
    CreateSectorUseCase,
    RemoveUserFromSectorUseCase,
    UpdateSectorFeaturesUseCase,
)
from apps.sectors.infrastructure.models import Sector, SectorFeature
from apps.sectors.interface.serializers import (
    SectorFeatureSerializer,
    SectorMemberSerializer,
    SectorSerializer,
    SectorWriteSerializer,
)
from apps.users.interface.permissions import IsAdminUser


class SectorFeatureListView(generics.ListAPIView):
    """Lista todas as funcionalidades disponíveis para setores."""
    queryset = SectorFeature.objects.all()
    serializer_class = SectorFeatureSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    pagination_class = None


class SectorListCreateView(generics.ListCreateAPIView):
    """RF10 – Listar e criar setores."""
    queryset = Sector.objects.prefetch_related("members", "features").all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return SectorWriteSerializer
        return SectorSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsAdminUser()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = SectorWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        feature_slugs = data.pop("features", None)
        try:
            sector = CreateSectorUseCase().execute(**data, feature_slugs=feature_slugs)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(SectorSerializer(sector).data, status=status.HTTP_201_CREATED)


class SectorDetailView(generics.RetrieveUpdateDestroyAPIView):
    """RF10 – Detalhe, edição e remoção de setor."""
    queryset = Sector.objects.prefetch_related("members", "features").all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return SectorWriteSerializer
        return SectorSerializer

    def get_permissions(self):
        if self.request.method in ("PUT", "PATCH", "DELETE"):
            return [IsAuthenticated(), IsAdminUser()]
        return [IsAuthenticated()]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = SectorWriteSerializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        feature_slugs = data.pop("features", None)
        # Atualiza campos básicos
        for attr, value in data.items():
            setattr(instance, attr, value)
        instance.save()
        # Atualiza features se fornecidas
        if feature_slugs is not None:
            UpdateSectorFeaturesUseCase().execute(
                sector_id=str(instance.pk),
                feature_slugs=feature_slugs,
            )
            instance.refresh_from_db()
        return Response(SectorSerializer(instance).data)


class SectorAddMemberView(APIView):
    """RF11 – Adicionar usuário a setor."""
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        serializer = SectorMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            sector = AddUserToSectorUseCase().execute(
                sector_id=pk,
                user_id=str(serializer.validated_data["user_id"]),
            )
        except Exception as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(SectorSerializer(sector).data)


class SectorRemoveMemberView(APIView):
    """RF11 – Remover usuário de setor."""
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        serializer = SectorMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            sector = RemoveUserFromSectorUseCase().execute(
                sector_id=pk,
                user_id=str(serializer.validated_data["user_id"]),
            )
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(SectorSerializer(sector).data)


class MySectorsView(generics.ListAPIView):
    """Retorna os setores do usuário autenticado."""
    permission_classes = [IsAuthenticated]
    serializer_class = SectorSerializer

    def get_queryset(self):
        return self.request.user.sectors.prefetch_related("members", "features").all()
