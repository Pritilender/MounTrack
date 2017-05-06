import {Component} from "@angular/core";
import {ActionSheetController, AlertController, IonicPage, LoadingController, ViewController} from "ionic-angular";
import {PlaceService, PlaceType} from "../../providers/place-service";
import {GeolocationService} from "../../providers/geolocation-service";
import {CameraService, CameraSource} from "../../providers/camera-service";

@IonicPage()
@Component({
    selector: 'page-new-place',
    templateUrl: 'new-place.html',
})
export class NewPlace {
    public place: PlaceType = {
        id: Date.now(),
        name: '',
        description: '',
        coordinates: {
            lat: 0,
            lng: 0,
        },
        imgUrl: '',
    };

    constructor(private _viewCtrl: ViewController,
                private _placeService: PlaceService,
                private _alertCtrl: AlertController,
                private _loadingCtrl: LoadingController,
                private _geolocationService: GeolocationService,
                private _cameraService: CameraService,
                private _actionSheetCtrl: ActionSheetController) {
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

    public takePicture() {
        let actionSheet = this._actionSheetCtrl.create({
            title: 'Select image source',
            buttons: [
                {
                    text: 'Camera',
                    handler: () => {
                        this._cameraService.takePicture(CameraSource.CAMERA)
                            .then(imgUrl => this.place.imgUrl = imgUrl)
                            .catch(err => console.log('Camera canceled'));
                    },
                },
                {
                    text: 'Gallery',
                    handler: () => {
                        this._cameraService.takePicture(CameraSource.GALLERY)
                            .then(imgUrl => this.place.imgUrl = imgUrl)
                            .catch(err => console.log('Camera canceled'));
                    },
                },
            ],
        });

        actionSheet.present();
    }

}
