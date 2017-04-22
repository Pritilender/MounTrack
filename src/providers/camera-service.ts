import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Camera, CameraOptions} from "@ionic-native/camera";

@Injectable()
export class CameraService {
    private camera: Camera = new Camera();
    private options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.PNG,
    };

    public takePicture(): Promise<string> {
        return this.camera.getPicture(this.options);
    }
}
