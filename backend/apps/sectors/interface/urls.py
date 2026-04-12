from django.urls import path

from apps.sectors.interface.views import (
    MySectorsView,
    SectorAddMemberView,
    SectorDetailView,
    SectorFeatureListView,
    SectorListCreateView,
    SectorRemoveMemberView,
)

urlpatterns = [
    path("", SectorListCreateView.as_view(), name="sector-list-create"),
    path("mine/", MySectorsView.as_view(), name="my-sectors"),
    path("features/", SectorFeatureListView.as_view(), name="sector-features"),
    path("<uuid:pk>/", SectorDetailView.as_view(), name="sector-detail"),
    path("<uuid:pk>/members/add/", SectorAddMemberView.as_view(), name="sector-add-member"),
    path("<uuid:pk>/members/remove/", SectorRemoveMemberView.as_view(), name="sector-remove-member"),
]
