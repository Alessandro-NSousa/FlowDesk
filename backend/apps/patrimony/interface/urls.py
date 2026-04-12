from django.urls import path

from apps.patrimony.interface.views import PatrimonyDetailView, PatrimonyListCreateView

urlpatterns = [
    path("", PatrimonyListCreateView.as_view(), name="patrimony-list-create"),
    path("<uuid:pk>/", PatrimonyDetailView.as_view(), name="patrimony-detail"),
]
