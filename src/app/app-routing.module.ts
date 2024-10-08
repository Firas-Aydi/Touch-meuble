import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { VarifyEmailComponent } from './varify-email/varify-email.component';
import { PackComponent } from './pack/pack.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { PackDetailsComponent } from './pack-details/pack-details.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { PackManagementComponent } from './pack-management/pack-management.component';
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
  { path: 'varify-email', component: VarifyEmailComponent },
  { path: 'packs', component: PackComponent },
  { path: 'packs/:id', component: PackDetailsComponent },
  { path: 'products', component: ProductComponent },
  { path: 'cart', component: CartComponent },
  { path: 'products-management', component: ProductManagementComponent },
  { path: 'categories-management', component: CategoryManagementComponent },
  { path: 'packs-management', component: PackManagementComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
