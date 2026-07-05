import { Routes } from '@angular/router';
import { ProductDetail } from './products/product-detail/product-detail';
import { ProductForm } from './products/product-form/product-form';
import { ProductList } from './products/product-list/product-list';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products',
  },
  {
    path: 'products',
    component: ProductList,
  },
  {
    path: 'products/new',
    component: ProductForm,
  },
  {
    path: 'products/:id',
    component: ProductDetail,
  },
  {
    path: 'products/:id/edit',
    component: ProductForm,
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
