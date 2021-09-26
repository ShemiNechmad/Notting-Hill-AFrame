import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrossingRoutingModule } from './crossing-routing.module';
import { CrossingSiteComponent } from './crossing-site/crossing-site.component';
import { AAssetsComponent } from '../a-assets/a-assets.component';


@NgModule({
  declarations: [CrossingSiteComponent, AAssetsComponent],
  imports: [
    CommonModule,
    CrossingRoutingModule,
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrossingModule { }
