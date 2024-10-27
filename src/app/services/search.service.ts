import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { Chambre } from '../models/chambre.model';
import { Salon } from '../models/salon.model';
import { SalleAManger } from '../models/salleAManger.model';
import { Pack } from '../models/pack.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private resultsSubject = new BehaviorSubject<(Product | Chambre | Salon | SalleAManger | Pack)[]>([]);
  results$ = this.resultsSubject.asObservable();

  setResults(results: (Product | Chambre | Salon | SalleAManger | Pack)[]) {
    this.resultsSubject.next(results);
  }
}
