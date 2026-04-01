from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    TYPES = [('income', 'Income'), ('expense', 'Expense')]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=10, choices=TYPES)
    category = models.CharField(max_length=100)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=100)
    limit = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.DateField()  # store as first day of month

    class Meta:
        unique_together = ['user', 'category', 'month']