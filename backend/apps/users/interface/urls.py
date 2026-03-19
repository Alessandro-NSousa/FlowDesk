from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView

from apps.users.interface.views import (
    AcceptInviteView,
    ChangePasswordView,
    CurrentUserView,
    FlowDeskTokenObtainPairView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    UserDetailView,
    UserListCreateView,
)

urlpatterns = [
    # JWT
    path("token/", FlowDeskTokenObtainPairView.as_view(), name="token-obtain"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("token/logout/", TokenBlacklistView.as_view(), name="token-blacklist"),

    # Gerenciamento de membros (CRUD – somente admin)
    path("users/", UserListCreateView.as_view(), name="user-list-create"),
    path("users/<uuid:pk>/", UserDetailView.as_view(), name="user-detail"),

    # Recuperação de senha
    path("password-reset/", PasswordResetRequestView.as_view(), name="password-reset"),
    path("password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),

    # Compatibilidade com convites legados
    path("accept-invite/", AcceptInviteView.as_view(), name="accept-invite"),

    # Troca de senha (1º acesso obrigatório)
    path("password/change/", ChangePasswordView.as_view(), name="password-change"),

    # Perfil do usuário logado
    path("me/", CurrentUserView.as_view(), name="current-user"),
]
