import {
  Component
} from '@angular/core';
import {
  NavController
} from 'ionic-angular';

import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-newAttack',
  templateUrl: 'newAttackPage.html'
})
export class NewAttackPage {

  searchQuery: string = '';
  items: string[];
  _symptomsActive = false;
  _activeSymptoms = {
    kopfschmerz: false,
    xyz: false
  };

  constructor(public navCtrl: NavController, private alertCtrl: AlertController) {
    this.initializeItems();

  }

  initializeItems() {
    this.items = [
      'Panadol',
      'Dafalgan',
      'Ibuprofin',
    ];
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  presentAlert() {
  let alert = this.alertCtrl.create({
    message: 'Deine Daten wurden erfasst',
    buttons: ['OK']
  });
  alert.present();
}

  // showStuff() {
  //   this._symptomsActive = !this._symptomsActive;
  // }

  // setSymptom(sType: Symptoms) {
  //   switch (sType) {
  //     case 'Kopfschmerzen':
  //       this._activeSymptoms.kopfschmerz = !this._activeSymptoms.kopfschmerz
  //       break;
  //     default:
  //       break;
  //   }
  // } 
}

// export type Symptoms = "Kopfschmerzen" | "XYZ";
