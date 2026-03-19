from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.sectors.application.use_cases import (
    AddUserToSectorUseCase,
    CreateSectorUseCase,
    RemoveUserFromSectorUseCase,
)
from apps.sectors.infrastructure.models import Sector
from apps.sectors.interface.serializers import (
    SectorMemberSerializer,
    SectorSerializer,
    SectorWriteSerializer,
)
from apps.users.interface.permissions import IsAdminUser


class SectorListCreateView(generics.ListCreateAPIView):
    """RF10 – Listar e criar setores."""
    queryset = Sector.objects.prefetch_related("members").all()
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
        try:
            sector = CreateSectorUseCase().execute(**serializer.validated_data)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(SectorSerializer(sector).data, status=status.HTTP_201_CREATED)


class SectorDetailView(generics.RetrieveUpdateDestroyAPIView):
    """RF10 – Detalhe, edição e remoção de setor."""
    queryset = Sector.objects.prefetch_related("members").all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return SectorWriteSerializer
        return SectorSerializer

    def get_permissions(self):
        if self.request.method in ("PUT", "PATCH", "DELETE"):
            return [IsAuthenticated(), IsAdminUser()]
        return [IsAuthenticated()]


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
        return self.request.user.sectors.prefetch_related("members").all()
