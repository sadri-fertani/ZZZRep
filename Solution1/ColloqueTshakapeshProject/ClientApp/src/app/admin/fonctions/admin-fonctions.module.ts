import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';

import { AdminFonctionsRoutingModule } from './admin-fonctions-routing.module';

import { AdminFonctionsListComponent } from './admin-fonctions-list/admin-fonctions-list.component';
import { AdminFonctionsCreateComponent } from './admin-fonctions-create/admin-fonctions-create.component';
import { AdminFonctionsEditComponent } from './admin-fonctions-edit/admin-fonctions-edit.component';
import { AdminFonctionsDeleteModalComponent } from './admin-fonctions-delete-modal/admin-fonctions-delete-modal.component';


@NgModule({
  declarations: [
    AdminFonctionsListComponent, 
    AdminFonctionsCreateComponent,
    AdminFonctionsEditComponent,
    AdminFonctionsDeleteModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminFonctionsRoutingModule,
    SharedModule
  ],
  entryComponents: [ AdminFonctionsDeleteModalComponent ],

})
export class AdminFonctionsModule { }
