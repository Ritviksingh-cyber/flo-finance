import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const API = 'http://localhost:8000/api';

@Injectable({ providedIn: 'root' })
export class ExpenseService {

  constructor(private http: HttpClient) {}

  async getTransactions(): Promise<any[]> {
    try {
      const data = await firstValueFrom(this.http.get<any[]>(`${API}/transactions/`));
      return data ?? [];
    } catch {
      return [];
    }
  }

  async addTransaction(tx: any) {
    return await firstValueFrom(
      this.http.post(`${API}/transactions/`, {
        title: tx.name,
        amount: tx.amount,
        type: tx.type,
        category: tx.category,
        date: tx.date
      })
    );
  }

  async deleteTransaction(id: number) {
    return await firstValueFrom(
      this.http.delete(`${API}/transactions/${id}/`)
    );
  }

  async getBudgets(): Promise<any[]> {
    try {
      const data = await firstValueFrom(this.http.get<any[]>(`${API}/budgets/`));
      return data ?? [];
    } catch {
      return [];
    }
  }

  async addBudget(budget: any) {
    return await firstValueFrom(
      this.http.post(`${API}/budgets/`, {
        category: budget.name,
        limit: budget.limit,
        month: new Date().toISOString().split('T')[0]
      })
    );
  }

  async updateBudget(id: number, budget: any) {
    return await firstValueFrom(
      this.http.patch(`${API}/budgets/${id}/`, { limit: budget.limit })
    );
  }

  async deleteBudget(id: number) {
    return await firstValueFrom(
      this.http.delete(`${API}/budgets/${id}/`)
    );
  }

  async getAnalytics() {
    return await firstValueFrom(this.http.get(`${API}/analytics/`));
  }
}