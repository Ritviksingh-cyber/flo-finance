import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../core/services/expense.service';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budgets.html',
  styleUrl: './budgets.css'
})
export class Budgets implements OnInit {

  budgets: any[] = [];
  transactions: any[] = [];
  editingId: number | null = null;
  editLimit: number = 0;

  modalOpen = false;
  newBudget = { icon: '💰', name: '', spent: 0, limit: 0, color: '#2d5a3d' };
  icons = ['💰','🏠','🍔','✈️','🛍️','⚡','🎮','🎓','💊','🚗','📱','🎬'];
  colors = ['#2d5a3d','#8b2e2e','#2a4a7f','#7a4a1a','#4a2a7a','#c47a1a'];

  constructor(private expenseService: ExpenseService) {}

  async ngOnInit() {
    await this.loadBudgets();
    await this.loadTransactions();
  }

  async loadBudgets() {
    const data = await this.expenseService.getBudgets();
    this.budgets = (data ?? []).map((b: any) => ({ ...b, limit: b.budget_limit }));
  }

  async loadTransactions() {
    const data = await this.expenseService.getTransactions();
    this.transactions = data ?? [];
  }

  get budgetsWithSpent(): any[] {
    return this.budgets.map(b => {
      const spent = this.transactions
        .filter(t => t.type === 'expense' && t.category === b.name)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...b, spent };
    });
  }

  getPercent(spent: number, limit: number): number {
    return Math.min((spent / limit) * 100, 100);
  }

  getStatus(spent: number, limit: number): string {
    const pct = (spent / limit) * 100;
    if (pct >= 100) return 'over';
    if (pct >= 80) return 'warning';
    return 'good';
  }

  startEdit(budget: any) {
    this.editingId = budget.id;
    this.editLimit = budget.limit;
  }

  async saveEdit(budget: any) {
    await this.expenseService.updateBudget(budget.id, { limit: this.editLimit });
    this.editingId = null;
    await this.loadBudgets();
  }

  cancelEdit() { this.editingId = null; }

  async deleteBudget(id: number) {
    await this.expenseService.deleteBudget(id);
    await this.loadBudgets();
  }

  openModal() { this.modalOpen = true; }

  closeModal() {
    this.modalOpen = false;
    this.newBudget = { icon: '💰', name: '', spent: 0, limit: 0, color: '#2d5a3d' };
  }

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  async saveBudget() {
    if (!this.newBudget.name || !this.newBudget.limit) return;
    await this.expenseService.addBudget(this.newBudget);
    await this.loadBudgets();
    this.closeModal();
  }
}