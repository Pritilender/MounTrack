import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {PlaceTypeLong} from "./place-service";
import {Platform} from "ionic-angular";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Subject} from "rxjs/Subject";

@Injectable()
export class IndexedDBService {

    private DB_NAME = 'MounTrack-IndexedDB';
    private DB_VERSION = 1;
    private DB_STORE_NAME = 'places';

    private db: IDBDatabase;
    private indDb: IDBFactory = window.indexedDB;

    private dummyData: PlaceTypeLong[] = [
        {
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
        }
    ];
    public dbSubject: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _platform: Platform) {
        this._platform.ready()
            .then(() => this.openDB());
    }

    private openDB(): void {
        console.log("Opening IndexedDB...");
        let req = this.indDb.open(this.DB_NAME, this.DB_VERSION);
        req.onsuccess = (event: any) => {
            this.db = req.result;
            this.dbSubject.next(true);
            console.log("IndexedDB opened!");
        };
        req.onerror = (event: any) => {
            console.error("IndexedDB error:", JSON.stringify(event.error));
        };

        req.onupgradeneeded = (event: any) => {
            console.log("IndexedDB upgrade needed...");
            let store = event.currentTarget.result.createObjectStore(
                this.DB_STORE_NAME, {keyPath: 'id', autoIncrement: true}
            );

            store.createIndex('name', 'name', {unique: true});
            store.createIndex('description', 'description', {unique: false});
            // store.createIndex('lat', 'lat', {unique: false});
            // store.createIndex('lng', 'lng', {unique: false});
            store.createIndex('img', 'img', {unique: false});
            store.createIndex('coordinates', 'coordinates', {unique: false});
        };
    }

    public loadData() {
        this.getObjectStore('readwrite').transaction.oncomplete = (event) => {
            this.dummyData.forEach(place => this.addObject(place));
        };
    }

    private getObjectStore(mode: string): IDBObjectStore {
        return this.db.transaction(this.DB_STORE_NAME, mode).objectStore(this.DB_STORE_NAME);
    }

    public addObject(place: PlaceTypeLong): Observable<PlaceTypeLong> {
        let subject: Subject<PlaceTypeLong> = new Subject();
        let req = this.getObjectStore('readwrite').add(place);
        req.onsuccess = (event: any) => {
            console.log('place added');
            place.id = event.target.result;
            subject.next(place);
            subject.complete();
        };
        return subject.asObservable();
    }

    public deleteObject(id: number): Observable<boolean> {
        let subject: Subject<boolean> = new Subject();
        let req = this.getObjectStore('readwrite')
            .delete(id);
        req.onsuccess = (event: any) => {
            subject.next(true);
            subject.complete();
        };
        req.onerror = (event) => {
            subject.next(false);
            subject.complete();
        };
        return subject.asObservable();
    }

    public getObjects(): Observable<PlaceTypeLong[]> {
        console.log('Fetching all objects...');
        let store = this.getObjectStore('readonly');
        let places: BehaviorSubject<PlaceTypeLong[]> = new BehaviorSubject([]);

        store.openCursor().onsuccess = (event: any) => {
            let cursor: IDBCursorWithValue = event.target.result;
            if (cursor) {
                let place: PlaceTypeLong = cursor.value;
                places.getValue().push(place);
                cursor.continue();
            } else {
                let placeArray = places.getValue();
                places.next(placeArray);
                places.complete();
                console.log('All objects fetched!');
            }
        };

        return places.asObservable();
    }

    public updateObject(place: PlaceTypeLong): Observable<PlaceTypeLong> {
        let subject: Subject<PlaceTypeLong> = new Subject();

        let req = this.getObjectStore('readwrite').put(place);
        req.onsuccess = (event: any) => {
            subject.next(place);
            subject.complete();
        };
        req.onerror = (event) => {
            subject.next(null);
            subject.complete();
        };
        return subject.asObservable();
    }


}
