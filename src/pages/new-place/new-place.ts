import {Component} from "@angular/core";
import {AlertController, IonicPage, ViewController} from "ionic-angular";
import {PlaceService, PlaceTypeLong} from "../../providers/place-service";

@IonicPage()
@Component({
    selector: 'page-new-place',
    templateUrl: 'new-place.html',
})
export class NewPlace {
    public place: PlaceTypeLong = {
        id: '',
        name: '',
        description: '',
        coordinates: {
            lat: 0,
            lng: 0,
        },
    };

    constructor(private _viewCtrl: ViewController,
                private _placeService: PlaceService,
                private _alertCtrl: AlertController,) {
    }

    public save(): void {
        if (this.place.name != '') {
            let id = this._placeService.addNew(this.place);
            this._viewCtrl.dismiss({
                name: this.place.name,
                description: this.place.description,
                id,
            });
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
