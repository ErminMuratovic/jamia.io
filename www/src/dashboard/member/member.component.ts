"use strict";

import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../_services/auth.service";
import {JamiaService} from "../../_services/jamia.service";
import {FinanceService} from "../../_services/finance.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  moduleId: module.id,
  templateUrl: 'member.component.html',
  styleUrls: ['./member.component.scss']
})

export class MemberComponent implements OnInit {

  public user;
  public jamias;

  public member: any = {};
  public loadingJamias = false;
  public loadingMember = false;
  public savingMember = false;

  private paramssub;

  constructor(private authService: AuthService, private jamiaService: JamiaService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.paramssub = this.route.queryParams.subscribe(params => {
      this.loadData(params["memberId"]);
    });
  }

  loadData(memberId) {
    this.loadingMember = true;
    this.authService.isLoggedIn()
      .subscribe(user => {
        this.user = user;
        if (memberId) {
          this.authService.getUser(memberId)
            .subscribe(member => {
              this.member = member;
              this.loadJamias();
              this.loadingMember = false;
            });
        } else {
          this.loadJamias();
          this.loadingMember = false;
        }
      });
  }

  loadJamias() {
    this.loadingJamias = true;
    this.jamiaService.getJamia({admin: this.user["_id"]})
      .subscribe(jamias => {
        this.jamias = jamias;
        this.selectJamia(jamias[0]);
        this.loadingJamias = false;
      });
  }

  selectJamia(jamia) {
    this.member.jamia = jamia["_id"];
  }

  saveMember() {
    this.savingMember = true;
    if (this.member["_id"]) {
      //TODO: update user
      this.savingMember = false;
    } else {
      //TODO: create user
      this.savingMember = false;
    }
  }

  getProfileImage() {
    return "";
  }

  changeProfileImage() {

  }

}
