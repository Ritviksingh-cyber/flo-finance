import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../core/services/expense.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  transactions: any[] = [];
  budgets: any[] = [];

  user = {
    name: 'Ritvik Singh',
    email: 'ritvik@example.com',
    phone: '+91 98765 43210',
    currency: '₹',
    savingsGoal: 30000,
    monthlyBudget: 25000
  };

  editingUser = false;
  editUser = { ...this.user };

  constructor(private expenseService: ExpenseService) {}

  async ngOnInit() {
    const txData = await this.expenseService.getTransactions();
    this.transactions = txData ?? [];
    const budgetData = await this.expenseService.getBudgets();
    this.budgets = budgetData ?? [];
  }

  get totalIncome(): number {
    return this.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  }

  get totalExpense(): number {
    return this.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  }

  get balance(): number {
    return this.totalIncome - this.totalExpense;
  }

  get totalTransactions(): number {
    return this.transactions.length;
  }

  get topCategory(): string {
    const expenses = this.transactions.filter(t => t.type === 'expense');
    const grouped: any = {};
    expenses.forEach(t => { grouped[t.category] = (grouped[t.category] || 0) + t.amount; });
    const sorted = Object.entries(grouped).sort((a: any, b: any) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : 'None';
  }

  get savingsPercent(): number {
    return Math.min((this.balance / this.user.savingsGoal) * 100, 100);
  }

  startEdit() {
    this.editUser = { ...this.user };
    this.editingUser = true;
  }

  saveEdit() {
    this.user = { ...this.editUser };
    this.editingUser = false;
  }

  cancelEdit() { this.editingUser = false; }
}