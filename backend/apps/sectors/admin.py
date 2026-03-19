from django.contrib import admin

from apps.sectors.infrastructure.models import Sector


@admin.register(Sector)
class SectorAdmin(admin.ModelAdmin):
    list_display = ("name", "member_count", "created_at")
    search_fields = ("name",)
    filter_horizontal = ("members",)

    def member_count(self, obj):
        return obj.members.count()
    member_count.short_description = "Membros"
