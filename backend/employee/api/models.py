from django.db import models


class Employee(models.Model):
    POSITION_CHOICES = (
        ('trainee', 'Trainee'),
        ('junior', 'Junior'),
        ('middle', 'Middle'),
        ('senior', 'Senior'),
        ('architect', 'Software Architect'),
        ('tech_lead', 'Tech Lead'),
    )

    last_name = models.CharField(max_length=255)
    position = models.CharField(max_length=255, choices=POSITION_CHOICES)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    date_of_birth = models.DateField()

    def __str__(self):
        return self.last_name
