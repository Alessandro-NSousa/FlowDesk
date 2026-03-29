from django.urls import path

from apps.tickets.interface.views import (
    TicketAssignView,
    TicketDetailView,
    TicketListCreateView,
    TicketStatusListCreateView,
)

urlpatterns = [
    path("", TicketListCreateView.as_view(), name="ticket-list-create"),
    path("<uuid:pk>/", TicketDetailView.as_view(), name="ticket-detail"),
    path("<uuid:pk>/assign/", TicketAssignView.as_view(), name="ticket-assign"),
    path("statuses/", TicketStatusListCreateView.as_view(), name="ticket-status-list-create"),
]
