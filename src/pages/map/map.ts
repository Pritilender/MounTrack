import {AfterViewInit, Component} from "@angular/core";
import {IonicPage, NavController, NavParams, Platform} from "ionic-angular";
import {
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapsMapTypeId,
    LatLng,
    Marker,
    MarkerOptions
} from "@ionic-native/google-maps";
import {GeolocationService} from "../../providers/geolocation-service";
import {PlaceService} from "../../providers/place-service";
import {FilterService} from "../../providers/filter-service";

@IonicPage()
@Component({
    selector: 'page-map',
    templateUrl: 'map.html',
})
export class Map implements AfterViewInit {
    // GoogleMap instance
    private _map: GoogleMap;
    private markers: Marker[];
    public filterString: string;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _platform: Platform,
                private _geolocationService: GeolocationService,
                private _placeService: PlaceService,
                public _filterService: FilterService) {
        this.filterString = navParams.get("data");
        this.markers = [];
    }

    ngAfterViewInit() {
        // check if platform is ready and init map
        // due to Ionic behavior, page is loaded only once in app's lifetime, so all of this is called just once
        this._platform.ready()
            .then(_ => this.loadMap())
            .catch(_ => alert('Map not loaded because there is a platform error'));
    }

    /**
     * Setups map with some default options
     * @param center Camera's center
     */
    private setMapOptions(center: LatLng): void {
        let mapOptions: any = {
            'mapType': GoogleMapsMapTypeId.TERAIN,
            'controls': {
                'compass': true,
                'myLocationButton': true,
                'zoom': true,
            },
            'gestures': {
                'scroll': true,
                'tilt': true,
                'rotate': true,
                'zoom': true,
            },
            'camera': {
                'latLng': center,
                'zoom': 15,
            },
        };

        this._map.setOptions(mapOptions);
    }

    /**
     * Subscribe to PlaceService and display markers for all places.
     */
    private loadMarkers(): void {
        this._placeService.places$
            .subscribe(places => {
                places.forEach(place => {
                    let position: LatLng = new LatLng(place.coordinates.lat, place.coordinates.lng);
                    let title = place.name;

                    let marker: MarkerOptions = {
                        position,
                        title,
                        markerClick: (marker) => {
                            marker.showInfoWindow();
                        }
                    };
                    this._map.addMarker(marker)
                        .then(marker => this.markers.push(marker));
                })
            });
        this._filterService.filter$
            .subscribe(filterString => {
                debugger;

                if (filterString && filterString.trim() != '') {
                    this.markers.forEach(marker => {
                        marker.setVisible(marker.getTitle().toLowerCase().indexOf(filterString.toLowerCase()) > -1);
                    })
                }
            })

    }

    /**
     * Reads current location and displays a map centered at it with markers for every place.
     */
    private loadMap(): void {
        this._geolocationService.getCurrentPosition()
            .then(position => {
                let center = new LatLng(position.coords.latitude, position.coords.longitude);
                this._map = new GoogleMap('map');

                this._map.one(GoogleMapsEvent.MAP_READY)
                    .then(_ => {
                        // this happens only once, so we are safe from subscribing too many times
                        console.log('Map is ready');
                        this.setMapOptions(center);
                        this.loadMarkers();
                    });
            })
            .catch(err => alert(`Location error: ${JSON.stringify(err)}`));
    }

    public setFilter(ev: any) {
        this._filterService.setFilter(ev.target.value);
    }

}
