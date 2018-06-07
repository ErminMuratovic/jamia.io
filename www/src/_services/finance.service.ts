import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, URLSearchParams} from '@angular/http';
import {environment} from '../_environments/environment';

import 'rxjs/Rx';

interface IFinanceService {
    getTransactions(searchParams?: any);
}

@Injectable()
class FinanceService implements IFinanceService {

    private apiUrl = environment.apiUrl+"/finance";
    private httpOptions = new RequestOptions({ withCredentials: true });

    constructor(private http: Http) {}

    getTransactions(searchParams?: any) {
        let requestOptions = new RequestOptions({ withCredentials: true });
        if(searchParams) {
          requestOptions.params = new URLSearchParams();

          if(searchParams["jamia"])
            requestOptions.params.set("jamia", searchParams["jamia"]);
          if(searchParams["user"])
            requestOptions.params.set("user", searchParams["user"]);
          if(searchParams["type"])
            requestOptions.params.set("type", searchParams["type"]);
          if(searchParams["name"])
            requestOptions.params.set("name", searchParams["name"]);
          if(searchParams["mindate"])
            requestOptions.params.set("mindate", searchParams["mindate"]);
          if(searchParams["maxdate"])
            requestOptions.params.set("maxdate", searchParams["maxdate"]);
          if (searchParams["pageSize"])
            requestOptions.params.set("pageSize", searchParams["pageSize"]);
          if (searchParams["page"])
            requestOptions.params.set("page", searchParams["page"]);
        }
        return this.http.get(this.apiUrl+"/transaction", requestOptions).map((response: Response) => response.json());
    }

    getReport(searchParams?: any) {
        let requestOptions = new RequestOptions({ withCredentials: true });
        if(searchParams) {
          requestOptions.params = new URLSearchParams();

          if(searchParams["jamia"])
            requestOptions.params.set("jamia", searchParams["jamia"]);
          if(searchParams["year"])
            requestOptions.params.set("year", searchParams["year"]);
        }
        return this.http.get(this.apiUrl+"/report", requestOptions).map((response: Response) => response.json());
    }
}

export {IFinanceService, FinanceService}
