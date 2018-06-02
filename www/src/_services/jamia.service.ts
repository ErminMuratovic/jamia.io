import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, URLSearchParams} from '@angular/http';
import {environment} from '../_environments/environment';

import 'rxjs/Rx';

interface IJamiaService {
  getJamia(searchParams?: any);
}

@Injectable()
class JamiaService implements IJamiaService {

    private apiUrl = environment.apiUrl+"/jamia";
    private httpOptions = new RequestOptions({ withCredentials: true });

    constructor(private http: Http) {}

    getJamia(searchParams?: any) {
        let requestOptions = new RequestOptions({ withCredentials: true });
        if(searchParams) {
          requestOptions.params = new URLSearchParams();

          if(searchParams["admin"])
            requestOptions.params.set("admin", searchParams["admin"]);
          if(searchParams["name"])
            requestOptions.params.set("name", searchParams["name"]);
        }
        return this.http.get(this.apiUrl, requestOptions).map((response: Response) => response.json());
    }
}

export {IJamiaService, JamiaService}
