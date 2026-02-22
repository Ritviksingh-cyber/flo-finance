import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../core/services/expense.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class Analytics implements OnInit {

  transactions: any[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.expenseService.getTransactions().subscribe((data: any[]) => {
      this.transactions = data;
      this.buildCharts();
    });
  }

  buildCharts() {
    this.buildPieChart();
    this.buildBarChart();
    this.buildLineChart();
  }

  buildPieChart() {
    const expenses = this.transactions.filter(t => t.type === 'expense');
    const grouped: any = {};
    expenses.forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });
    const labels = Object.keys(grouped);
    const data = Object.values(grouped);
    new Chart('pieChart', {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#8b2e2e','#2d5a3d','#2a4a7f','#7a4a1a','#4a2a7a','#c47a1a'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { family: 'DM Mono', size: 11 }, padding: 16, color: '#6b6760' }
          }
        },
        cutout: '65%'
      }
    });
  }

  buildBarChart() {
    const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const incomeData = [52000, 58000, 48000, 65000, 60000, 64500];
    const expenseData = [38000, 42000, 55000, 46000, 39000, 23439];
    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          { label: 'Income', data: incomeData, backgroundColor: '#2d5a3d', borderRadius: 6, borderSkipped: false },
          { label: 'Expense', data: expenseData, backgroundColor: '#8b2e2e', borderRadius: 6, borderSkipped: false }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top', labels: { font: { family: 'DM Mono', size: 11 }, color: '#6b6760' } } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'DM Mono', size: 11 }, color: '#6b6760' } },
          y: { grid: { color: '#e8e5e0' }, ticks: { font: { family: 'DM Mono', size: 11 }, color: '#6b6760', callback: (val: any) => '₹' + (val/1000) + 'k' } }
        }
      }
    });
  }

  buildLineChart() {
    const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const spendingData = [38000, 42000, 55000, 46000, 39000, 23439];
    new Chart('lineChart', {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Monthly Spending',
          data: spendingData,
          borderColor: '#2a4a7f',
          backgroundColor: 'rgba(42,74,127,0.08)',
          borderWidth: 2.5,
          pointBackgroundColor: '#2a4a7f',
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { font: { family: 'DM Mono', size: 11 }, color: '#6b6760' } } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'DM Mono', size: 11 }, color: '#6b6760' } },
          y: { grid: { color: '#e8e5e0' }, ticks: { font: { family: 'DM Mono', size: 11 }, color: '#6b6760', callback: (val: any) => '₹' + (val/1000) + 'k' } }
        }
      }
    });
  }
}