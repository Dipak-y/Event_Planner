import re
from datetime import date, datetime

from django.contrib import messages
from django.http import JsonResponse
from django.shortcuts import redirect

from .models import ContactEnquiry, EventBooking

EVENT_TYPES = [value for value, _ in EventBooking.SELECT_CHOICES]
MESSAGE_MAX = 60
PHONE_RE = re.compile(r"^\d{10}$")
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def _is_ajax(request):
    return request.headers.get("X-Requested-With") == "XMLHttpRequest"


def _respond(request, ok, message, anchor=""):
    """AJAX -> JSON (page does not reload). Normal POST -> flash message + redirect."""
    if _is_ajax(request):
        return JsonResponse({"ok": ok, "message": message}, status=200 if ok else 400)
    (messages.success if ok else messages.error)(request, message)
    return redirect("/" + anchor)


def _check_common(name, contact_number, event_type, event_date):
    """Return (clean_date, error_message)."""
    if not name or len(name) > 100:
        return None, "Please enter your name."
    if not PHONE_RE.match(contact_number):
        return None, "Please enter a valid 10-digit contact number."
    if event_type not in EVENT_TYPES:
        return None, "Please choose an event type."
    try:
        clean_date = datetime.strptime(event_date, "%Y-%m-%d").date()
    except ValueError:
        return None, "Please choose a valid event date."
    if clean_date < date.today():
        return None, "Event date cannot be in the past."
    return clean_date, None


def contact_submit(request):
    if request.method != "POST":
        return redirect("/")

    name = request.POST.get("name", "").strip()
    email = request.POST.get("email", "").strip()
    contact_number = request.POST.get("contact_number", "").strip()
    event_type = request.POST.get("event_types", "").strip()
    event_date = request.POST.get("event_date", "").strip()
    message = request.POST.get("message", "").strip()

    clean_date, error = _check_common(name, contact_number, event_type, event_date)
    if not error and not EMAIL_RE.match(email):
        error = "Please enter a valid email address."
    if not error and not message:
        error = "Please write a short message."
    if not error and len(message) > MESSAGE_MAX:
        error = "Message must be %d characters or less." % MESSAGE_MAX
    if error:
        return _respond(request, False, error, "#contact")

    ContactEnquiry.objects.create(
        name=name,
        email=email,
        contact_number=contact_number,
        event_type=event_type,
        event_date=clean_date,
        message=message,
    )
    return _respond(request, True, "Thank you! Your enquiry has been sent successfully. We will reply within one working day.", "#contact")


def BookingForm(request):
    if request.method != "POST":
        return redirect("/")

    name = request.POST.get("name", "").strip()
    contact_number = request.POST.get("contact_number", "").strip()
    event_type = request.POST.get("event_types", "").strip()
    event_date = request.POST.get("event_date", "").strip()

    clean_date, error = _check_common(name, contact_number, event_type, event_date)
    if error:
        return _respond(request, False, error)

    EventBooking.objects.create(
        name=name,
        contact_number=contact_number,
        event_type=event_type,
        event_date=clean_date,
    )
    return _respond(request, True, "Booking request sent successfully! We will contact you soon.")