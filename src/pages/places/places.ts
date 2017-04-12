import {AfterViewInit, Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Place} from '../place/place';
import {PlaceService, PlaceTypeShort} from "../../providers/place-service";

@IonicPage()
@Component({
    selector: 'page-places',
    templateUrl: 'places.html',
})
export class Places implements AfterViewInit {
    public places: PlaceTypeShort[];

    public placeSelected(place: PlaceTypeShort): void {
        // navigate to a detail page
        this.navCtrl.push(Place, {
            data: {
                name: place.name,
                description: place.description,
                coordinates: {
                    lat: 21,
                    lng: 43
                }
            }
        });
    }

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _placeService: PlaceService
    ) {
    }

    ngAfterViewInit() {
        this.places = this._placeService.getShortPlaces();
    }

}
