import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from '../shell/shell.service';

import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';


const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'admin',
      redirectTo: 'admin/ecoles',
      pathMatch: 'full'
    },
    {
      path: 'admin/ecoles',
      loadChildren: () => import('./ecoles/admin-ecoles.module').then(m => m.AdminEcolesModule),
      canActivate: [AuthorizeGuard]
    },
    {
      path: 'admin/fonctions',
      loadChildren: () => import('./fonctions/admin-fonctions.module').then(m => m.AdminFonctionsModule),
      canActivate: [AuthorizeGuard]
    },
    {
      path: 'admin/colloques',
      loadChildren: () => import('./colloques/admin-colloques.module').then(m => m.AdminColloquesModule),
      canActivate: [AuthorizeGuard]
    },
    {
      path: 'admin/typeColloques',
      loadChildren: () => import('./typeColloques/admin-typeColloques.module').then(m => m.AdminTypeColloquesModule),
      canActivate: [AuthorizeGuard]
    },
    {
      path: 'admin/inscriptions',
      loadChildren: () => import('./inscriptions/admin-inscriptions.module').then(m => m.AdminInscriptionsModule),
      canActivate: [AuthorizeGuard]
    },
    {
      path: 'admin/participants',
      loadChildren: () => import('./participants/admin-participants.module').then(m => m.AdminParticipantsModule),
      canActivate: [AuthorizeGuard]
    }
  ])
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
