import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product.model';
import { Pack } from '../models/pack.model';
import { Chambre } from '../models/chambre.model';
import { SalleAManger } from '../models/salleAManger.model';
import { Salon } from '../models/salon.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  allCartItems: any[] = [];
  totalPrice: number = 0;
  quantityErrors: { [itemId: string]: string } = {};

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.calculateTotalPrice();
  }

  loadCartItems() {
    this.allCartItems = this.cartService.getCartItems();
    console.log('allCartItems:',this.allCartItems)
  }

  // Calculate the total price
  calculateTotalPrice() {
    this.totalPrice = this.allCartItems.reduce(
      (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
      0
    );
  }

  // Update quantity and handle stock checks
  updateQuantity(cartItem: any, quantity: number) {
    const stock = cartItem.item.stock || 0;
    const itemId = cartItem.itemId;

    if (quantity < 1) {
      this.quantityErrors[itemId] = 'Quantity must be at least 1.';
    } else if (quantity > stock) {
      this.quantityErrors[itemId] = `Quantity cannot exceed stock limit of ${stock}.`;
    } else {
      this.quantityErrors[itemId] = ''
      cartItem.quantity = quantity;
      this.cartService.updateCartItem(cartItem.type, itemId, quantity);
      this.calculateTotalPrice();
    }
  }

  // Remove item from cart
  removeItem(itemId: string, itemType: string) {
  console.log('cart.component: type: ',itemType,'item:',itemId)

    this.cartService.removeCartItem(itemType, itemId);
    this.loadCartItems();
    this.calculateTotalPrice();
  }

  // Proceed to checkout
  proceedToCheckout() {
    console.log('Proceeding to checkout with total price: ', this.totalPrice);
  }
}
