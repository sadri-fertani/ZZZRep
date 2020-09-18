import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminTypeColloquesListComponent } from './admin-typeColloques-list/admin-typeColloques-list.component';

import { AdminTypeColloquesCreateComponent } from './admin-typeColloques-create/admin-typeColloques-create.component';
import { AdminTypeColloquesEditComponent } from './admin-typeColloques-edit/admin-typeColloques-edit.component';



import { Shell } from '../../shell/shell.service';

import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'typeColloques',
      component: AdminTypeColloquesListComponent,
      canActivate: [AuthorizeGuard]
    },
    {
      path: 'typeColloques/add',
      component: AdminTypeColloquesCreateComponent,
      canActivate: [AuthorizeGuard]
    },
    {
      path: 'typeColloques/edit/:id',
      component: AdminTypeColloquesEditComponent,
      canActivate: [AuthorizeGuard]
    }

  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminTypeColloquesRoutingModule { }
