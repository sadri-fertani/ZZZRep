import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IndexComponent } from './index/index.component';
import { InscriptionCreationComponent } from './inscription/inscription-creation/inscription-creation.component';
import { InscriptionModificationComponent } from './inscription/inscription-modification/inscription-modification.component';


import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';

import { CommunicationService } from '../../services/communication.service';

@NgModule({
  declarations: [IndexComponent, InscriptionCreationComponent, InscriptionModificationComponent],
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    CommunicationService
  ]
})
export class HomeModule { }