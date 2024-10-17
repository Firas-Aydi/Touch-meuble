import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
// import { VarifyEmailComponent } from './varify-email/varify-email.component';
import { PackComponent } from './pack/pack.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { PackDetailsComponent } from './pack-details/pack-details.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { PackManagementComponent } from './pack-management/pack-management.component';
import { HomeComponent } from './home/home.component';
import { SalonManagementComponent } from './salon-management/salon-management.component';
import { ChambreManagementComponent } from './chambre-management/chambre-management.component';
import { SalleAMangeManagementComponent } from './salle-amange-management/salle-amange-management.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ChambreDetailsComponent } from './chambre-details/chambre-details.component';
import { SalonDetailsComponent } from './salon-details/salon-details.component';
import { SalleAmangeDetailsComponent } from './salle-amange-details/salle-amange-details.component';
import { ChambreComponent } from './chambre/chambre.component';
import { SalonComponent } from './salon/salon.component';
import { SalleAmangeComponent } from './salle-amange/salle-amange.component';
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
  // { path: 'varify-email', component: VarifyEmailComponent },
  { path: 'packs', component: PackComponent },
  { path: 'packs-management', component: PackManagementComponent },
  { path: 'packs/:packId', component: PackDetailsComponent },
  { path: 'products', component: ProductComponent },
  { path: 'products-management', component: ProductManagementComponent },
  { path: 'products/:productId', component: ProductDetailsComponent }, // Route for product details
  { path: 'cart', component: CartComponent },
  { path: 'chambres', component: ChambreComponent },
  { path: 'salles', component: SalleAmangeComponent },
  { path: 'salons', component: SalonComponent },
  { path: 'categories-management', component: CategoryManagementComponent },
  { path: 'salons-management', component: SalonManagementComponent },
  { path: 'chambres-management', component: ChambreManagementComponent },
  { path: 'salles-management', component: SalleAMangeManagementComponent },
  { path: 'chambres/:chambreId', component: ChambreDetailsComponent },
  { path: 'salles/:salleId', component: SalleAmangeDetailsComponent },
  { path: 'salons/:salonId', component: SalonDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
