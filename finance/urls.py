from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('auth/me/', views.MeView.as_view()),        # ← was views.me (broken)
    path('auth/register/', views.RegisterView.as_view()),
    path('budgets/<int:pk>/', views.BudgetDetail.as_view()),
    path('auth/login/', TokenObtainPairView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('transactions/', views.TransactionListCreate.as_view()),
    path('transactions/<int:pk>/', views.TransactionDetail.as_view()),
    path('budgets/', views.BudgetListCreate.as_view()),
    path('analytics/', views.AnalyticsView.as_view()),
]