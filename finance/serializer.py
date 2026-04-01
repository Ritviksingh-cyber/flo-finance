from rest_framework import serializers
from django.contrib.auth.models import User
from django.db.models import Sum
from .models import Transaction, Budget

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    def create(self, data):
        return User.objects.create_user(**data)

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

class BudgetSerializer(serializers.ModelSerializer):
    spent = serializers.SerializerMethodField()
    class Meta:
        model = Budget
        fields = '__all__'
        read_only_fields = ['user']
    def get_spent(self, obj):
        total = Transaction.objects.filter(
            user=obj.user, category=obj.category,
            type='expense', date__month=obj.month.month,
            date__year=obj.month.year
        ).aggregate(s=Sum('amount'))['s']
        return total or 0