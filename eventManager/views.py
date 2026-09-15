from django.http import HttpResponse
from django.shortcuts import render

from events.models import GalleryImage, Service

def homePage(request):
    gallery_images = GalleryImage.objects.all()
    services = Service.objects.all()

    return render(request, "index.html", {
        "gallery_images": gallery_images,
        "services": services,
        
    })