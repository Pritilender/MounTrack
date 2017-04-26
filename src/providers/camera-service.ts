import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {Camera, CameraOptions} from "@ionic-native/camera";

export enum CameraSource {
    CAMERA,
    GALLERY,
}

@Injectable()
export class CameraService {
    constructor(private _camera: Camera) {
    }

    public takePicture(source: number): Promise<string> {
        let options: CameraOptions = {
            quality: 100,
            destinationType: this._camera.DestinationType.DATA_URL,
            encodingType: this._camera.EncodingType.PNG,
            sourceType: (source == CameraSource.CAMERA) ?
                this._camera.PictureSourceType.CAMERA : this._camera.PictureSourceType.PHOTOLIBRARY,
        };

        return new Promise((resolve, reject) => {
            this._camera.getPicture(options)
                .then(image => {
                    resolve(`data:image/jpeg;base64,${image}`);
                })
                .catch(err => reject(err));
        })
    }

}
