import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Chambre } from '../models/chambre.model';
import { Pack } from '../models/pack.model';
import { Product } from '../models/product.model';
import { SalleAManger } from '../models/salleAManger.model';
import { Salon } from '../models/salon.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  results: (Product | Chambre | Salon | SalleAManger | Pack)[] = [];

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    // Abonnez-vous aux résultats du service
    this.searchService.results$.subscribe((results) => {
      this.results = results;
      if (this.results.length === 0) {
        console.error('No results found for the search term.');
      }
    });
  }
}
