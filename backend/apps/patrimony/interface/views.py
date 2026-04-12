from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response

from apps.patrimony.application.use_cases import (
    CreatePatrimonyUseCase,
    DeletePatrimonyUseCase,
    ListPatrimoniesUseCase,
    UpdatePatrimonyUseCase,
)
from apps.patrimony.infrastructure.models import Patrimony
from apps.patrimony.interface.serializers import PatrimonySerializer, PatrimonyWriteSerializer
from apps.users.interface.permissions import IsAdminUser


class CanManagePatrimony(BasePermission):
    """Permite acesso a admins ou membros com can_manage_patrimony=True."""

    message = "Você não tem permissão para gerenciar patrimônios."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.is_admin or request.user.can_manage_patrimony)
        )


class PatrimonyListCreateView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PatrimonySerializer

    def get(self, request):
        sector_id = request.query_params.get("sector_id")
        user_id = request.query_params.get("user_id")
        situation = request.query_params.get("situation")
        condition = request.query_params.get("condition")
        qs = ListPatrimoniesUseCase().execute(
            user=request.user,
            sector_id=sector_id,
            user_id=user_id,
            situation=situation,
            condition=condition,
        )
        serializer = PatrimonySerializer(qs, many=True)
        return Response({"count": qs.count(), "results": serializer.data})

    def post(self, request):
        if not (request.user.is_admin or request.user.can_manage_patrimony):
            return Response({"detail": "Você não tem permissão para criar patrimônios."}, status=status.HTTP_403_FORBIDDEN)
        serializer = PatrimonyWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            patrimony = CreatePatrimonyUseCase().execute(**serializer.validated_data)
        except Exception as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(PatrimonySerializer(patrimony).data, status=status.HTTP_201_CREATED)


class PatrimonyDetailView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            patrimony = Patrimony.objects.select_related("sector", "user").get(pk=pk)
        except Patrimony.DoesNotExist:
            return None
        if not user.is_admin and not user.can_manage_patrimony:
            user_sector_ids = list(user.sectors.values_list("id", flat=True))
            if patrimony.sector_id not in user_sector_ids:
                return None
        return patrimony

    def get(self, request, pk):
        obj = self.get_object(pk, request.user)
        if not obj:
            return Response({"detail": "Não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        return Response(PatrimonySerializer(obj).data)

    def patch(self, request, pk):
        obj = self.get_object(pk, request.user)
        if not obj:
            return Response({"detail": "Não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        if not (request.user.is_admin or request.user.can_manage_patrimony):
            return Response({"detail": "Você não tem permissão para editar patrimônios."}, status=status.HTTP_403_FORBIDDEN)
        serializer = PatrimonyWriteSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        try:
            obj = UpdatePatrimonyUseCase().execute(patrimony_id=str(pk), **serializer.validated_data)
        except Exception as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(PatrimonySerializer(obj).data)

    def delete(self, request, pk):
        if not (request.user.is_admin or request.user.can_manage_patrimony):
            return Response({"detail": "Você não tem permissão para excluir patrimônios."}, status=status.HTTP_403_FORBIDDEN)
        obj = self.get_object(pk, request.user)
        if not obj:
            return Response({"detail": "Não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        DeletePatrimonyUseCase().execute(patrimony_id=str(pk))
        return Response(status=status.HTTP_204_NO_CONTENT)
