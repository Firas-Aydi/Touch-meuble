import { Component } from '@angular/core';
import { Commande } from '../models/commande.model';

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css'],
})
export class CommandeComponent {
  order: Commande = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    region: '',
    email: '',
    phone: '',
    notes: ''
  };

  onSubmit(form: any) {
    console.log('Order submitted:', this.order);
    // Traitez ici la commande, par exemple en l'envoyant à votre backend
  }
}
