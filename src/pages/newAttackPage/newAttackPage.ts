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
import {
  Symptome
} from '../../models/symptome.model';

@Component({
  selector: 'page-newAttack',
  templateUrl: 'newAttackPage.html'
})
export class NewAttackPage {

  symptomeArray: Symptome[] = [
    {id: 1, name: 'Tränende Augen'},
    {id: 2, name: 'Rötliche Augen'},
    {id: 3, name: 'Nasenlaufen'},
    {id: 4, name: 'Nasenverstopfung'},
    {id: 5, name: 'Flimmersehen'},
    {id: 6, name: 'Lichtempfindlichkeit'},
    {id: 7, name: 'Geruchsempfindlichkeit'},
    {id: 8, name: 'Gefühlsstörung'},
    {id: 9, name: 'Sprachstörung'},
    {id: 10, name: 'Kopfschmerzen'},
    {id: 11, name: 'Andere'}
  ]

  situation: any;
  symptome: string[];
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
    this.symptome = [];
    this.midataService = midataService;
    this.initializeItems();
  }

  onChangeSymptoms() {
  this.selectedOther = this.symptome.find(val => val=="Andere") == null ? false : true
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

  // isSelected() {
  //   if (this.symptomeArray.length > 0) {
  //     this.symptomeArray.forEach((symptom) => {
  //       console.log(symptom)
  //     });
  //     return 1;
  //   }
  //   return 0;
  // }
  presentAlert() {
    this.symptome.forEach(val => {
      console.log("Element in symtomeArr --> " + val);
      
    })

    
    console.log((this.symptome.find(val => val == "Tränende Augen") == null) ? 0 : 1)


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
          system: "http://snomed.info/sct",
          code: "420103007",
          display: "Watery eye"
        }]
      },
      valueQuantity: {
      value: (this.symptome.find(val => val == "Tränende Augen") == null) ? 0 : 1
      }
    })

    entry.addComponent({
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "703630003",
          display: "Red eye"
        }]
      },
      valueQuantity: {
      value: (this.symptome.find(val => val == "Rötliche Augen") == null) ? 0 : 1
      }
    })

    entry.addComponent({
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "703630003",
          display: "Nasal discharge"
        }]
      },
      valueQuantity: {
      value: (this.symptome.find(val => val == "Nasenlaufen") == null) ? 0 : 1
      }
    })
    
    entry.addComponent({
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "119711004",
          display: "Nose closure"
        }]
      },
      valueQuantity: {
      value: (this.symptome.find(val => val == "Nasenverstopfung") == null) ? 0 : 1
      }
    })

    entry.addComponent({
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "73905001",
          display: "Sees flickering lights"
        }]
      },
      valueQuantity: {
      value: (this.symptome.find(val => val == "Flimmersehen") == null) ? 0 : 1
      }
    })

    entry.addComponent({
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "409668002",
          display: "Photophobia"
        }]
      },
      valueQuantity: {
      value: (this.symptome.find(val => val == "Lichtempfindlichkeit") == null) ? 0 : 1
      }
    })

    entry.addComponent({
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "313387002",
          display: "Phonophobia"
        }]
      },
      valueQuantity: {
      value: (this.symptome.find(val => val == "Lärmempfindlichkeit") == null) ? 0 : 1
      }
    })

    entry.addComponent({
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "279079003",
          display: "Dysesthesia"
        }]
      },
      valueQuantity: {
      value: (this.symptome.find(val => val == "Gefühlsstörung") == null) ? 0 : 1
      }
    })

    entry.addComponent({
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "47004009",
          display: "Dysphonia"
        }]
      },
      valueQuantity: {
      value: (this.symptome.find(val => val == "Sprachstörung") == null) ? 0 : 1
      }
    })

    entry.addComponent({
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "25064002",
          display: "Headache"
        }]
      },
      valueQuantity: {
      value: (this.symptome.find(val => val == "Kopfschmerzen") == null) ? 0 : 1
      }
    })

    entry.addComponent({
      code: {
        coding: [{
          system: "",
          code: "",
          display: "Other symptoms"
        }]
      }, //ngModel für andere Symotome muss noch deklariert werden
      valueString: this.symptome.find(val => val == "Andere")
    })

    // entry.addComponent({
    //   code: {
    //     coding: [{
    //       system: "http://snomed.info/sct",
    //       code: "408102007",
    //       display: "Medicament intake quantity"
    //     }]
    //   },
    //   valueDateTime: ""+this.fromDateTime.getDefaultValueDateString
    // })
    
    entry.addComponent({
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "408102007",
          display: "Dose"
        }]
      }, //muss als String gegeben werden gemäss ERM Modell
      valueQuantity: {
        value: this.menge
      }
    })

    entry.addComponent({
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "425401001",
          display: "Pain intensity rating scale (assessment scale)"
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
