import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {PlaceType} from "./place-service";
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

    private dummyData: PlaceType[] = [
    {
        id: 1,
        name: 'Mladenova kuća',
        description: 'Turbo Rezidencija',
        coordinates: {
            lat: 43.3287605,
            lng: 21.914337,
        },
    },
    {
        id: 2,
        name: 'Zaplanjac',
        description: 'Pljeske bez soje, dece mi moje',
        coordinates: {
            lat: 43.3287456,
            lng: 21.9156871,
        },
    },
    {
        id: 3,
        name: 'Pošta Srbije',
        description: 'Tu šaljemo pakovanja od Grand kafe za nagradnu igru',
        coordinates: {
            lat: 43.3290578,
            lng: 21.9206761,
        },
    },
    {
        id: 4,
        name: 'Tržni centar Merkator',
        description: 'Tu radi moja sestra',
        coordinates: {
            lat: 43.3237447,
            lng: 21.9255496,
        },
    },
    {
        id: 5,
        name: 'OŠ Duško Radović',
        description: 'Tu je Midža mogao ići u školu',
        coordinates: {
            lat: 43.3198303,
            lng: 21.9295193,
        },
    },
    {
        id: 6,
        name: 'Ideja',
        description: 'Sve što nam treba',
        coordinates: {
            lat: 43.3171608,
            lng: 21.9292779,
        },
    },
    {
        id: 7,
        name: 'Miksina kuća',
        description: 'Rezidencija OMM',
        coordinates: {
            lat: 43.317215,
            lng: 21.9317567,
        },
    },
        {
        id: 8,
        name: 'Dva Jarana',
        description: 'Vrh Kafana',
        coordinates: {
            lat: 43.3182727,
            lng: 21.9288223,
        },
    },
    {
        id: 9,
        name: 'Sred mosta',
        description: 'Bilo je dosta',
        coordinates: {
            lat: 43.325301,
            lng: 21.9244237,
        },
    },
    {
        id: 10,
        name: 'Nikole Uzunovića 41',
        description: '',
        coordinates: {
            lat: 43.316538,
            lng: 21.9313587,
        },
    },
    {
        id: 11,
        name: 'Južnomoravske brigade 55',
        description: 'Bilo je dosta',
        coordinates: {
            lat: 43.315504,
            lng: 21.9314338,
        },
    },
    {
        id: 12,
        name: 'Filipa Filipovića 33',
        description: '',
        coordinates: {
            lat: 43.31573,
            lng: 21.9307048,
        },
    },
    {
        id: 13,
        name: 'Vere Blagojević 8',
        description: '',
        coordinates: {
            lat: 43.3166522,
            lng: 21.9311088,
        },
    },
    {
        id: 14,
        name: 'Vere Blagojević 14',
        description: '',
        coordinates: {
            lat: 43.3165285,
            lng: 21.9316524,
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
            // this.loadData();
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
            store.createIndex('imgUrl', 'imgUrl', {unique: false});
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

    public addObject(place: PlaceType): Observable<PlaceType> {
        let subject: Subject<PlaceType> = new Subject();
        let req = this.getObjectStore('readwrite').add(place);
        req.onsuccess = (event: any) => {
            console.log('place added');
            place.id = event.target.result;
            subject.next(place);
            subject.complete();
        };
        req.onerror = (event: any) => {
            console.log('Error during place addition');
            console.log(event);
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

    public getObjects(): Observable<PlaceType[]> {
        console.log('Fetching all objects...');
        let store = this.getObjectStore('readonly');
        let places: BehaviorSubject<PlaceType[]> = new BehaviorSubject([]);

        store.openCursor().onsuccess = (event: any) => {
            let cursor: IDBCursorWithValue = event.target.result;
            if (cursor) {
                let place: PlaceType = cursor.value;
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

    public updateObject(place: PlaceType): Observable<PlaceType> {
        let subject: Subject<PlaceType> = new Subject();

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
