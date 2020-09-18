import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';

import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { AdminModule } from './admin/admin.module';

import { RepositoryEcole } from 'src/repositories/RepositoryEcole';
import { RepositoryColloque } from 'src/repositories/RepositoryColloque';
import { RepositoryFonction } from 'src/repositories/RepositoryFonction';
import { RepositoryParticipant } from 'src/repositories/RepositoryParticipant';
import { RepositoryTypeColloque } from 'src/repositories/RepositoryTypeColloque';
import { RepositoryInscription } from 'src/repositories/RepositoryInscription';
import { RepositoryInscriptionBulk } from 'src/repositories/RepositoryInscriptionBulk';
import { RepositoryPdfCreator } from 'src/repositories/RepositoryPdfCreator';
import { RepositoryConfigApplication } from 'src/repositories/RepositoryConfigApplication';

import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';

import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { ErrorInterceptorService } from 'src/services/error.interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent
  ],
  imports: [
    SharedModule,
    HomeModule,
    AdminModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ApiAuthorizationModule,
    AppRoutingModule,
    BrowserAnimationsModule,

  ],
  providers: [
    RepositoryEcole, 
    RepositoryFonction, 
    RepositoryColloque,
    RepositoryParticipant,
    RepositoryInscription,
    RepositoryTypeColloque,
    RepositoryInscriptionBulk,
    RepositoryPdfCreator,
    RepositoryConfigApplication,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizeInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }