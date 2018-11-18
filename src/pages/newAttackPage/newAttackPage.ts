import {
  Component
} from '@angular/core';
import {
  NavController
} from 'ionic-angular';

import { AlertController } from 'ionic-angular';
import { SelectSearchableModule } from 'ionic-select-searchable';


class Port {
    public id: number;
    public name: string;
}

@Component({
  selector: 'page-newAttack',
  templateUrl: 'newAttackPage.html'
})
export class NewAttackPage {

  searchQuery: string = '';
  items: string[];
  // _symptomsActive = false;
  // _activeSymptoms = {
  // kopfschmerz: false,
  // xyz: false
  // };
  showList: boolean = false;

   ports: Port[];
    port: Port;
  

  constructor(public navCtrl: NavController, private alertCtrl: AlertController) {
    this.initializeItems();
    this.ports = [
            { id: 1, name: 'Tokai' },
            { id: 2, name: 'Vladivostok' },
            { id: 3, name: 'Navlakhi' }
        ];

  }

  initializeItems() {
    this.items = [
      'Panadol',
      'Dafalgan',
      'Ibuprofin',
    ];
  }

  // getItems(ev: any) {
  //   // Reset items back to all of the items
  //   this.initializeItems();

  //   // set val to the value of the searchbar
  //   const val = ev.target.value;

  //   // if the value is an empty string don't filter the items
  //   if (val && val.trim() != '') {
  //     this.items = this.items.filter((item) => {
  //       return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     })
  //   }
  // }

   getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      
      // Filter the items
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      
      // Show the results
      this.showList = true;
    } else {
      
      // hide the results when the query is empty
      this.showList = false;
    }
  }

  presentAlert() {
  let alert = this.alertCtrl.create({
    message: 'Deine Daten wurden erfasst',
    buttons: ['OK']
  });
  alert.present();
}


// portChange(event: {
//         component: SelectSearchableComponent,
//         value: any 
//     }); 

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


// export type Symptoms = "Kopfschmerzen" | "XYZ";
