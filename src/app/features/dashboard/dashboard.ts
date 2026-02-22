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

  ngOnInit() {
    this.loadTransactions();
    this.loadBudgets();
    this.currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  loadTransactions() {
    this.expenseService.getTransactions().subscribe((data: any[]) => {
      this.transactions = data.reverse();
    });
  }

  loadBudgets() {
    this.expenseService.getBudgets().subscribe((data: any[]) => {
      this.budgets = data;
    });
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

  saveIncome() {
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
    this.expenseService.addTransaction(newEntry).subscribe(() => {
      this.loadTransactions();
      this.editingIncome = false;
      this.manualIncome = null;
    });
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

  saveEntry() {
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
    this.expenseService.addTransaction(newEntry).subscribe(() => {
      this.loadTransactions();
      this.entryAmount = null;
      this.entryCategory = '';
      this.entryNote = '';
      this.closeModal();
    });
  }
}