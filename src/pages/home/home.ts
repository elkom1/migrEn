import {
  Component
} from '@angular/core';
import {
  NavController
} from 'ionic-angular';
import { Tutorial } from './../menu_tutorial/menu_tutorial';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  }
  openHomePage() {
    this.navCtrl.setRoot(HomePage); 
  }

goTutorial(){
    this.navCtrl.push(Tutorial);
        this.navCtrl.setRoot(Tutorial); 

  }
}