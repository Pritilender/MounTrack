import {Component} from "@angular/core";
import {AlertController, IonicPage, NavController, NavParams} from "ionic-angular";
import {PlaceService, PlaceTypeLong} from "../../providers/place-service";
import * as deepCopy from "lodash.clonedeep";

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
                private _alertCtrl: AlertController) {
        let id: string = navParams.get('data')['id'];
        // deep copy place to avoid changing the original element because of ngModel
        this.place = deepCopy(_placeService.getPlaceById(id));
    }

    public updatePlace(): void {
        if (this.place.name != '') {
            this._placeService.editPlace(this.place);
            this.navCtrl.pop();
        } else {
            this._alertCtrl.create({
                title: 'Error!',
                message: 'You need to specify the name for a place.',
                buttons: ['Ok'],
            }).present();
        }
    }

    public cancel(): void {
        this.navCtrl.pop();
    }

    public deletePlace(): void {
        let prompt = this._alertCtrl.create({
            title: "Warning!",
            message: `Are you sure you want to delete place "${this.place.name}" from your places list?`,
            buttons: [
                {
                    text: 'No',
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this._placeService.deletePlace(this.place.id);
                        this.navCtrl.pop();
                    }
                }
            ]
        });
        prompt.present();
    }

}
