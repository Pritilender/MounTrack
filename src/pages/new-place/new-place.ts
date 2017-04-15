import {AfterViewInit, Component} from "@angular/core";
import {AlertController, IonicPage, LoadingController, ViewController} from "ionic-angular";
import {PlaceService, PlaceTypeLong} from "../../providers/place-service";
import {Geolocation} from "@ionic-native/geolocation";

@IonicPage()
@Component({
    selector: 'page-new-place',
    templateUrl: 'new-place.html',
})
export class NewPlace implements AfterViewInit {
    public place: PlaceTypeLong = {
        id: '',
        name: '',
        description: '',
        coordinates: {
            lat: 0,
            lng: 0,
        },
    };

    private _geolocation = new Geolocation();

    constructor(private _viewCtrl: ViewController,
                private _placeService: PlaceService,
                private _alertCtrl: AlertController,
                private _loadingCtrl: LoadingController) {
        let loading = this._loadingCtrl.create({
            content: 'Fetching current position...',
        });
        loading.present();
        // options are maybe not needed for real devices, only for emulators
        this._geolocation.getCurrentPosition({
            maximumAge: 0,
            timeout: 5000,
            enableHighAccuracy: true,
        })
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

    public ngAfterViewInit(): void {
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

}
