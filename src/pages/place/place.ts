import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {PlaceTypeLong} from '../places/places';

/**
 * Generated class for the Place page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
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
