import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Geolocation, GeolocationOptions, Geoposition} from "@ionic-native/geolocation";

@Injectable()
export class GeolocationService {

    private _geolocation = new Geolocation();
    private _geolocationConfig: GeolocationOptions = {
        maximumAge: 0,
        timeout: 5000,
        enableHighAccuracy: true,
    };

    public getCurrentPosition(): Promise<Geoposition> {
        // options are maybe not needed for real devices, only for emulators
        return this._geolocation.getCurrentPosition(this._geolocationConfig);
    }

}
