import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './main.component';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {SharedModule} from '../../shared/shared.module';

const routes: Routes = [
  {path: '', component: MainComponent}
];

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    CarouselModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class MainModule {}
