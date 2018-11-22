import {
  Component
} from '@angular/core';
import {
  NavController,
  DateTime
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

  situation: any;
  symptome: any;
  painAreal: any;
  painType: any;
  trigger: any;
  fromDateTime: DateTime;
  untilDateTime: DateTime;
  intensity: number = 0;
  medicament: String = "";
  menge: number = 0;
  medEffect: any;

  selectedOther = false;
  selectedOther2 = false;
  selectedOther3 = false;
  selectedOther4 = false;

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
      symptome: new FormControl(''),
      painAreal: new FormControl(''),
      painType: new FormControl(''),
      trigger: new FormControl(''),
      fromDateTime: new FormControl(''),
      untilDateTime: new FormControl(''),
      intensity: new FormControl(''),
      medicament: new FormControl(''),
      medEffect: new FormControl(''),
      situation: new FormControl('')
    })
    this.initializeItems();

  }

  onChangeSymptoms() {
    console.log("in Change method");
    this.selectedOther = this.symptome.includes("Andere");
  }
  onChangePainAreal() {
    console.log("in Change method");
    if (this.selectedOther == true || this.selectedOther3 == true || this.selectedOther4 == true) {
      this.selectedOther2 = this.painAreal.includes("Andere");
    }
    this.selectedOther2 = this.painAreal.includes("Andere");
  }
  onChangePainType() {
    console.log("in Change method");
    if (this.selectedOther == true || this.selectedOther2 == true || this.selectedOther4 == true) {
      this.selectedOther3 = this.painAreal.includes("Andere");
    }
    this.selectedOther3 = this.painType.includes("Andere");
  }
  onChangeTrigger() {
    console.log("in Change method");
    if (this.selectedOther == true || this.selectedOther2 == true || this.selectedOther3 == true) {
      this.selectedOther4 = this.painAreal.includes("Andere");
    }
    this.selectedOther4 = this.trigger.includes("Andere");
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
    console.log("Situation der Erfassung:");
    console.log(this.situation);
    console.log("Symptome:");
    console.log(this.symptome);
    console.log("Schmerzareal:");
    console.log(this.painAreal);
    console.log("Schmerzart:");
    console.log(this.painType);
    console.log("Auslöser:");
    console.log(this.trigger);
    console.log("Dauer von:");
    console.log(this.fromDateTime);
    console.log("Dauer bis:");
    console.log(this.untilDateTime);
    console.log("stärke des Schmerzes:");
    console.log(this.intensity);
    console.log("eingenommenes Medikament");
    console.log(this.medicament);
    console.log("Menge:");
    console.log(this.menge);
    console.log("Hat es gewirkt?");
    console.log(this.medEffect);

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
