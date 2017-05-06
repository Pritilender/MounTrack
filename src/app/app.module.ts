import {ErrorHandler, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";
import {TabsPage} from "../pages/tabs/tabs";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {About} from "../pages/about/about";
import {Places} from "../pages/places/places";
import {Map} from "../pages/map/map";
import {EditPlace} from "../pages/edit-place/edit-place";
import {PlaceService} from "../providers/place-service";
import {NewPlace} from "../pages/new-place/new-place";
import {GeolocationService} from "../providers/geolocation-service";
import {IndexedDBService} from "../providers/indexed-db-service";
import {CameraService} from "../providers/camera-service";
import {Camera} from "@ionic-native/camera";
import {FilterService} from "../providers/filter-service";
import {LocalNotifications} from "@ionic-native/local-notifications";

@NgModule({
    declarations: [
        MyApp,
        About,
        Map,
        Places,
        TabsPage,
        EditPlace,
        NewPlace,
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        About,
        EditPlace,
        Map,
        Places,
        TabsPage,
        NewPlace,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        },
        PlaceService,
        GeolocationService,
        IndexedDBService,
        CameraService,
        Camera,
        FilterService,
        LocalNotifications,
    ]
})
export class AppModule {
}
