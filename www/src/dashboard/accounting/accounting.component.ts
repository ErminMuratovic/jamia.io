"use strict";

import * as moment from "moment";
import {Component, OnInit} from "@angular/core";

import {AuthService} from "../../_services/auth.service";
import {JamiaService} from "../../_services/jamia.service";
import {FinanceService} from "../../_services/finance.service";

@Component({
  moduleId: module.id,
  templateUrl: 'accounting.component.html',
  styleUrls: ['./accounting.component.scss']
})

export class AccountingComponent implements OnInit {

  public user;
  public jamias;

  public jamia;
  public transactions;

  public loadingTransactions = false;
  public searchTransactions;

  public results = {
    incoming: 0,
    outgoing: 0,
    result: 0
  };

  constructor(private authService: AuthService, private jamiaService: JamiaService, private financeService: FinanceService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn()
      .subscribe(user => {
        this.user = user;
        if (this.user) {
          this.updateData();
        }
      });
  }

  updateData() {
    this.jamiaService.getJamia({admin: this.user["_id"]})
      .subscribe(jamias => {
        this.jamias = jamias;
        this.jamia = jamias[0];
        this.loadJamia();
      });
  }

  loadJamia() {
    if (this.jamia) {
      this.financeService.getTransactions({jamia: this.jamia["_id"]})
        .subscribe(transactions => {
          this.transactions = transactions;
          this.results.incoming = this.transactions.reduce((sum, a) => {
            if (a.amount > 0)
              return sum + a.amount;
            else
              return sum;
          }, 0);
          this.results.outgoing = this.transactions.reduce((sum, a) => {
            if (a.amount < 0)
              return sum + a.amount;
            else
              return sum;
          }, 0);

          this.results.result = this.results.incoming + this.results.outgoing;
        });
    }
  }

  selectJamia(jamia) {
    this.jamia = jamia;
    this.loadJamia();
  }

  formatDate(dateString, format?) {
    return moment(dateString).format(format ? format : "L");
  }

}
