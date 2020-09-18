import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminColloquesListComponent } from './admin-colloques-list/admin-colloques-list.component';
import { AdminColloquesCreateComponent } from './admin-colloques-create/admin-colloques-create.component';
import { AdminColloquesEditComponent } from './admin-colloques-edit/admin-colloques-edit.component';

import { Shell } from '../../shell/shell.service';

import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'colloques',
      component: AdminColloquesListComponent,
      canActivate: [AuthorizeGuard]
    },
    {
      path: 'colloques/add',
      component: AdminColloquesCreateComponent,
      canActivate: [AuthorizeGuard]
    },
    {
      path: 'colloques/edit/:id',
      component: AdminColloquesEditComponent,
      canActivate: [AuthorizeGuard]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminColloquesRoutingModule { }
