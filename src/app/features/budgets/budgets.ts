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

  ngOnInit() {
    this.loadBudgets();
    this.loadTransactions();
  }

  loadBudgets() {
    this.expenseService.getBudgets().subscribe((data: any[]) => {
      this.budgets = data;
    });
  }

  loadTransactions() {
    this.expenseService.getTransactions().subscribe((data: any[]) => {
      this.transactions = data;
    });
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

  saveEdit(budget: any) {
    const updated = { ...budget, limit: this.editLimit };
    this.expenseService.updateBudget(budget.id, updated).subscribe(() => {
      this.editingId = null;
      this.loadBudgets();
    });
  }

  cancelEdit() { this.editingId = null; }

  deleteBudget(id: number) {
    this.expenseService.deleteBudget(id).subscribe(() => {
      this.loadBudgets();
    });
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

  saveBudget() {
    if (!this.newBudget.name || !this.newBudget.limit) return;
    this.expenseService.addBudget(this.newBudget).subscribe(() => {
      this.loadBudgets();
      this.closeModal();
    });
  }
}