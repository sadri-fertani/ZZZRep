import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminInscriptionsListComponent } from './admin-inscriptions-list/admin-inscriptions-list.component';
//import { AdminInscriptionsCreateComponent } from './admin-inscriptions-create/admin-inscriptions-create.component';
//import { AdminInscriptionsEditComponent } from './admin-inscriptions-edit/admin-inscriptions-edit.component';

import { Shell } from '../../shell/shell.service';

import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'inscriptions',
      component: AdminInscriptionsListComponent,
      canActivate: [AuthorizeGuard]
    },
  /*  {
      path: 'inscriptions/add',
      component: AdminInscriptionsCreateComponent,
      canActivate: [AuthorizeGuard]
    },
    {
      path: 'inscriptions/edit/:id',
      component: AdminInscriptionsEditComponent,
      canActivate: [AuthorizeGuard]
    }*/
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminInscriptionsRoutingModule { }
