import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  // Pour accéder à l'ID dans l'URL
import { Observable } from 'rxjs';
import { Pack } from '../models/pack.model';  // Le modèle Pack
import { PackService } from '../services/pack.service';  // Le service pour récupérer les packs

@Component({
  selector: 'app-pack-details',
  templateUrl: './pack-details.component.html',
  styleUrls: ['./pack-details.component.css']
})
export class PackDetailsComponent implements OnInit {
  pack$!: Observable<Pack | undefined>;  // Observable pour les détails du pack

  constructor(
    private route: ActivatedRoute,  // Pour obtenir l'ID du pack dans l'URL
    private packService: PackService  // Service pour récupérer le pack
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');  // Récupérer l'ID dans l'URL
    if (id) {
      this.pack$ = this.packService.getPackById(id);  // Obtenir les détails du pack
    }
  }
}
