import {NgModule} from "@angular/core";
import {NewPlace} from "./new-place";

@NgModule({
    declarations: [
        NewPlace,
    ],
    exports: [
        NewPlace
    ]
})
export class NewPlaceModule {
}
