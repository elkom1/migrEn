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
import {
  MidataService
} from '../../services/midataService';
import {
  Observation,
  Bundle
} from 'Midata';
import {
  BarcodeScanner
} from '@ionic-native/barcode-scanner';



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

  showList: boolean = false;
  private midataService: MidataService;

  encodeText: string = '';


  constructor(public navCtrl: NavController, private alertCtrl: AlertController, midataService: MidataService, private scanner: BarcodeScanner) {
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
    this.midataService = midataService;
    this.initializeItems();
  }

  onChangeSymptoms() {
    this.selectedOther = this.symptome.includes("Andere");
  }
  onChangePainAreal() {
    if (this.selectedOther == true || this.selectedOther3 == true || this.selectedOther4 == true) {
      this.selectedOther2 = this.painAreal.includes("Andere");
    }
    this.selectedOther2 = this.painAreal.includes("Andere");
  }
  onChangePainType() {
    if (this.selectedOther == true || this.selectedOther2 == true || this.selectedOther4 == true) {
      this.selectedOther3 = this.painAreal.includes("Andere");
    }
    this.selectedOther3 = this.painType.includes("Andere");
  }
  onChangeTrigger() {
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

  scan() {
    this.scanner.scan().then((data) => {
      console.log('Barcode data:', data);
    }).catch(err => {
      console.log('Error', err);
    }); 
  }

  presentAlert() {
    console.log("Ohran u Musab");
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

    let codingStuff = {
      coding: [{
        system: 'http://snomed.info/sct',
        code: '418138009',
        display: 'Patient condition finding'
      }]
    }

    let category = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      },
      effectivePeriod: {
        start: DateTime;
        end: DateTime;
      }

    let entry = new Observation({
      _dateTime: new Date().toISOString()
    }, codingStuff, category);

    entry.addComponent({
      code: {
        coding: [{
          "system": "http://snomed.info/sct",
          "code": "420103007",
          "display": "Watery eye"
        }]
      },
      valueString: this.symptome[0]
    })
    
    entry.addComponent({
      code: {
        coding: [{
          "system": "http://snomed.info/sct",
          "code": "408102007",
          "display": "Medicament intake quantity"
        }]
      },
      valueQuantity: {
        value: this.menge
      }
    })

    entry.addComponent({
      code: {
        coding: [{
          "system": "http://snomed.info/sct",
          "code": "425401001",
          "display": "Pain intensity rating scale (assessment scale)"
        }]
      },
      valueQuantity: {
        value: this.intensity
      }
    })

    let bundle = new Bundle("transaction");
    bundle.addEntry("POST", entry.resourceType, entry);
    this.midataService.save(bundle);

  }

}
