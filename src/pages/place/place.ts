import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {PlaceTypeLong} from '../places/places';

@IonicPage()
@Component({
    selector: 'page-place',
    templateUrl: 'place.html',
})
export class Place {
    public place: PlaceTypeLong;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.place = navParams.get('data');
    }

}
