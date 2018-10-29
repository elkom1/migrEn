import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';

@Component({
  selector: 'page-myDay',
  templateUrl: 'myDayPage.html'
})
export class MyDayPage {


  constructor(public navCtrl: NavController) {
  }

  openHomePage():void{

  }


  openMenu():void{
    console.log("Allah akbar");
  };

}
