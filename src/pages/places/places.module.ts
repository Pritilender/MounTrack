import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {Places} from './places';

@NgModule({
    declarations: [
        Places,
    ],
    imports: [
        IonicModule.forRoot(Places),
    ],
    exports: [
        Places
    ]
})
export class PlacesModule {
}
