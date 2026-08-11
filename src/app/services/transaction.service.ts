import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://expenseapi-a9e4awd7cwdebwc5.polandcentral-01.azurewebsites.net/';

  getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl+"api/transactions/all");
  }

  getById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(this.apiUrl+`api/transactions/details/${id}`);
  }

  create(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl+`api/transactions/create`, transaction);
  }

  update(transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(this.apiUrl+`api/transactions/update`, transaction);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl+`api/transactions/delete/${id}`);
  }
}
