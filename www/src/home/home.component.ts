import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {MapsAPILoader} from "@agm/core";
import {} from '@types/googlemaps';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

    constructor() {}

    ngOnInit() {
        // this.getUserGeoLocation();
    }

    private getUserGeoLocation() {
        if ("geolocation" in navigator) {
            let options = {
                enableHighAccuracy: true,
                timeout: 60000,
                maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(position => {
                console.log(position);
            }, error => console.error(error), options);
        }
    }
}
