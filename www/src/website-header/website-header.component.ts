import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../_services/auth.service";
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'website-header',
  templateUrl: 'website-header.component.html',
  styleUrls: ['./website-header.component.scss']
})

export class WebsiteHeaderComponent implements OnInit {

  public user;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.isLoggedIn()
      .subscribe(user => {
        this.user = user;
      });
  }

  logout() {
    this.authService.logout().subscribe(response => window.location.href = "/", error => console.log(error));
  }
}
