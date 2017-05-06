import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";
import {IndexedDBService} from "./indexed-db-service";

export interface PlaceTypeLong {
    id: number;
    name: string;
    description: string;
    imgUrl?: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}

@Injectable()
export class PlaceService {
    private _places: PlaceTypeLong[] = [];
    private _placesSubject: ReplaySubject<PlaceTypeLong[]> = new ReplaySubject(1);
    public places$: Observable<PlaceTypeLong[]> = this._placesSubject.asObservable();

    /**
     *
     * @param id
     * @returns {PlaceTypeLong}
     */
    public getPlaceById(id: number): PlaceTypeLong {
        let place = this._places.find(place => place.id == id);
        if (place) {
            return place;
        } else {
            throw `There is no place with an id ${id}!`;
        }
    }

    /**
     *
     * @param place
     * @returns {string}
     */
    public addNew(place: PlaceTypeLong) {
        this.indexedDB.addObject(place)
            .subscribe(place => {
                this._places.push(place);
                this._placesSubject.next(this._places);
            });
    }

    /**
     *
     * @param place
     */
    public editPlace(place: PlaceTypeLong): void {
        let el = this._places.find(element => element.id == place.id);
        let index = this._places.indexOf(el);

        if (index > -1) {
            this.indexedDB.updateObject(place)
                .subscribe(place => {
                    if (place) {
                        this._places[index] = place;
                        this._placesSubject.next(this._places);
                    }
                });
        } else {
            throw `Place ${place.name} doesn't exist!`;
        }
    }

    /**
     *
     * @param placeId
     */
    public deletePlace(placeId: number): void {
        let el = this._places.find(element => element.id == placeId);
        let index = this._places.indexOf(el);

        if (index > -1) {
            this.indexedDB.deleteObject(placeId)
                .subscribe(status => {
                    if (status) {
                        this._places.splice(index, 1);
                        this._placesSubject.next(this._places);
                    }
                });
        } else {
            throw `Place with id ${placeId} doesn't exist!`;
        }
    }

    constructor(private indexedDB: IndexedDBService) {
        this.indexedDB.dbSubject
            .subscribe(opened => {
                if (opened) {
                    this.indexedDB.getObjects()
                        .subscribe(places => {
                            this._places = places;
                            this._placesSubject.next(this._places);
                        })
                }
            })
    }

}
