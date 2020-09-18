import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';

import { AdminInscriptionsRoutingModule } from './admin-inscriptions-routing.module';

import { AdminInscriptionsListComponent } from './admin-inscriptions-list/admin-inscriptions-list.component';
import { AdminInscriptionsOneModalComponent } from './admin-inscriptions-one-modal/admin-inscriptions-one-modal.component';
import { AdminInscriptionsDeleteModalComponent } from './admin-inscriptions-delete-modal/admin-inscriptions-delete-modal.component';

@NgModule({
  declarations: [AdminInscriptionsListComponent,
      AdminInscriptionsOneModalComponent,
      AdminInscriptionsDeleteModalComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminInscriptionsRoutingModule,
    SharedModule
  ],
  entryComponents: [AdminInscriptionsOneModalComponent,AdminInscriptionsDeleteModalComponent]
})
export class AdminInscriptionsModule { }