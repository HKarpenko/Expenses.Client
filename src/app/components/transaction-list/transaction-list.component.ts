import { Component, inject, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { Router } from '@angular/router';
import { concatMap, delay, from, Observable, of } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-transaction-list',
  imports: [DatePipe, NgClass, CurrencyPipe, LoadingComponent],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent implements OnInit {
  private readonly transactionService = inject(TransactionService);
  private readonly router = inject(Router);

  message: string = 'Loading data...';

  transactions: Transaction[] = [];

  ngOnInit(): void {
    this.loadTransaction();

    this.prepareLoadingMessages();
  }

  loadTransaction(): void {
    this.transactionService.getAll().subscribe(transactions => {
      this.transactions = transactions;
    });
  }

  prepareLoadingMessages(): void {
        const strings = ['Loading data...', 'Trying to use password you provided to hack your google account...', 'Trying to hack your computer...', 'Stilling money...', 'Just kidding, this is a demo app. Enjoy using it, Vlad Ravlik!', ''];

    // Emits one string every 1000ms (1 second)
    const stringStream$: Observable<string> = from(strings).pipe(
      concatMap((val, index) => 
        // Emit the first item immediately (or delay it too by removing the index check)
        index === 0 ? of(val) : of(val).pipe(delay(2500))
      )
    );

    // Example subscription
    stringStream$.subscribe({
      next: (str) => this.message = str
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
