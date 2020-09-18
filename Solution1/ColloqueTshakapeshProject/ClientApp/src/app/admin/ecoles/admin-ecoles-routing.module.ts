import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminEcolesListComponent } from './admin-ecoles-list/admin-ecoles-list.component';
import { AdminEcolesCreateComponent } from './admin-ecoles-create/admin-ecoles-create.component';
import { AdminEcolesEditComponent } from './admin-ecoles-edit/admin-ecoles-edit.component';

import { Shell } from '../../shell/shell.service';

import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'ecoles',
      component: AdminEcolesListComponent,
      canActivate: [AuthorizeGuard]
    },
    {
      path: 'ecoles/add',
      component: AdminEcolesCreateComponent,
      canActivate: [AuthorizeGuard]
    },
    {
      path: 'ecoles/edit/:id',
      component: AdminEcolesEditComponent,
      canActivate: [AuthorizeGuard]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminEcolesRoutingModule { }
