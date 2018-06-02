import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../_services/auth.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";

@Injectable()
class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate() {
        return this.authService.isLoggedIn()
            .map(user => {
                return true;
            })
            .catch(error => {
                this.router.navigate(['/login']);
                return Observable.of(false);
            });
    }
}

export {AuthGuard};