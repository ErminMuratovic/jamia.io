import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {environment} from '../_environments/environment';

import 'rxjs/Rx';

interface IUserPreferencesService {
    getLanguage();
}

@Injectable()
class UserPreferencesService implements IUserPreferencesService {
    getLanguage() {

    }
}

export {IUserPreferencesService, UserPreferencesService}
