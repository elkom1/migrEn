import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-myDay',
  templateUrl: 'myDayPage.html'
})
export class MyDayPage {

  constructor(public navCtrl: NavController) {
  }

  openHomePage() {
    this.navCtrl.setRoot(MyDayPage); 
  }

}
