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
  public totalMembers;

  public loadingUsers = false;
  public memberSearch = {
    name: "",
    pageSize: 20,
    page: 1,
    jamia: null
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
    this.jamiaService.getJamia({ admin: this.user["_id"] })
      .subscribe(jamias => {
        this.jamias = jamias;
        this.selectJamia(jamias[0]);
      });
  }

  loadUsers() {
    if(this.loadingUsers)
      return setTimeout(() => this.loadUsers(), 200);
    this.users = [];
    this.memberSearch.page = 1;
    this.getUsersNextPage();
  }

  getUsersNextPage() {
    this.loadingUsers = true;
    this.authService.getUsers(this.memberSearch)
      .subscribe(result => {
        this.users = this.users.concat(result.docs);
        this.totalMembers = result.total;
        this.users.forEach(user => {
          user.donation = user.transactions.reduce((sum, a) => {
            if (a.amount > 0)
              return sum + a.amount;
            else
              return sum;
          }, 0);
        });
        this.memberSearch.page++;
        this.loadingUsers = false;
      });
  }

  selectJamia(jamia) {
    this.jamia = jamia;
    this.memberSearch.jamia = jamia["_id"];
    this.loadUsers();
  }

  onMemberSearchChanged(userSearch) {
    this.loadUsers();
  }

  changePageSizeMembers(pageSize) {
    this.memberSearch.pageSize = pageSize;
    this.loadUsers();
  }

}
