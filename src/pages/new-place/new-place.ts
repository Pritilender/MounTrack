import {Component} from "@angular/core";
import {AlertController, IonicPage, LoadingController, ViewController} from "ionic-angular";
import {PlaceService, PlaceTypeLong} from "../../providers/place-service";
import {GeolocationService} from "../../providers/geolocation-service";

@IonicPage()
@Component({
    selector: 'page-new-place',
    templateUrl: 'new-place.html',
})
export class NewPlace {
    public place: PlaceTypeLong = {
        id: 0,
        name: '',
        description: '',
        coordinates: {
            lat: 0,
            lng: 0,
        },
    };

    constructor(private _viewCtrl: ViewController,
                private _placeService: PlaceService,
                private _alertCtrl: AlertController,
                private _loadingCtrl: LoadingController,
                private _geolocationService: GeolocationService) {
        this.locatePlace();
    }

    public save(): void {
        if (this.place.name != '') {
            this._placeService.addNew(this.place);
            this._viewCtrl.dismiss();
        } else {
            this._alertCtrl.create({
                title: 'Error!',
                message: 'You need to specify the name for a place.',
                buttons: ['Ok'],
            }).present();
        }
    }

    public cancel(): void {
        this._viewCtrl.dismiss();
    }

    /**
     * Fetches current coordinates and show spinner while fetching is in progress.
     */
    public locatePlace(): void {
        let loading = this._loadingCtrl.create({
            content: 'Fetching current position...',
        });
        loading.present();

        this._geolocationService.getCurrentPosition()
            .then(position => {
                this.place.coordinates.lat = position.coords.latitude;
                this.place.coordinates.lng = position.coords.longitude;
                loading.dismiss();
            })
            .catch((error: PositionError) => {
                loading.dismiss();
                alert(`Position error: '${error.message}'. Error code: ${error.code}`);
            });
    }

}
