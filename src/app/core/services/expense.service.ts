import { Injectable } from '@angular/core';
import { supabase } from './supabase';

@Injectable({ providedIn: 'root' })
export class ExpenseService {

  async getUserId() {
    const { data } = await supabase.auth.getUser();
    return data.user?.id;
  }

  async getTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async addTransaction(tx: any) {
    const user_id = await this.getUserId();
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...tx, user_id }]);
    if (error) throw error;
    return data;
  }

  async deleteTransaction(id: number) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async getBudgets() {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  }

  async addBudget(budget: any) {
    const user_id = await this.getUserId();
    const { data, error } = await supabase
      .from('budgets')
      .insert([{
        name: budget.name,
        icon: budget.icon,
        budget_limit: budget.limit,
        color: budget.color,
        user_id
      }]);
    if (error) throw error;
    return data;
  }

  async updateBudget(id: number, budget: any) {
    const { error } = await supabase
      .from('budgets')
      .update({ budget_limit: budget.limit })
      .eq('id', id);
    if (error) throw error;
  }

  async deleteBudget(id: number) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}