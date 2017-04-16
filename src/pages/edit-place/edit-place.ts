import {Component} from "@angular/core";
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from "ionic-angular";
import {PlaceService, PlaceTypeLong} from "../../providers/place-service";
import * as deepCopy from "lodash.clonedeep";
import {GeolocationService} from "../../providers/geolocation-service";

@IonicPage()
@Component({
    selector: 'page-place',
    templateUrl: 'edit-place.html',
})
export class EditPlace {
    public place: PlaceTypeLong;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _placeService: PlaceService,
                private _alertCtrl: AlertController,
                private _loadingCtrl: LoadingController,
                private _geolocationService: GeolocationService
    ) {
        let id: number = navParams.get('data')['id'];
        // deep copy place to avoid changing the original element because of ngModel
        this.place = deepCopy(_placeService.getPlaceById(id));
    }

    public updatePlace(): void {
        if (this.place.name != '') {
            this._placeService.editPlace(this.place);
            this.navCtrl.pop();
        } else {
            this._alertCtrl.create({
                title: 'Error!',
                message: 'You need to specify the name for a place.',
                buttons: ['Ok'],
            }).present();
        }
    }

    public cancel(): void {
        this.navCtrl.pop();
    }

    public deletePlace(): void {
        let prompt = this._alertCtrl.create({
            title: "Warning!",
            message: `Are you sure you want to delete place "${this.place.name}" from your places list?`,
            buttons: [
                {
                    text: 'No',
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this._placeService.deletePlace(this.place.id);
                        this.navCtrl.pop();
                    }
                }
            ]
        });
        prompt.present();
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
