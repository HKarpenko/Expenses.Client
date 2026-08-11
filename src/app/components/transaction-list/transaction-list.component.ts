import { Component, inject, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  imports: [DatePipe, NgClass, CurrencyPipe],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent implements OnInit {
  private readonly transactionService = inject(TransactionService);
  private readonly router = inject(Router);

  transactions: Transaction[] = [];

  ngOnInit(): void {
    this.loadTransaction();
  }

  loadTransaction(): void {
    this.transactionService.getAll().subscribe(transactions => {
      this.transactions = transactions;
    });
  }

  getTotalIncome(): number {
    return this.transactions.filter(t => t.type === "Income").reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalExpenses(): number {
    return this.transactions.filter(t => t.type === "Expense").reduce((sum, t) => sum + t.amount, 0);
  }

  getNetBalance(): number {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  editTransaction(transaction: Transaction): void {
    if (transaction.id) {
      this.router.navigate(['edit', transaction.id]);
    }
  }

  deleteTransaction(transaction: Transaction): void {
    if (transaction.id) {
      if (confirm("Are you sure you want to delete this transaction?")) {
        this.transactionService.delete(transaction.id).subscribe({
          next: () => this.loadTransaction(),
          error: (error) => console.log(`Error - ${error}`)
        });
      }
    }
  }
}
