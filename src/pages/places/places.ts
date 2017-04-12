import {AfterViewInit, Component, OnDestroy} from "@angular/core";
import {IonicPage, ModalController, NavController, NavParams} from "ionic-angular";
import {EditPlace} from "../edit-place/edit-place";
import {PlaceService, PlaceTypeShort} from "../../providers/place-service";
import {NewPlace} from "../new-place/new-place";

@IonicPage()
@Component({
    selector: 'page-places',
    templateUrl: 'places.html',
})
export class Places {
    public places: PlaceTypeShort[];

    /**
     * Navigate to a detail page.
     * @param id place ID to display
     */
    public placeIdSelected(id: string): void {
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
                private _placeService: PlaceService) {
    }

    ionViewWillEnter() {
        this.places = this._placeService.getShortPlaces();
    }
}
