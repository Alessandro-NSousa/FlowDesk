from django.urls import path

from apps.tickets.interface.views import (
    TicketDetailView,
    TicketListCreateView,
    TicketStatusListCreateView,
)

urlpatterns = [
    path("", TicketListCreateView.as_view(), name="ticket-list-create"),
    path("<uuid:pk>/", TicketDetailView.as_view(), name="ticket-detail"),
    path("statuses/", TicketStatusListCreateView.as_view(), name="ticket-status-list-create"),
]
