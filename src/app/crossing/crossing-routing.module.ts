import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrossingSiteComponent } from './crossing-site/crossing-site.component';


const routes: Routes = [
  {
    path: '', component: CrossingSiteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrossingRoutingModule { }
