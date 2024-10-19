import { Component, OnInit } from '@angular/core';
import { CommandeService } from '../services/commande.service'; // Assurez-vous que le chemin est correct
import { Commande } from '../models/commande.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var bootstrap: any;

@Component({
  selector: 'app-commandes-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './commandes-management.component.html',
  styleUrls: ['./commandes-management.component.css']
})
export class CommandesManagementComponent implements OnInit {
  commandes: Commande[] = [];
  selectedCommande: Commande | null = null;

  constructor(private commandeService: CommandeService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes() {
    this.commandeService.getAllCommandes().subscribe((data: Commande[]) => {
      this.commandes = data;
    });
  }
  getCommandeRowClass(etat: string): string {
    switch (etat) {
      case 'acceptée':
        return 'table-success';
      case 'refusée':
        return 'table-danger';
      case 'en attente':
      default:
        return 'table-warning';
    }
  }
  openDetailsModal(commande: Commande) {
    this.selectedCommande = commande;
    const modalElement = document.getElementById('commandeDetailsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  // Méthode pour accepter une commande
  accepterCommande(commandeId: string) {
    this.commandeService.updateCommandeStatus(commandeId, 'acceptée').then(() => {
      console.log('Commande acceptée');
    });
  }

  // Méthode pour refuser une commande
  refuserCommande(commandeId: string) {
    this.commandeService.updateCommandeStatus(commandeId, 'refusée').then(() => {
      console.log('Commande refusée');
    });
  }
}
