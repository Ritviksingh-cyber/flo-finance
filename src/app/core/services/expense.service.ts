import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private api = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/transactions`);
  }

  addTransaction(tx: any): Observable<any> {
    return this.http.post(`${this.api}/transactions`, tx);
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.api}/transactions/${id}`);
  }

  getBudgets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/budgets`);
  }

  addBudget(budget: any): Observable<any> {
    return this.http.post(`${this.api}/budgets`, budget);
  }

  updateBudget(id: number, budget: any): Observable<any> {
    return this.http.put(`${this.api}/budgets/${id}`, budget);
  }

  deleteBudget(id: number): Observable<any> {
    return this.http.delete(`${this.api}/budgets/${id}`);
  }
}