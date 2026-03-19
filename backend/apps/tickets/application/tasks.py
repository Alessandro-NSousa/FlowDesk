"""
Celery tasks for async e-mail notifications (RF21, RF22).
"""
from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def notify_sector_new_ticket(self, ticket_id: str) -> None:
    """Notifica por e-mail todos os membros do setor responsável (RF21)."""
    from apps.tickets.infrastructure.models import Ticket

    try:
        ticket = Ticket.objects.select_related(
            "responsible_sector", "requesting_sector", "created_by", "status"
        ).get(pk=ticket_id)
    except Ticket.DoesNotExist:
        return

    recipients = list(
        ticket.responsible_sector.members
        .filter(is_active=True)
        .values_list("email", flat=True)
    )
    if not recipients:
        return

    ticket_url = f"{settings.FRONTEND_URL}/tickets/{ticket.id}"
    subject = f"[FlowDesk] Novo chamado: {ticket.title}"
    message = (
        f"Um novo chamado foi criado para o setor {ticket.responsible_sector.name}.\n\n"
        f"Título: {ticket.title}\n"
        f"Descrição: {ticket.description}\n"
        f"Solicitante: {ticket.requesting_sector.name}\n"
        f"Status: {ticket.status.name}\n"
        f"Criado por: {ticket.created_by.full_name} ({ticket.created_by.email})\n\n"
        f"Acesse: {ticket_url}"
    )
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipients,
            fail_silently=False,
        )
    except Exception as exc:
        raise self.retry(exc=exc)
