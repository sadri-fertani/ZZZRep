// include directives/components commonly used in features modules in this shared modules
// and import me into the feature module
// importing them individually results in: Type xxx is part of the declarations of 2 modules: ... Please consider moving to a higher module...
// https://github.com/angular/angular/issues/10646  

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

import { AutofocusDirective } from './directives/auto-focus.directive';
import { TooltipDirective } from './directives/tooltip.directive';
import { PhoneMaskDirective } from './directives/phone-mask.directive';
import { FilterPipe } from './pipes/filter.pipe';
import { CustomDatePipe } from './pipes/custom.datepipe';

//https://stackoverflow.com/questions/41433766/directive-doesnt-work-in-a-sub-module
//https://stackoverflow.com/questions/45032043/uncaught-error-unexpected-module-formsmodule-declared-by-the-module-appmodul/45032201

@NgModule({
  imports: [CommonModule, NgxSpinnerModule, ToastrModule.forRoot(), NgbModule, NgxPaginationModule],
  declarations: [AutofocusDirective, TooltipDirective, PhoneMaskDirective, FilterPipe, CustomDatePipe],
  exports: [NgxSpinnerModule, AutofocusDirective, TooltipDirective, PhoneMaskDirective, FilterPipe, CustomDatePipe, NgbModule, NgxPaginationModule],
  providers: []
})
export class SharedModule { }