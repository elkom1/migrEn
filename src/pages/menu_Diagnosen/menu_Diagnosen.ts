import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {
  AlertController
} from 'ionic-angular';
import {
  MidataService
} from '../../services/midataService';
import {
  Observation,
  Bundle
} from 'Midata';

@Component({
  selector: 'page-menu_Diagnosen',
  templateUrl: 'menu_Diagnosen.html'
})
export class Diagnosen {

  diagnosen: string; 
  otherDiagnose: string; 

  selectedOther = false;

  private midataService: MidataService;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, midataService: MidataService) {
    this.midataService = midataService;
  }

  onChangeDiagnoses() {
    this.selectedOther = this.diagnosen.match("Andere") ? true : false
    }

  presentAlert() {
    let alert = this.alertCtrl.create({
      message: 'Deine Diagnose wurde gespeichert',
      buttons: ['OK']
    });
    alert.present();
  }
}
