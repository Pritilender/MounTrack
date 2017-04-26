import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class FilterService {
    private _filter: BehaviorSubject<string> = new BehaviorSubject("");
    public filter$: Observable<string> = this._filter.asObservable();

    public setFilter(filterString: string) {
        this._filter.next(filterString);
    }
}
