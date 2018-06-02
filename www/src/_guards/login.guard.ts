import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../_services/auth.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";

@Injectable()
class LoginGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate() {
        return this.authService.isLoggedIn()
            .map(user => {
              this.router.navigate(['/dashboard']);
              return false;
            })
            .catch(error => {
              return Observable.of(true);
            });
    }
}

export {LoginGuard};
