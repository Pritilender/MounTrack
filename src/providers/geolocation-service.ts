import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Geolocation, GeolocationOptions, Geoposition} from "@ionic-native/geolocation";
import {LatLng} from "@ionic-native/google-maps";

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

    public isInRadius(place: LatLng, radius: number): Promise<boolean> {
        return new Promise((resolve: Function, reject) => {
            this.getCurrentPosition()
                .then(center => {
                    let centerLatLng = new LatLng(center.coords.latitude, center.coords.longitude);
                    resolve(this.distanceInMeters(place, centerLatLng) <= radius);
                })
                .catch(err => reject(err));
        });
    }

    private degToRad(degree: number): number {
        return degree * Math.PI / 180;
    }

    private distanceInMeters(a: LatLng, b: LatLng): number {
        let earthRadiusM = 6371000;
        let dLat = this.degToRad(b.lat - a.lat);
        let dLng = this.degToRad(b.lng - a.lng);

        let h1 = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLng / 2), 2) * Math.cos(a.lat) * Math.cos(b.lat);
        let h2 = 2 * Math.atan2(Math.sqrt(h1), Math.sqrt(1 - h1));
        return earthRadiusM * h2;
    }

}
