import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { InscriptionCreationComponent } from './inscription/inscription-creation/inscription-creation.component';
import { InscriptionModificationComponent } from './inscription/inscription-modification/inscription-modification.component';

import { Shell } from './../shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: IndexComponent },
    { path: 'home/inscription', component: InscriptionCreationComponent },
    { path: 'home/inscription/:guid', component: InscriptionModificationComponent }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule { }