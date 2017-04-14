import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";

export interface PlaceTypeShort {
    id: string;
    name: string;
    description: string;
}

export interface PlaceTypeLong {
    id: string;
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
        {
            id: '1',
            name: 'EditPlace A',
            description: 'Simple edit-place',
            coordinates: {
                lat: 21,
                lng: 23,
            },
        },
        {
            id: '2',
            name: 'EditPlace B',
            description: 'Again, simple edit-place',
            coordinates: {
                lat: 21.23,
                lng: 41.23,
            },
        },
        {
            id: '3',
            name: 'A EditPlace with a long name A',
            description: 'My god! Such a long name for a simple edit-place! :O',
            coordinates: {
                lat: 32.2,
                lng: 48.2,
            },
        },
        {
            id: '4',
            name: 'A EditPlace with a very, very long name B',
            description: 'My god! Such a long name for a simple edit-place! :O',
            coordinates: {
                lat: 22,
                lng: 49,
            },
        },
    ];

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
    public getPlaceById(id: string): PlaceTypeLong {
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
    public addNew(place: PlaceTypeLong): string {
        let id = Date.now().toString(32);
        place.id = id;
        this._places.push(place);
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
        } else {
            throw `Place ${place.name} doesn't exist!`;
        }
    }

    /**
     *
     * @param placeId
     */
    public deletePlace(placeId: string): void {
        let el = this._places.find(element => element.id == placeId);
        let index = this._places.indexOf(el);

        if (index > -1) {
            this._places.splice(index, 1);
        } else {
            throw `Place with id ${placeId} doesn't exist!`;
        }
    }

}
