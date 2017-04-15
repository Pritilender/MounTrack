import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {SQLite, SQLiteDatabaseConfig, SQLiteObject} from "@ionic-native/sqlite";
import {PlaceTypeLong} from "./place-service";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {Platform} from "ionic-angular";

interface DBPlace {
    id: number;
    name: string;
    description: string;
    lat: number;
    lng: number;
}

@Injectable()
export class SqliteService {

    private sqLite: SQLite = new SQLite();
    private db: SQLiteObject;
    public dbSubject: Subject<boolean> = new Subject();

    constructor(private platform: Platform) {
        this.platform.ready()
            .then(_ => {
                let config: SQLiteDatabaseConfig = {
                    name: 'MounTracker.db',
                    location: 'default',
                };
                // this.sqLite.echoTest()
                //     .then(_ => console.log('self test ok'))
                //     .catch(_ => console.log('self test fail'));


                this.sqLite.create(config)
                    .then((db: SQLiteObject) => {
                        this.db = db;
                        this.dbSubject.next(true);

                        this.db.executeSql(
                            'create table if not exists Places (' +
                            'id integer primary key autoincrement,' +
                            'name text unique not null,' +
                            'description text,' +
                            'lat real not null,' +
                            'lng real not null)',
                            [])
                            .then((result) => {
                                console.log('table Places created or updated');
                                // this.db.executeSql('insert into Places (name, description, lat, lng) values (?, ?, ?, ?)',
                                //     ['test' + Date.now().toString(30), 'test desc', 23, 21])
                                //     .then((result) => {
                                //         console.log('inserted');
                                //         //alert('succes!');
                                //     })
                                //     .catch(this.errorHandler);
                            })
                            .catch(this.errorHandler);
                    })
                    .catch(this.errorHandler);
            })
    }

    private errorHandler(error) {
        alert(`SQLite error: ${JSON.stringify(error)}`);
    }

    private transformPlace(place: DBPlace): PlaceTypeLong {
        return {
            id: place.id,
            name: place.name,
            description: place.description,
            coordinates: {
                lat: place.lat,
                lng: place.lng,
            },
        };
    }

    public getPlaces(): Observable<PlaceTypeLong[]> {
        let placesSubject: Subject<PlaceTypeLong[]> = new Subject();
        if (this.db) {
            this.db.executeSql(`select * from Places`, [])
                .then((result: SQLResultSet) => {
                    let places: PlaceTypeLong[] = [];
                    let rowCount = result.rows.length, i;
                    for (i = 0; i < rowCount; i++) {
                        let dbPlace: DBPlace = result.rows.item(i);
                        places.push(this.transformPlace(dbPlace));
                    }
                    placesSubject.next(places);
                    placesSubject.complete();
                })
                .catch(this.errorHandler);
        } else {
            throw `Database doesn't exist`;
        }
        return placesSubject;
    }

    public addPlace(place: PlaceTypeLong): string {
        let id = "";

        return id;
    }

}
