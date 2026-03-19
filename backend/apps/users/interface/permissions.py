from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """Permite acesso somente a usuários com is_admin=True (RF08)."""

    message = "Apenas administradores podem realizar esta ação."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin)
