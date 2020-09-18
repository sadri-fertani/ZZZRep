import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';

import { AdminParticipantsRoutingModule } from './admin-participants-routing.module';

import { AdminParticipantsListComponent } from './admin-participants-list/admin-participants-list.component';
import { AdminParticipantsEditComponent } from './admin-participants-edit/admin-participants-edit.component';

@NgModule({
  declarations: [AdminParticipantsListComponent, AdminParticipantsEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminParticipantsRoutingModule,
    SharedModule
  ]
})
export class AdminParticipantsModule { }