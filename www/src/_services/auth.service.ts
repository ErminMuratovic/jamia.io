import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, URLSearchParams} from '@angular/http';
import {environment} from '../_environments/environment';

import 'rxjs/Rx';

interface IAuthService {
  isLoggedIn();
  register(user: any);
  login(email: string, password: string);
  getUserByConfirmationId(confirmationId: string);
  logout();
}

@Injectable()
class AuthService implements IAuthService {

  private apiUrl = environment.apiUrl + "/auth";
  private httpOptions = new RequestOptions({withCredentials: true});

  constructor(private http: Http) {
  }

  isLoggedIn() {
    return this.http.get(this.apiUrl, this.httpOptions).map((response: Response) => response.json());
  }

  register(user: any) {
    return this.http.post(this.apiUrl + "/signup", user, this.httpOptions).map((response: Response) => response.json());
  }

  login(email: string, password: string) {
    return this.http.post(this.apiUrl, {
      email,
      password
    }, this.httpOptions).map((response: Response) => response.json());
  }

  resetPassword(email: string, password?: string, confirmationId?: string) {
    return this.http.put(this.apiUrl + "/resetpassword", {
      email,
      password,
      confirmationId
    }, this.httpOptions).map((response: Response) => response.json());
  }

  relogin(email: string, password: string, confirmationId: string) {
    return this.http.post(this.apiUrl, {
      email,
      password,
      confirmationId
    }, this.httpOptions).map((response: Response) => response.json());
  }

  saveUser(user) {
    return this.http.put(this.apiUrl + "/user/" + user._id, user, this.httpOptions).map((response: Response) => response.json());
  }

  confirmEmail(confirmationId) {
    return this.http.put(this.apiUrl + "/confirm/" + confirmationId, {}, this.httpOptions).map((response: Response) => response.json());
  }

  logout() {
    return this.http.delete(this.apiUrl, this.httpOptions);
  }

  getUserByConfirmationId(confirmationId: string) {
    return this.http.get(this.apiUrl + "/userConfirmation/" + confirmationId, this.httpOptions).map((response: Response) => response.json());
  }

  getUsers(searchParams?: any) {
    let requestOptions = new RequestOptions({withCredentials: true});
    if (searchParams) {
      requestOptions.params = new URLSearchParams();

      if (searchParams["jamia"])
        requestOptions.params.set("jamia", searchParams["jamia"]);
      if (searchParams["name"])
        requestOptions.params.set("name", searchParams["name"]);
      if (searchParams["pageSize"])
        requestOptions.params.set("pageSize", searchParams["pageSize"]);
      if (searchParams["page"])
        requestOptions.params.set("page", searchParams["page"]);
    }
    return this.http.get(this.apiUrl + "/user", requestOptions).map((response: Response) => response.json());
  }
}

export {IAuthService, AuthService}
