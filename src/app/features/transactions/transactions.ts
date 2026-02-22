import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../core/services/expense.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class Transactions implements OnInit {

  transactions: any[] = [];
  filtered: any[] = [];
  searchText = '';
  selectedCategory = '';
  selectedType = '';
  categories = ['All', 'Salary', 'Freelance', 'Rent', 'Food', 'Travel', 'Shopping', 'Utilities', 'Entertainment', 'Other'];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.expenseService.getTransactions().subscribe((data: any[]) => {
      this.transactions = data.reverse();
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filtered = this.transactions.filter(tx => {
      const matchSearch = tx.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchCategory = !this.selectedCategory || this.selectedCategory === 'All' || tx.category === this.selectedCategory;
      const matchType = !this.selectedType || tx.type === this.selectedType;
      return matchSearch && matchCategory && matchType;
    });
  }

  deleteTransaction(id: number) {
    this.expenseService.deleteTransaction(id).subscribe(() => {
      this.loadTransactions();
    });
  }

  exportCSV() {
    const headers = 'Date,Name,Category,Type,Amount';
    const rows = this.transactions.map(t =>
      `${t.date},${t.name},${t.category},${t.type},${t.amount}`
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
  }

  get totalIncome(): number {
    return this.filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  }

  get totalExpense(): number {
    return this.filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  }
}