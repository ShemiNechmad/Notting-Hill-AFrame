import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartPageComponent } from './start-page/start-page.component';


const routes: Routes = [
  {
    path: '',
    component: StartPageComponent
  },
  {
    path: 'crossing',
    loadChildren: 'src/app/crossing/crossing.module#CrossingModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
