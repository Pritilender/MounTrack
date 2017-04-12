import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

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
            name: 'Place A',
            description: 'Simple place',
            coordinates: {
                lat: 21,
                lng: 23,
            },
        },
        {
            id: '2',
            name: 'Place B',
            description: 'Again, simple place',
            coordinates: {
                lat: 21.23,
                lng: 41.23,
            },
        },
        {
            id: '3',
            name: 'A Place with a long name A',
            description: 'My god! Such a long name for a simple place! :O',
            coordinates: {
                lat: 32.2,
                lng: 48.2,
            },
        },
        {
            id: '4',
            name: 'A Place with a very, very long name B',
            description: 'My god! Such a long name for a simple place! :O',
            coordinates: {
                lat: 22,
                lng: 49,
            },
        },
    ];

    public getShortPlaces(): PlaceTypeShort[] {
        return this._places.map(place => ({
            id: place.id,
            name: place.name,
            description: place.description,
        }));
    }

    public addNew(place: PlaceTypeLong): void {
        this._places.push(place);
    }

    public editPlace(place: PlaceTypeLong): void {
        let el = this._places.find(element => element.id == place.id);
        let index = this._places.indexOf(el);

        if (index > -1) {
            this._places[index] = place;
        } else {
            throw `Place ${place.name} doesn't exist!`;
        }
    }

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
