import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './shared/layout/layout.component';
import {AuthForwardGuard} from './core/auth/auth-forward.guard';
import {AuthGuard} from './core/auth/auth.guard';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./views/main/main.module').then(m => m.MainModule)
    },
    {
      path: '',
      loadChildren: () => import('./views/user/user.module').then(m => m.UserModule),
      canActivate: [AuthForwardGuard]
    },
    {
      path: '',
      loadChildren: () => import('./views/product/product.module').then(m => m.ProductModule)
    },
    {
      path: '',
      loadChildren: () => import('./views/order/order.module').then(m => m.OrderModule)
    },
    {
      path: '',
      loadChildren: () => import('./views/personal/personal.module').then(m => m.PersonalModule),
      canActivate: [AuthGuard]
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled', initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
