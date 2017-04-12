import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {PlaceService, PlaceTypeLong} from "../../providers/place-service";

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
    ) {
        let id: string = navParams.get('data')['id'];
        this.place = _placeService.getPlaceById(id);
    }

}
