import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminEcolesModule } from './ecoles/admin-ecoles.module';
import { AdminFonctionsModule } from './fonctions/admin-fonctions.module';
import { AdminColloquesModule } from './colloques/admin-colloques.module';
import { AdminTypeColloquesModule } from './typeColloques/admin-typeColloques.module';
import { AdminInscriptionsModule } from './inscriptions/admin-inscriptions.module';
import { AdminParticipantsModule } from './participants/admin-participants.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    AdminEcolesModule,
    AdminFonctionsModule,
    AdminColloquesModule,
    AdminTypeColloquesModule,
    AdminInscriptionsModule,
    AdminParticipantsModule,
    SharedModule
  ]
})
export class AdminModule { }