import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminFonctionsListComponent } from './admin-fonctions-list/admin-fonctions-list.component';
import { AdminFonctionsCreateComponent } from './admin-fonctions-create/admin-fonctions-create.component';
import { AdminFonctionsEditComponent } from './admin-fonctions-edit/admin-fonctions-edit.component';



import { Shell } from '../../shell/shell.service';

import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'fonctions',
      component: AdminFonctionsListComponent,
      canActivate: [AuthorizeGuard]
    },
    {
      path: 'fonctions/add',
      component: AdminFonctionsCreateComponent,
      canActivate: [AuthorizeGuard]
    },
    {
      path: 'fonctions/edit/:id',
      component: AdminFonctionsEditComponent,
      canActivate: [AuthorizeGuard]
    }

  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminFonctionsRoutingModule { }
