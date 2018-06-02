"use strict";

import * as moment from "moment";
import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
    selector: 'website',
    templateUrl: './website.component.html',
    styleUrls: ['./website.component.scss']
})
export class WebsiteComponent implements OnInit, AfterViewChecked {
    private previousRoute = [];

    constructor(private router: Router) {
      /*let NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';
      fontawesome.library.add(faSolid);
      fontawesome.library.add(faRegular);
      fontawesome.library.add(faLight);
      fontawesome.library.add(faBrands);
      window[NAMESPACE_IDENTIFIER].packs.fa = fontawesome.library.definitions.fa;
      window[NAMESPACE_IDENTIFIER].packs.fab = fontawesome.library.definitions.fab;
      window[NAMESPACE_IDENTIFIER].packs.fas = fontawesome.library.definitions.fas;
      window[NAMESPACE_IDENTIFIER].packs.far = fontawesome.library.definitions.far;
      window[NAMESPACE_IDENTIFIER].packs.fal = fontawesome.library.definitions.fal;*/
    }

    ngOnInit() {
        moment.locale(navigator.language);
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe(e => {
                window.scrollTo(0, 0);
                this.previousRoute.push(e);
            });
    }

    ngAfterViewChecked(): void {
        // TODO: find more performant way for fontawesome.dom.i2svg();
    }

    getPreviousRoute() {
        return this.previousRoute.length>1 ? this.previousRoute[this.previousRoute.length-2] : null;
    }
}
