import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction';
import { ActivatedRoute, Router } from '@angular/router';

const incomeCategories = ['Salary', 'Freelance', 'Investment'] as const;
const expenseCategories = ['Food', 'Transportation', 'Entertainment'] as const;

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css'
})
export class TransactionFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly transactionService = inject(TransactionService);
  private readonly router = inject(Router);
  private route = inject(ActivatedRoute);

  transactionForm!: FormGroup;

  availableCategories: string[] = [];

  isEditMode: boolean = false;
  transactionId?: number;

  ngOnInit(): void {
    this.transactionId = Number(this.route.snapshot.paramMap.get('id'));
    if(this.transactionId) {
      this.isEditMode = true;
      this.loadTransaction(this.transactionId);
    }
    else {
      this.buildForm();
      this.onTypeChange();
    }
  }

  loadTransaction(transactionId: number): void {
    this.transactionService.getById(transactionId).subscribe({
      next: (transaction) => {
        this.buildForm(transaction);
        this.updateAvailableCategories();
      },
      error: (error) => console.log(`Error - ${error}`)
    });
  }

  buildForm(transaction?: Transaction): void {
    if(transaction) {
      this.transactionForm = this.fb.group({
        type: [transaction.type, Validators.required],
        category: [transaction.category, Validators.required],
        amount: [transaction.amount, [Validators.required, Validators.min(0)]]
      });
    }
    else {
      this.transactionForm = this.fb.group({
        type: ["Expense", Validators.required],
        category: ['', Validators.required],
        amount: ['', [Validators.required, Validators.min(0)]],
        createdAt: [new Date(), Validators.required]
      });
    }
  }

  onTypeChange(): void {
    this.updateAvailableCategories();
    this.transactionForm.patchValue({category: this.availableCategories[0]});
  }

  private updateAvailableCategories(): void {
    const type = this.transactionForm.get('type')?.value;
    this.availableCategories = type === "Expense" ? [...expenseCategories] : [...incomeCategories];
  }

  onSumbit(): void {
    if (this.transactionForm.valid) {
      const transaction = {
        type: this.transactionForm.get('type')?.value,
        category: this.transactionForm.get('category')?.value,
        amount: this.transactionForm.get('amount')?.value,
        createdAt: this.transactionForm.get('createdAt')?.value
      } as Transaction;
      if (this.isEditMode) {
        transaction.id = this.transactionId!;
        this.transactionService.update(transaction).subscribe({
          next: () => this.router.navigate(['transactions']),
          error: (error) => console.log(`Error - ${error}`)
        });
      }
      else {
        this.transactionService.create(transaction).subscribe({
          next: () => this.router.navigate(['transactions']),
          error: (error) => console.log(`Error - ${error}`)
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/transactions']);
  }
}
