import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Place} from '../place/place';

interface PlaceTypeShort {
    name: string;
    description: string;
}

export interface PlaceTypeLong {
    name: string;
    description: string;
    imgUrl?: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}

@IonicPage()
@Component({
    selector: 'page-places',
    templateUrl: 'places.html',
})
export class Places {
    public placeSource: PlaceTypeShort[] = [
        {name: 'Place A', description: 'Simple place'},
        {name: 'Place B', description: 'Again, simple place'},
        {name: 'Place C', description: 'Wow, so simple place'},
        {name: 'Place D', description: 'Who would guess we would have such a simple place'},
        {name: 'Place E', description: 'My god! A simple place! :O'},
        {name: 'Place F', description: 'My god! A simple place #2! :O'},
        {name: 'Place G', description: 'My god! A simple place #3?! You sure about that number? :O'},
        {name: 'A Place with a long name A', description: 'My god! Such a long name for a simple place! :O'},
        {name: 'A Place with a very, very long name B', description: 'My god! Such a long name for a simple place! :O'},
    ];

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

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Places');
    }

}
