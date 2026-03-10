import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutComponent} from './shared/layout/layout.component';
import {HeaderComponent} from './shared/layout/header/header.component';
import {FooterComponent} from './shared/layout/footer/footer.component';
import {LoaderComponent} from './shared/components/loader/loader.component';
import {AuthInterceptor} from './core/auth/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    CommonModule,
    MatSnackBarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
