from django.db import models


class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to="services/")
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def first_word(self):
        return self.title.split()[0]

    def __str__(self):
        return self.title


class EventBooking(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Confirmed", "Confirmed"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]

    name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=15)
    event_type = models.ForeignKey(
        Service,
        on_delete=models.PROTECT,
        related_name="bookings",
        null=True,
        blank=True
    )

    event_date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.event_type.title}"


class ContactEnquiry(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    contact_number = models.CharField(max_length=20)
    event_type = models.ForeignKey(
        Service,
        on_delete=models.PROTECT,
        related_name="enquiries",
        null=True,
        blank=True
    )
    event_date = models.DateField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.event_type.title}"


class GalleryImage(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to="gallery/")
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name="gallery_images",
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title