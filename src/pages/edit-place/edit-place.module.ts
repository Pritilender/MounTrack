import {NgModule} from "@angular/core";
import {IonicModule} from "ionic-angular";
import {EditPlace} from "./edit-place";

@NgModule({
    declarations: [
        EditPlace,
    ],
    imports: [
        IonicModule.forRoot(EditPlace),
    ],
    exports: [
        EditPlace
    ]
})
export class PlaceModule {
}
