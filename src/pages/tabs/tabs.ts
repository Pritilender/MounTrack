import {Component} from '@angular/core';
import {Places} from '../places/places';
import {Map} from '../map/map';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = Places;
    tab2Root = Map;

    constructor() {

    }
}
