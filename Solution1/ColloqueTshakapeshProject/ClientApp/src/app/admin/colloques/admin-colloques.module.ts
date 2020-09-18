import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';

import { AdminColloquesRoutingModule } from './admin-colloques-routing.module';

import { AdminColloquesListComponent } from './admin-colloques-list/admin-colloques-list.component';
import { AdminColloquesCreateComponent } from './admin-colloques-create/admin-colloques-create.component';
import { AdminColloquesEditComponent } from './admin-colloques-edit/admin-colloques-edit.component';
import { AdminColloquesOneModalComponent } from './admin-colloques-one-modal/admin-colloques-one-modal.component';

@NgModule({
  declarations: [AdminColloquesListComponent, AdminColloquesCreateComponent, AdminColloquesEditComponent, AdminColloquesOneModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminColloquesRoutingModule,
    SharedModule
  ],
  entryComponents: [AdminColloquesOneModalComponent]
})
export class AdminColloquesModule { }