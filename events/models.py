from django.db import models


class EventBooking(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Confirmed", "Confirmed"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]


    SELECT_CHOICES = [
        ("Wedding", "Wedding"),
        ("Engagement", "Engagement"),
        ("Reception Party", "Reception Party"),
        ("Anniversary", "Anniversary"),
        ("Birthday Celebration", "Birthday Celebration"),
        ("Baby Shower", "Baby Shower"),
        ("Themed Parties", "Themed Parties"),
        ("Other", "Other"),
    ]

    name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=15)
    event_type = models.CharField(
        max_length=100,
        choices=SELECT_CHOICES,
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
    STATUS_CHOICES = [
            ("Pending", "Pending"),
            ("Confirmed", "Confirmed"),
            ("Completed", "Completed"),
            ("Cancelled", "Cancelled"),
        ]
    SELECT_CHOICES = [
            ("Wedding", "Wedding"),
            ("Engagement", "Engagement"),
            ("Reception Party", "Reception Party"),
            ("Anniversary", "Anniversary"),
            ("Birthday Celebration", "Birthday Celebration"),
            ("Baby Shower", "Baby Shower"),
            ("Themed Parties", "Themed Parties"),
            ("Other", "Other"),
        ]

    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    contact_number = models.CharField(max_length=20)
    event_type = models.CharField(
        max_length=100,
        choices=SELECT_CHOICES,
        null=True,
        blank=True
    )
    event_date = models.DateField()
    status = models.CharField(
            max_length=20,
            choices=STATUS_CHOICES,
            default="Pending"
        )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.event_type.title}"