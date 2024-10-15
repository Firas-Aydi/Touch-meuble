import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Pack } from '../models/pack.model';
import { Chambre } from '../models/chambre.model';  // Assuming you have a Chambre model
import { SalleAManger } from '../models/salleAManger.model';      // Assuming you have a Salle model
import { Salon } from '../models/salon.model';      // Assuming you have a Salon model

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartProductItems: { product: Product, quantity: number }[] = [];
  private cartPackItems: { pack: Pack, quantity: number }[] = [];
  private cartChambreItems: { chambre: Chambre, quantity: number }[] = [];
  private cartSalleItems: { salle: SalleAManger, quantity: number }[] = [];
  private cartSalonItems: { salon: Salon, quantity: number }[] = [];

  private cartItems: {itemId:string, type: string, item: any, quantity: number }[] = [];

  constructor() {}

  // Add a product to the cart
  addProductToCart(product: Product, quantity: number) {
    const existingItem = this.cartProductItems.find(item => item.product.productId === product.productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartProductItems.push({ product, quantity });
    }
  }

  // Add a pack to the cart
  addPackToCart(pack: Pack, quantity: number) {
    const existingItem = this.cartPackItems.find(item => item.pack.packId === pack.packId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartPackItems.push({ pack, quantity });
    }
  }

  // Add a chambre to the cart
  addChambreToCart(chambre: Chambre, quantity: number) {
    const existingItem = this.cartChambreItems.find(item => item.chambre.chambreId === chambre.chambreId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartChambreItems.push({ chambre, quantity });
    }
  }

  // Add a salle to the cart
  addSalleToCart(salle: SalleAManger, quantity: number) {
    const existingItem = this.cartSalleItems.find(item => item.salle.salleId === salle.salleId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartSalleItems.push({ salle, quantity });
    }
  }

  // Add a salon to the cart
  addSalonToCart(salon: Salon, quantity: number) {
    const existingItem = this.cartSalonItems.find(item => item.salon.salonId === salon.salonId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartSalonItems.push({ salon, quantity });
    }
  }

  // Get all cart items
  getProductItems() {
    return this.cartProductItems;
  }

  // Get all pack items
  getCartPackItems() {
    return this.cartPackItems;
  }

  // Get all chambre items
  getCartChambreItems() {
    return this.cartChambreItems;
  }

  // Get all salle items
  getCartSalleItems() {
    return this.cartSalleItems;
  }

  // Get all salon items
  getCartSalonItems() {
    return this.cartSalonItems;
  }

  // Update quantity of a specific product
  updateProductItem(productId: string, quantity: number) {
    const item = this.cartProductItems.find(item => item.product.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
  }

  // Update quantity of a specific pack
  updatePackItem(packId: string, quantity: number) {
    const item = this.cartPackItems.find(item => item.pack.packId === packId);
    if (item) {
      item.quantity = quantity;
    }
  }

  // Update quantity of a specific chambre
  updateChambreItem(chambreId: string, quantity: number) {
    const item = this.cartChambreItems.find(item => item.chambre.chambreId === chambreId);
    if (item) {
      item.quantity = quantity;
    }
  }

  // Update quantity of a specific salle
  updateSalleItem(salleId: string, quantity: number) {
    const item = this.cartSalleItems.find(item => item.salle.salleId === salleId);
    if (item) {
      item.quantity = quantity;
    }
  }

  // Update quantity of a specific salon
  updateSalonItem(salonId: string, quantity: number) {
    const item = this.cartSalonItems.find(item => item.salon.salonId === salonId);
    if (item) {
      item.quantity = quantity;
    }
  }

  // Remove a product from the cart
  removeProductItem(productId: string) {
    this.cartProductItems = this.cartProductItems.filter(item => item.product.productId !== productId);
  }

  // Remove a pack from the cart
  removePackItem(packId: string) {
    this.cartPackItems = this.cartPackItems.filter(item => item.pack.packId !== packId);
  }

  // Remove a chambre from the cart
  removeChambreItem(chambreId: string) {
    this.cartChambreItems = this.cartChambreItems.filter(item => item.chambre.chambreId !== chambreId);
  }

  // Remove a salle from the cart
  removeSalleItem(salleId: string) {
    this.cartSalleItems = this.cartSalleItems.filter(item => item.salle.salleId !== salleId);
  }

  // Remove a salon from the cart
  removeSalonItem(salonId: string) {
    this.cartSalonItems = this.cartSalonItems.filter(item => item.salon.salonId !== salonId);
  }

  // Clear the cart after checkout
  clearCart() {
    this.cartProductItems = [];
    this.cartPackItems = [];
    this.cartChambreItems = [];
    this.cartSalleItems = [];
    this.cartSalonItems = [];
  }


  // Add item to cart (Product, Pack, Chambre, Salle, or Salon)
  // Add item to cart (Product, Pack, Chambre, Salle, or Salon)
addToCart(item: any, type: string, quantity: number) {
  let itemId: string;

  // Determine the correct ID based on the type
  switch (type) {
      case 'pack':
          itemId = item.packId;
          break;
      case 'chambre':
          itemId = item.chambreId;
          break;
      case 'salle':
          itemId = item.salleId;
          break;
      case 'salon':
          itemId = item.salonId;
          break;
      case 'product':
          itemId = item.productId;
          break;
      default:
          console.error('Unknown item type:', type);
          return; // Exit if type is unknown
  }

  console.log('Adding item to cart:', item, 'with ID:', itemId);

  const existingItem = this.cartItems.find(cartItem => 
      (cartItem.item.packId === itemId && cartItem.type === 'pack') ||
      (cartItem.item.chambreId === itemId && cartItem.type === 'chambre') ||
      (cartItem.item.salleId === itemId && cartItem.type === 'salle') ||
      (cartItem.item.salonId === itemId && cartItem.type === 'salon') ||
      (cartItem.item.productId === itemId && cartItem.type === 'product')
  );

  if (existingItem) {
      existingItem.quantity += quantity;
  } else {
      this.cartItems.push({itemId, type, item, quantity });
  }
}


  // Get all cart items
getCartItems() {
  return this.cartItems;
}

// Update quantity of a specific item
updateCartItem(type: string, itemId: string, quantity: number) {
  const cartItem = this.cartItems.find(cartItem => 
      cartItem.itemId === itemId && cartItem.type === type
  );

  if (cartItem) {
      cartItem.quantity = quantity; // Met à jour la quantité si l'élément est trouvé
  } else {
      console.warn(`Item not found in cart for type: ${type}, itemId: ${itemId}`);
  }
}


// Remove item from cart (Product, Pack, Chambre, Salle, or Salon)
removeCartItem(type: string, itemId: string) {
  console.log('type: ', type, 'item:', itemId);
  this.cartItems = this.cartItems.filter(cartItem => 
      !(cartItem.itemId === itemId && cartItem.type === type)
  );
}



  // Clear the cart after checkout
  // clearCart() {
  //   this.cartItems = [];
  // }
}
