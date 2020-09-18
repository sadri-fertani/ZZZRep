import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminParticipantsListComponent } from './admin-participants-list/admin-participants-list.component';
import { AdminParticipantsEditComponent } from './admin-participants-edit/admin-participants-edit.component';

import { Shell } from '../../shell/shell.service';

import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'participants',
      component: AdminParticipantsListComponent,
      canActivate: [AuthorizeGuard]
    },
    {
      path: 'participants/edit/:id',
      component: AdminParticipantsEditComponent,
      canActivate: [AuthorizeGuard]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminParticipantsRoutingModule { }
