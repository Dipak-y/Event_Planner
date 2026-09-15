from django.shortcuts import render, redirect
from django.contrib import messages
from .models import ContactEnquiry, EventBooking, Service


def contact_submit(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        contact_number = request.POST.get("contact_number")
        event_type = request.POST.get("event_type")
        event_date = request.POST.get("event_date")
        message = request.POST.get("message")

        service = Service.objects.get(id=event_type)

        ContactEnquiry.objects.create(
            name=name,
            email=email,
            contact_number=contact_number,
            event_type=service,
            event_date=event_date,
            message=message,
        )

        messages.success(request,"Your enquiry has been submitted successfully.")

    return redirect("/")


def BookingForm(request):
    if request.method == "POST":
        name = request.POST.get("name")
        contact_number = request.POST.get("contact_number")
        event_type = request.POST.get("event_type")
        event_date = request.POST.get("event_date")

        service = Service.objects.get(id=event_type)

        EventBooking.objects.create(
            name=name,
            contact_number=contact_number,
            event_type=service,
            event_date=event_date,
        )

        messages.success(request,"Your booking has been submitted successfully.")

    return redirect("/")