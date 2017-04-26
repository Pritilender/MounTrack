import {Component} from "@angular/core";
import {AlertController, IonicPage, ModalController, NavController, NavParams} from "ionic-angular";
import {EditPlace} from "../edit-place/edit-place";
import {PlaceService, PlaceTypeShort} from "../../providers/place-service";
import {NewPlace} from "../new-place/new-place";
import {FilterService} from "../../providers/filter-service";

@IonicPage()
@Component({
    selector: 'page-places',
    templateUrl: 'places.html',
})
export class Places {
    public places: PlaceTypeShort[];
    public filteredPlaces: PlaceTypeShort[];

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
                public _filterService: FilterService) {
        this._placeService.places$
            .subscribe(places => {
                this.places = places.map(place => ({
                    name: place.name,
                    id: place.id,
                    description: place.description
                }));
                this._filterService.filter$
                    .subscribe(filterString => {
                        debugger;
                        this.resetFilteredPlaces();

                        if (filterString && filterString.trim() != '') {
                            this.filteredPlaces = this.filteredPlaces.filter((place => {
                                return (place.name.toLowerCase().indexOf(filterString.toLowerCase()) > -1);
                            }))
                        }
                    })
            })
    }

    public deletePlace(place: PlaceTypeShort): void {
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
}
