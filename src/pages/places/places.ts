import {Component} from "@angular/core";
import {AlertController, IonicPage, ModalController, NavController, NavParams, Platform} from "ionic-angular";
import {EditPlace} from "../edit-place/edit-place";
import {PlaceService, PlaceTypeLong} from "../../providers/place-service";
import {NewPlace} from "../new-place/new-place";
import {FilterService} from "../../providers/filter-service";
import {GeolocationService} from "../../providers/geolocation-service";
import {LatLng} from "@ionic-native/google-maps";
import {LocalNotifications} from "@ionic-native/local-notifications";

@IonicPage()
@Component({
    selector: 'page-places',
    templateUrl: 'places.html',
})
export class Places {
    public places: PlaceTypeLong[];
    public filteredPlaces: PlaceTypeLong[];
    private bgPlugin: any;

    /**
     * Navigate to a detail page.
     * @param id place ID to display
     */
    public placeIdSelected(id: number): void {
        this.navCtrl.push(EditPlace, {
            data: {
                id
            }
        });
    }

    /**
     * Show modal for adding new place.
     */
    public newPlace() {
        let modal = this._modalCtrl.create(NewPlace);
        modal.present();
    }

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _modalCtrl: ModalController,
                private _placeService: PlaceService,
                private _alertCtrl: AlertController,
                public _filterService: FilterService,
                public platform: Platform,
                private _geolocationService: GeolocationService,
                private _localNotifications: LocalNotifications
    ) {
        this._placeService.places$
            .subscribe(places => {
                this.places = places;
                this._filterService.filter$
                    .subscribe(filterString => {
                        this.resetFilteredPlaces();
                        if (filterString && filterString.trim() != '') {
                            this.filteredPlaces = this.filteredPlaces.filter((place => {
                                return (place.name.toLowerCase().indexOf(filterString.toLowerCase()) > -1);
                            }))
                        }
                    })
            });

        this.platform.ready().then(this.configureBackgroundGeolocation.bind(this));
    }

    public deletePlace(place: PlaceTypeLong): void {
        let prompt = this._alertCtrl.create({
            title: "Warning!",
            message: `Are you sure you want to delete place "${place.name}" from your places list?`,
            buttons: [
                {
                    text: 'No',
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this._placeService.deletePlace(place.id);
                    }
                }
            ]
        });
        prompt.present();
    }

    private resetFilteredPlaces() {
        this.filteredPlaces = this.places;
    }

    public setFilter(ev: any) {
        this._filterService.setFilter(ev.target.value);
    }

    public configureBackgroundGeolocation() {
        this.bgPlugin = (<any>window).BackgroundGeolocation;

        this.bgPlugin.on('location', this.onLocation.bind(this));

        this.bgPlugin.configure({
            debug: true,
            desiredAccuracy: 0,
            distanceFilter: 10,
            autoSync: true,
        }, (state) => {
            this.bgPlugin.start();
        })
    }

    private onLocation(location, taskId) {
        let radius = 20;
        this.places.forEach(place => {
            let placeLatLng: LatLng = new LatLng(place.coordinates.lat, place.coordinates.lng);
            this._geolocationService.isInRadius(placeLatLng, radius)
                .then(isIn => {
                    if (isIn) {
                        this._localNotifications.schedule({
                            id: place.id,
                            title: `MounTrack notification!`,
                            text: `You are near ${place.name}`,
                        });
                        // maybe register on click event and route it to the place?
                    }
                })
        });
        // maybe move this into resolved promise
        this.bgPlugin.finish(taskId);
    }
}
