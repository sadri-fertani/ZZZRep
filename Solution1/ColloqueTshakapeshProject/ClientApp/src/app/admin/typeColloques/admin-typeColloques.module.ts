import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';

import { AdminTypeColloquesRoutingModule } from './admin-typeColloques-routing.module';

import { AdminTypeColloquesListComponent } from './admin-typeColloques-list/admin-typeColloques-list.component';

import { AdminTypeColloquesCreateComponent } from './admin-typeColloques-create/admin-typeColloques-create.component';
import { AdminTypeColloquesEditComponent } from './admin-typeColloques-edit/admin-typeColloques-edit.component';
import { AdminTypeColloquesDeleteModalComponent } from './admin-typeColloques-delete-modal/admin-typeColloques-delete-modal.component';


@NgModule({
  declarations: [
     AdminTypeColloquesListComponent,
     AdminTypeColloquesCreateComponent,
     AdminTypeColloquesEditComponent,
     AdminTypeColloquesDeleteModalComponent, 
],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminTypeColloquesRoutingModule,
    SharedModule
  ],
  entryComponents: [AdminTypeColloquesDeleteModalComponent],

})
export class AdminTypeColloquesModule { }
