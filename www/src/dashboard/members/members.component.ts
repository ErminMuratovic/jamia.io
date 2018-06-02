"use strict";

import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../_services/auth.service";
import {JamiaService} from "../../_services/jamia.service";
import {FinanceService} from "../../_services/finance.service";

@Component({
  moduleId: module.id,
  templateUrl: 'members.component.html',
  styleUrls: ['./members.component.scss']
})

export class MembersComponent implements OnInit {

  public user;
  public jamias;

  public jamia;
  public users;

  public loadingUsers = false;
  public searchUser;

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
    this.jamiaService.getJamia({ admin: this.user["_id"] })
      .subscribe(jamias => {
        this.jamias = jamias;
        this.jamia = jamias[0];
        this.loadUsers();
      });
  }

  loadUsers() {
    if(this.jamia) {
      this.loadingUsers = true;
      this.authService.getUsers({ jamia: this.jamia["_id"] })
        .subscribe(users => {
          this.users = users;
          this.users.forEach(user => {
            user.donation = user.transactions.reduce((sum, a) => {
              if (a.amount > 0)
                return sum + a.amount;
              else
                return sum;
            }, 0);
          });
          this.loadingUsers = false;
        });
    }
  }

  selectJamia(jamia) {
    this.jamia = jamia;
    this.loadUsers();
  }

  onUserSearchChanged(userSearch) {

  }

}
