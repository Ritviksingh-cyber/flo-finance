import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../core/services/expense.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  modalOpen = false;
  entryType: 'income' | 'expense' = 'income';
  entryAmount: number | null = null;
  entryCategory = '';
  entryNote = '';

  transactions: any[] = [];
  budgets: any[] = [];
  currentMonth: string = '';

  editingIncome = false;
  manualIncome: number | null = null;

  constructor(private expenseService: ExpenseService) {}

  async ngOnInit() {
    this.currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    await this.loadTransactions();
    await this.loadBudgets();
  }

  async loadTransactions() {
    const data = await this.expenseService.getTransactions();
    this.transactions = data ?? [];
  }

  async loadBudgets() {
    const data = await this.expenseService.getBudgets();
    this.budgets = (data ?? []).map((b: any) => ({ ...b, limit: b.budget_limit }));
  }

  get totalIncome(): number {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get totalExpense(): number {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get balance(): number {
    return this.totalIncome - this.totalExpense;
  }

  get biggestSpend(): any {
    const expenses = this.transactions.filter(t => t.type === 'expense');
    if (expenses.length === 0) return null;
    return expenses.reduce((max, t) => t.amount > max.amount ? t : max, expenses[0]);
  }

  get budgetsWithSpent(): any[] {
    return this.budgets.map(b => {
      const spent = this.transactions
        .filter(t => t.type === 'expense' && t.category === b.name)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...b, spent };
    });
  }

  startEditIncome() {
    this.editingIncome = true;
    this.manualIncome = this.totalIncome;
  }

  async saveIncome() {
    if (!this.manualIncome) return;
    const difference = this.manualIncome - this.totalIncome;
    if (difference === 0) { this.editingIncome = false; return; }
    const newEntry = {
      name: 'Manual Income Adjustment',
      amount: Math.abs(difference),
      type: difference > 0 ? 'income' : 'expense',
      category: 'Salary',
      date: new Date().toISOString().split('T')[0],
      icon: '💰',
      note: 'Manual adjustment'
    };
    await this.expenseService.addTransaction(newEntry);
    await this.loadTransactions();
    this.editingIncome = false;
    this.manualIncome = null;
  }

  cancelEditIncome() {
    this.editingIncome = false;
    this.manualIncome = null;
  }

  openModal() { this.modalOpen = true; }
  closeModal() { this.modalOpen = false; }

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  async saveEntry() {
    if (!this.entryAmount || !this.entryCategory) return;
    const newEntry = {
      name: this.entryNote ? this.entryNote : this.entryCategory,
      amount: this.entryAmount,
      type: this.entryType,
      category: this.entryCategory,
      date: new Date().toISOString().split('T')[0],
      icon: this.entryType === 'income' ? '💰' : '💸',
      note: this.entryNote
    };
    await this.expenseService.addTransaction(newEntry);
    await this.loadTransactions();
    this.entryAmount = null;
    this.entryCategory = '';
    this.entryNote = '';
    this.closeModal();
  }
}