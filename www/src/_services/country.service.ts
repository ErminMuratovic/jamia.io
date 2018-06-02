"use strict";

import {Injectable} from "@angular/core";
import {Countries} from "../_data/countries";

interface ICountryService {
    getCountries();
}

@Injectable()
class CountryService implements ICountryService {

    constructor() {
    }

    getCountries() {
        return new Promise((resolve) => {
            resolve(Countries);
        });
    }
}

export {ICountryService, CountryService}