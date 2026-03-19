# Re-export models so Django's app registry can discover them.
from apps.users.infrastructure.models import User, UserManager  # noqa: F401
