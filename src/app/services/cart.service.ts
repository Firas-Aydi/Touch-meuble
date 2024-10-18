import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: { itemId: string; type: string; item: any; quantity: number; }[] = [];
  cartItemCount$ = new Subject<number>();

  constructor() {
    this.loadCartFromLocalStorage();
  }

  addToCart(item: any, type: string, quantity: number) {
    const itemId = item.packId || item.chambreId || item.salleId || item.salonId || item.productId;
    const existingItem = this.cartItems.find(cartItem => cartItem.itemId === itemId && cartItem.type === type);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ itemId, type, item, quantity });
    }

    this.cartItemCount$.next(this.getTotalItemsCount());
    this.saveCartToLocalStorage();
  }

  getCartItems() {
    return this.cartItems;
  }

  updateCartItem(type: string, itemId: string, quantity: number) {
    const cartItem = this.cartItems.find(cartItem => cartItem.itemId === itemId && cartItem.type === type);

    if (cartItem) {
      cartItem.quantity = quantity; 
      this.saveCartToLocalStorage();
    }
  }

  removeCartItem(type: string, itemId: string) {
    this.cartItems = this.cartItems.filter(cartItem => !(cartItem.itemId === itemId && cartItem.type === type));
    this.cartItemCount$.next(this.getTotalItemsCount());
    this.saveCartToLocalStorage();
  }

  getTotalItemsCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  private saveCartToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    localStorage.setItem('cartItemCount', this.getTotalItemsCount().toString());
  }

  private loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartItemCount$.next(this.getTotalItemsCount());
    }
  }
}
