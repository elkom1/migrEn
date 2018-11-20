import {
  Component
} from '@angular/core';
import {
  NavController
} from 'ionic-angular';

import {
  AlertController
} from 'ionic-angular';

import {
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';


@Component({
  selector: 'page-newAttack',
  templateUrl: 'newAttackPage.html'
})
export class NewAttackPage {

  menge: number = 0;
  symtome: any;
  selectedOther = false;

  group: FormGroup;

  searchQuery: string = '';
  items: string[];
  // _symptomsActive = false;
  // _activeSymptoms = {
  // kopfschmerz: false,
  // xyz: false
  // };
  showList: boolean = false;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController) {
    //Here we can intialize all of the attributes which are selected and altered
    this.group = new FormGroup({
      menge: new FormControl(''),
      symtome: new FormControl('')
    })
    this.initializeItems();
  }

  onChangeSymptoms() {
    console.log("in Change method");
    this.selectedOther = this.symtome.includes("Andere");
  }

  initializeItems() {
    this.items = [
      'Panadol',
      'Dafalgan',
      'Ibuprofen',
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
    console.log("Menge:");
    console.log(this.menge);
    console.log("Symptome:");
    console.log(this.symtome);
    console.log()
    let alert = this.alertCtrl.create({
      message: 'Deine Daten wurden erfasst',
      buttons: ['OK']
    });
    alert.present();
  }

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
