from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Sum
from .models import Transaction, Budget
from .serializer import RegisterSerializer, TransactionSerializer, BudgetSerializer
from rest_framework import permissions


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            'id': request.user.id,
            'email': request.user.email,
            'username': request.user.username,
        })
    
class TransactionListCreate(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)
    def perform_create(self, s): s.save(user=self.request.user)

class TransactionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)
    
class BudgetDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BudgetSerializer
    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

class BudgetListCreate(generics.ListCreateAPIView):
    serializer_class = BudgetSerializer
    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)
    def perform_create(self, s): s.save(user=self.request.user)

class AnalyticsView(APIView):
    def get(self, request):
        txns = Transaction.objects.filter(user=request.user)
        by_category = txns.filter(type='expense').values('category').annotate(total=Sum('amount'))
        return Response({
            'total_income': txns.filter(type='income').aggregate(Sum('amount'))['amount__sum'] or 0,
            'total_expense': txns.filter(type='expense').aggregate(Sum('amount'))['amount__sum'] or 0,
            'by_category': list(by_category),
        })