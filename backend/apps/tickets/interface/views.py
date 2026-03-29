from django.db.models import Q
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.tickets.application.use_cases import (
    AssignTicketUseCase,
    CreateCustomStatusUseCase,
    CreateDefaultStatusesUseCase,
    CreateTicketUseCase,
    UpdateTicketUseCase,
)
from apps.tickets.infrastructure.filters import TicketFilter
from apps.tickets.infrastructure.models import Ticket, TicketStatus
from apps.tickets.interface.serializers import (
    TicketCreateSerializer,
    TicketSerializer,
    TicketStatusSerializer,
    TicketStatusWriteSerializer,
    TicketUpdateSerializer,
)
from apps.users.interface.permissions import IsAdminUser


class TicketStatusListCreateView(generics.ListCreateAPIView):
    """RF18, RF19 – Listar e criar status de chamados."""
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return TicketStatusWriteSerializer
        return TicketStatusSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsAdminUser()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return TicketStatus.objects.select_related("sector").all()
        # RF20 – Retorna status globais + status dos setores do usuário
        user_sector_ids = user.sectors.values_list("id", flat=True)
        return TicketStatus.objects.select_related("sector").filter(
            Q(sector__isnull=True) | Q(sector__id__in=user_sector_ids)
        )

    def create(self, request, *args, **kwargs):
        serializer = TicketStatusWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            ts = CreateCustomStatusUseCase().execute(**serializer.validated_data)
        except (ValueError, Exception) as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(TicketStatusSerializer(ts).data, status=status.HTTP_201_CREATED)


class TicketListCreateView(generics.ListCreateAPIView):
    """RF13, RF17, RF23, RF24 – Listar e criar chamados."""
    permission_classes = [IsAuthenticated]
    filterset_class = TicketFilter
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return TicketCreateSerializer
        return TicketSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Ticket.objects.select_related(
            "requesting_sector", "responsible_sector", "status", "created_by", "updated_by"
        )
        if user.is_admin:
            return qs.all()
        # RF09 – Chamados criados pelo usuário OU do setor do usuário
        user_sector_ids = user.sectors.values_list("id", flat=True)
        return qs.filter(
            Q(created_by=user) | Q(responsible_sector__id__in=user_sector_ids)
        ).distinct()

    def create(self, request, *args, **kwargs):
        serializer = TicketCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            ticket = CreateTicketUseCase().execute(
                **serializer.validated_data,
                created_by=request.user,
            )
        except (PermissionError, Exception) as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(TicketSerializer(ticket).data, status=status.HTTP_201_CREATED)


class TicketDetailView(generics.RetrieveUpdateAPIView):
    """RF15, RF17 – Detalhe e atualização de chamado."""
    permission_classes = [IsAuthenticated]
    serializer_class = TicketSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Ticket.objects.select_related(
            "requesting_sector", "responsible_sector", "status", "created_by", "updated_by"
        )
        if user.is_admin:
            return qs.all()
        from django.db.models import Q
        user_sector_ids = user.sectors.values_list("id", flat=True)
        return qs.filter(
            Q(created_by=user) | Q(responsible_sector__id__in=user_sector_ids)
        ).distinct()

    def update(self, request, *args, **kwargs):
        serializer = TicketUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            ticket = UpdateTicketUseCase().execute(
                ticket_id=str(kwargs["pk"]),
                requesting_user=request.user,
                **serializer.validated_data,
            )
        except PermissionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_403_FORBIDDEN)
        except Exception as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(TicketSerializer(ticket).data)


class TicketAssignView(APIView):
    """POST /tickets/{id}/assign/ – Assume ou reatribui um chamado."""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        target_user_id = request.data.get("user_id")  # opcional; sem ele assume p/ si
        try:
            ticket = AssignTicketUseCase().execute(
                ticket_id=str(pk),
                requesting_user=request.user,
                target_user_id=target_user_id,
            )
        except PermissionError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_403_FORBIDDEN)
        except Exception as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(TicketSerializer(ticket).data)
