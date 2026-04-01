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

  // ── MODAL ──────────────────────────────────
  modalOpen = false;
  entryType: 'income' | 'expense' = 'income';
  entryAmount: number | null = null;
  entryCategory = '';
  entryNote = '';

  // ── DATA ───────────────────────────────────
  transactions: any[] = [];
  budgets: any[] = [];
  currentMonth: string = '';

  // ── EDIT INCOME ────────────────────────────
  editingIncome = false;
  manualIncome: number | null = null;

  constructor(private expenseService: ExpenseService) {}

  async ngOnInit() {
    this.currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    await this.loadTransactions();
    await this.loadBudgets();
  }

  // ── LOAD DATA ──────────────────────────────
  async loadTransactions() {
    this.transactions = await this.expenseService.getTransactions();
  }

  async loadBudgets() {
    const data = await this.expenseService.getBudgets();
    this.budgets = data.map((b: any) => ({ ...b, limit: b.limit }));
  }

  // ── COMPUTED TOTALS ────────────────────────
  get totalIncome(): number {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  get totalExpense(): number {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  get balance(): number {
    return this.totalIncome - this.totalExpense;
  }

  get biggestSpend(): any {
    const expenses = this.transactions.filter(t => t.type === 'expense');
    if (expenses.length === 0) return null;
    return expenses.reduce((max, t) => Number(t.amount) > Number(max.amount) ? t : max, expenses[0]);
  }

  // ── BUDGETS WITH LIVE SPENT ────────────────
  get budgetsWithSpent(): any[] {
    return this.budgets.map(b => {
      const spent = this.transactions
        .filter(t => t.type === 'expense' && t.category === b.category)
        .reduce((sum, t) => sum + Number(t.amount), 0);
      return { ...b, spent };
    });
  }

  // ── EDIT INCOME ────────────────────────────
  startEditIncome() {
    this.editingIncome = true;
    this.manualIncome = this.totalIncome;
  }

  async saveIncome() {
    if (!this.manualIncome) return;
    const difference = this.manualIncome - this.totalIncome;
    if (difference === 0) { this.editingIncome = false; return; }
    await this.expenseService.addTransaction({
      name: 'Manual Income Adjustment',
      amount: Math.abs(difference),
      type: difference > 0 ? 'income' : 'expense',
      category: 'Salary',
      date: new Date().toISOString().split('T')[0],
      note: 'Manual adjustment'
    });
    await this.loadTransactions();
    this.editingIncome = false;
    this.manualIncome = null;
  }

  cancelEditIncome() {
    this.editingIncome = false;
    this.manualIncome = null;
  }

  // ── MODAL CONTROLS ─────────────────────────
  openModal() { this.modalOpen = true; }
  closeModal() { this.modalOpen = false; }

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  // ── SAVE ENTRY ─────────────────────────────
  async saveEntry() {
    if (!this.entryAmount || !this.entryCategory) return;
    await this.expenseService.addTransaction({
      name: this.entryNote || this.entryCategory,
      amount: this.entryAmount,
      type: this.entryType,
      category: this.entryCategory,
      date: new Date().toISOString().split('T')[0],
      note: this.entryNote
    });
    await this.loadTransactions();
    this.entryAmount = null;
    this.entryCategory = '';
    this.entryNote = '';
    this.closeModal();
  }
}