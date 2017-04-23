import {Component, ElementRef, ViewChild} from "@angular/core";
import {IonicPage, NavController, NavParams} from "ionic-angular";

/**
 * Generated class for the About page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-about',
    templateUrl: 'about.html',
})
export class About {
    @ViewChild('logo')
    public logoElement: ElementRef;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.drawLogo();
    }

    private drawLogo() {
        let ctx = this.logoElement.nativeElement.getContext('2d');

        ctx.strokeStyle = '#387ef5';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'miter';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(10, 180);
        ctx.lineTo(90, 20);
        ctx.lineTo(170, 180);
        ctx.stroke();

        ctx.fillStyle = '#387ef5';
        ctx.lineJoin = 'miter';
        ctx.beginPath();
        ctx.moveTo(125, 90);
        ctx.lineTo(100, 70);
        ctx.lineTo(90, 90);
        ctx.lineTo(80, 80);
        ctx.lineTo(55, 90);
        ctx.lineTo(90, 20);
        ctx.stroke();
        ctx.fill();
    }

}
