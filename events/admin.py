from django.contrib import admin
from .models import EventBooking, ContactEnquiry, GalleryImage, Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at")
    list_filter = ("created_at",)
    search_fields = ("title", "description")
    ordering = ("-created_at",)


@admin.register(EventBooking)
class EventBookingAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "contact_number",
        "event_type",
        "event_date",
        "status",
        "created_at",
    )
    list_editable = ("status",)
    list_filter = ("event_type", "status", "created_at")
    search_fields = (
        "name",
        "contact_number",
        "event_type__title",
    )
    ordering = ("-created_at",)


@admin.register(ContactEnquiry)
class ContactEnquiryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "email",
        "contact_number",
        "event_type",
        "event_date",
        "status",
        "created_at",
    )
    list_editable = ("status",)
    list_filter = ("event_type", "status", "created_at")
    search_fields = (
        "name",
        "email",
        "contact_number",
        "event_type__title",
    )
    ordering = ("-created_at",)


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "service",
        "created_at",
    )
    list_filter = ("service", "created_at")
    search_fields = (
        "title",
        "service__title",
    )
    ordering = ("-created_at",)