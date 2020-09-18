import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';

import { AdminEcolesRoutingModule } from './admin-ecoles-routing.module';

import { AdminEcolesListComponent } from './admin-ecoles-list/admin-ecoles-list.component';
import { AdminEcolesCreateComponent } from './admin-ecoles-create/admin-ecoles-create.component';
import { AdminEcolesEditComponent } from './admin-ecoles-edit/admin-ecoles-edit.component';
import { AdminEcolesDeleteModalComponent } from './admin-ecoles-delete-modal/admin-ecoles-delete-modal.component';

@NgModule({
  declarations: [AdminEcolesListComponent, AdminEcolesCreateComponent, AdminEcolesEditComponent, AdminEcolesDeleteModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminEcolesRoutingModule,
    SharedModule
  ],
  entryComponents: [AdminEcolesDeleteModalComponent]
})
export class AdminEcolesModule { }