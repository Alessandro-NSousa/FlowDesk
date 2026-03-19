from django.contrib import admin

from apps.tickets.infrastructure.models import Ticket, TicketStatus


@admin.register(TicketStatus)
class TicketStatusAdmin(admin.ModelAdmin):
    list_display = ("name", "sector", "is_default", "order")
    list_filter = ("is_default", "sector")
    ordering = ("order", "name")


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("title", "requesting_sector", "responsible_sector", "status", "created_by", "created_at")
    list_filter = ("status", "requesting_sector", "responsible_sector")
    search_fields = ("title", "description")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at", "created_by", "updated_by")
