"use strict";

import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {TruncateModule} from "ng2-truncate";
import {MomentModule} from 'angular2-moment';

import {BsDropdownModule, ButtonsModule, CarouselModule, TooltipModule, PaginationModule, TabsModule, ModalModule} from 'ngx-bootstrap';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {Angulartics2Module, Angulartics2GoogleAnalytics} from 'angulartics2';

import {DndModule} from 'ng2-dnd';
import {AgmCoreModule} from "@agm/core";
import {NgPipesModule} from 'ng-pipes';
import {StickyModule} from 'ng2-sticky-kit/ng2-sticky-kit';
import {FacebookModule} from 'ngx-facebook';
import {ScrollSpyModule} from 'ngx-scrollspy';
import {RecaptchaModule} from "ng-recaptcha";
import {ScrollSpyIndexModule} from 'ngx-scrollspy/dist/plugin'
import {BsDatepickerModule} from 'ngx-bootstrap';
import {defineLocale} from 'ngx-bootstrap/bs-moment';
import {de} from 'ngx-bootstrap/locale';

import {routing} from './website.routing';
import {WebsiteComponent} from './website.component';

import {AuthService} from './_services/auth.service';
import {CountryService} from "./_services/country.service";

import {AuthGuard} from "./_guards/auth.guard";
import {AdminGuard} from "./_guards/admin.guard";
import {LoginGuard} from "./_guards/login.guard";

import {WebsiteHeaderComponent} from './website-header/website-header.component';
import {WebsiteFooterComponent} from './website-footer/website-footer.component';

import {HomeComponent} from './home/home.component';
import {LoginComponent} from "./login/login.component";
import {ImpressumComponent} from "./impressum/impressum.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {JamiaService} from "./_services/jamia.service";
import {FinanceService} from "./_services/finance.service";
import {MembersComponent} from "./dashboard/members/members.component";
import {AccountingComponent} from "./dashboard/accounting/accounting.component";
import {OverviewComponent} from "./overview/overview.component";
import {MemberComponent} from "./dashboard/member/member.component";

defineLocale('de', de);

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,

    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    CarouselModule.forRoot(),
    TooltipModule.forRoot(),
    FacebookModule.forRoot(),
    ScrollSpyModule.forRoot(),
    ScrollSpyIndexModule,
    DndModule.forRoot(),
    StickyModule,
    TruncateModule,
    AngularMultiSelectModule,
    MomentModule,
    RecaptchaModule.forRoot(),
    NgPipesModule,

    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDin3s7JnIva_Ny_I7y3xLXAwAmmyZb3Tg",
      libraries: ["places"]
    }),

    BsDatepickerModule.forRoot()
  ],
  declarations: [
    WebsiteComponent,
    WebsiteHeaderComponent,
    WebsiteFooterComponent,
    HomeComponent,
    LoginComponent,
    ImpressumComponent,
    DashboardComponent,
    MembersComponent,
    AccountingComponent,
    OverviewComponent,
    MemberComponent,
  ],
  providers: [
    AuthService,
    JamiaService,
    FinanceService,
    CountryService,
    AuthGuard,
    AdminGuard,
    LoginGuard,
    {
      provide: LOCALE_ID,
      useValue: navigator.language
    },
  ],
  bootstrap: [WebsiteComponent]
})
export class WebsiteModule {
}
