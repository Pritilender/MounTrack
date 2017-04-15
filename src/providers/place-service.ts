import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {SqliteService} from "./sqlite-service";
import {ReplaySubject} from "rxjs/ReplaySubject";

export interface PlaceTypeShort {
    id: number;
    name: string;
    description: string;
}

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
    private _places: PlaceTypeLong[] = [
        /*{
         id: 1,
         name: 'EditPlace A',
         description: 'Simple edit-place',
         coordinates: {
         lat: 21,
         lng: 23,
         },
         },
         {
         id: 2,
         name: 'EditPlace B',
         description: 'Again, simple edit-place',
         coordinates: {
         lat: 21.23,
         lng: 41.23,
         },
         },
         {
         id: 3,
         name: 'A EditPlace with a long name A',
         description: 'My god! Such a long name for a simple edit-place! :O',
         coordinates: {
         lat: 32.2,
         lng: 48.2,
         },
         },
         {
         id: 4,
         name: 'A EditPlace with a very, very long name B',
         description: 'My god! Such a long name for a simple edit-place! :O',
         coordinates: {
         lat: 22,
         lng: 49,
         },
         },*/
    ];
    public _placesSubject: ReplaySubject<PlaceTypeLong[]> = new ReplaySubject(1);

    /**
     *
     * @returns {[{id: string, name: string, description: string},{id: string, name: string, description: string},{id: string, name: string, description: string},{id: string, name: string, description: string},{id: string, name: string, description: string}]}
     */
    public getShortPlaces(): PlaceTypeShort[] {
        return this._places.map(place => ({
            id: place.id,
            name: place.name,
            description: place.description,
        }));
    }

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
    public addNew(place: PlaceTypeLong): number {
        let id = Date.now();
        place.id = id;
        this._places.push(place);
        this._placesSubject.next(this._places);
        return id;
    }

    /**
     *
     * @param place
     */
    public editPlace(place: PlaceTypeLong): void {
        let el = this._places.find(element => element.id == place.id);
        let index = this._places.indexOf(el);

        if (index > -1) {
            this._places[index] = place;
            this._placesSubject.next(this._places);
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
            this._places.splice(index, 1);
            this._placesSubject.next(this._places);
        } else {
            throw `Place with id ${placeId} doesn't exist!`;
        }
    }

    constructor(private _sqliteService: SqliteService) {
        this._sqliteService.dbSubject
            .subscribe(_ => {
                this._sqliteService.getPlaces()
                    .subscribe(places => {
                        this._places = places;
                        this._placesSubject.next(this._places);
                    });
            });
    }

}
