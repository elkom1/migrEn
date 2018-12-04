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
  Bundle,
  MedicationStatement
} from 'Midata';
import {
  BarcodeScanner
} from '@ionic-native/barcode-scanner';
import {
  getLocaleDateTimeFormat,
  getLocaleCurrencySymbol
} from '@angular/common';
import {
  medicationStatus,
  medicationTaken
} from 'Midata/dist/src/resources/MedicationStatement';

@Component({
  selector: 'page-newAttack',
  templateUrl: 'newAttackPage.html'
})
export class NewAttackPage {

  //-------------------------------------START INITIALIZE ITEMS -------------------------------------------------
  situation: string;
  symptome: string[];
  otherSymptom: string;
  painAreal: string;
  painType: string;
  otherPainType: string;
  trigger: string[];
  otherTrigger: string;
  fromDateTime: DateTime;
  untilDateTime: DateTime;
  intensity: number = 0;
  medicament: string;
  menge: number = 0;
  medEffect: string;

  selectedOther = false;
  selectedOther3 = false;
  selectedOther4 = false;
  selectedHeadache = false;

  group: FormGroup;

  searchQuery: string = '';
  items: string[];

  showList: boolean = false;
  private midataService: MidataService;

  encodeText: string = '';
  //-------------------------------------END INITIALIZE ITEMS -------------------------------------------------


  //-------------------------------------START CONSTRUCTOR ----------------------------------------------------
  constructor(public navCtrl: NavController, private alertCtrl: AlertController, midataService: MidataService, private scanner: BarcodeScanner) {
    //Here we can intialize all of the attributes which are selected and altered
    this.group = new FormGroup({
      menge: new FormControl(''),
      symptome: new FormControl(''),
      otherSymptom: new FormControl(''),
      painAreal: new FormControl(''),
      painType: new FormControl(''),
      otherPainType: new FormControl(''),
      trigger: new FormControl(''),
      otherTrigger: new FormControl(''),
      fromDateTime: new FormControl(''),
      untilDateTime: new FormControl(''),
      intensity: new FormControl(''),
      medicament: new FormControl(''),
      medEffect: new FormControl(''),
      situation: new FormControl('')
    })
    this.symptome = [];
    this.trigger = [];

    this.midataService = midataService;
    this.initializeItems();
  }
  //-------------------------------------END CONSTRUCTOR ----------------------------------------------------

  ngAfterViewInit() {
    this.menge = 1;

  }


  //-------------------------------------START ONCHANGE METHODS FOR "OTHER SELECTION"------------------------
  onChangeSymptoms() {
    this.selectedOther = this.symptome.find(val => val == "Andere") == null ? false : true
    this.selectedHeadache = this.symptome.find(value => value == "Kopfschmerzen") == null ? false : true
  }

  onChangePainType() {
    if (this.selectedOther == true || this.selectedOther4 == true) {
      this.selectedOther3 = this.painType.match("Andere") ? true : false
    }
    this.selectedOther3 = this.painType.match("Andere") ? true : false
  }

  onChangeTrigger() {
    if (this.selectedOther == true || this.selectedOther3 == true) {
      this.selectedOther4 = this.trigger.find(val => val == "Andere") == null ? false : true
    }
    this.selectedOther4 = this.trigger.find(val => val == "Andere") == null ? false : true
  }
  //-------------------------------------END ONCHANGE METHODS FOR "OTHER SELECTION"------------------------

  //-------------------------------------START METHODS FOR MEDICATION SEARCH-------------------------------
  initializeItems() {
    this.items = [
      'Dafalgan 1000mg',
      'Dafalgan 500mg',
      'Dafalgan 200mg',
      'Ibuprofen 400mg',
      'Ibuprofen 800mg',
      'Diclofenac 25mg',
      'Diclofenac 50mg'
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
      let scannerAlert = this.alertCtrl.create({
        message: data.text + "<br/>" + "Scan war erfolgreich",
        buttons: ['OK']
      });
      scannerAlert.present();
      (this.medicament == null || this.medicament != null) ? this.medicament = data.text: ""
    }).catch(err => {
      console.log('Error', err);
    });
  }

  addMedicament() {
    let addMedAlert = this.alertCtrl.create({
      message: (this.medicament != null && this.menge >= 1 && this.medEffect != null) ? this.medicament + "<br/>" + "wurde gespeichert" + "<br/>" + "<br/>" + "Du kannst noch weitere Medikamente hinzufügen" : "Du hast noch kein Medikament erfasst",
      buttons: ['OK']
    });
    addMedAlert.present();

    //========================= START JSON FOR THE OBSERVATION "Acute Therapy" (Medication)================================
    let code = {
      coding: [{
        system: 'http://midata.coop	',
        code: 'MedicationStatement',
        display: 'MedicationStatement'
      }]
    }

    let cat = {
      coding: [{
        system: "http://hl7.org/fhir/ValueSet/medication-statement-category",
        code: "patientspecified",
        display: this.medicament
      }],
    }

    let medStatus: medicationStatus = "active";

    let medTaken: medicationTaken = "y";

    let medEntry = new MedicationStatement(new Date(), code, medStatus, cat, {}, medTaken);

    //========================= START JSON ADD MEDICAMENT COMPONENTS===========================================
    //  medEntry.addComponent({
    //   code: {
    //     coding: [{
    //       display: "Medicament name"
    //     }]
    //   }, 
    //   valueString: this.medicament
    //   //valueString: (this.medicament == null) ? "No medicament intake" : this.medicament
    // })

    medEntry.addProperty("dosage", this.menge);
    // medEntry.addComponent({
    //   code: {
    //     coding: [{
    //       system: "http://snomed.info/sct",
    //       code: "408102007",
    //       display: "Dose"
    //     }]
    //   }, //muss als String gegeben werden gemäss ERM Modell
    //   valueQuantity: {
    //     value: this.menge
    //   }
    // })

    medEntry.addProperty("note", (this.medEffect.match("Nein")) ? "None" : (this.medEffect.match("Ja")) ?
      "Good" : (this.medEffect.match("Hat sich verschlimmert")) ?
      "Bad" : " ");
    // medEntry.addComponent({
    //   code: {
    //     coding: [{
    //       display: "Effect of medicine"
    //     }]
    //   }, //muss als String gegeben werden gemäss ERM Modell ??
    //   valueString:  (this.medEffect.match("Nein")) ? "None" : (this.medEffect.match("Ja")) 
    //                 ? "Good" : (this.medEffect.match("Hat sich verschlimmert"))
    //                 ? "Bad" : " " 
    // })
    //========================= END JSON ADD MEDICAMENT COMPONENT===========================================

    //========================= END JSON FOR THE OBSERVATION "ACUTE THERAPY" (MEDICATION)===========================================


    //========================= START JSON PUT MEDICATION COMPONENTS IN BUNDLE2 AND SAVE===========================================
    let bundle2 = new Bundle("transaction");
    bundle2.addEntry("POST", medEntry.resourceType, medEntry);
    this.midataService.save(bundle2);
    //========================= END JSON PUT MEDICATION COMPONENTS IN BUNDLE2 AND SAVE===========================================

    //update the medication fields 
    this.medicament = "";
    this.menge = 1;
    this.medEffect = null;
  }
  //-------------------------------------END METHODS FOR MEDICATION SEARCH-------------------------------


  //-------------------------------- START PERSISTENCE IN MIDATA OF ALL THE INPUT FIELDS---------------------------------------------------------
  presentAlert() {

    let alert = this.alertCtrl.create({
      message: 'Deine Daten wurden erfasst',
      buttons: ['OK']
    });
    alert.present();

    //========================= START JSON FOR THE OBSERVATION "PATIENT CONDITION FINDING"================================
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


    //========================= START JSON ADD SITUATION COMPONENTS===========================================
    entry.addComponent({
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "216299002",
          display: "Attack"
        }]
      },
      valueString: (this.situation.match("unwohlsein")) ? "Feels unwell" : "Migrain attack"
    })
    //========================= END JSON ADD SITUATION COMPONENTS=============================================


    //========================= START JSON ADD SYMPTOM COMPONENTS===========================================
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
          code: "45846002",
          display: "Sensitive to smells"
        }]
      },
      valueQuantity: {
        value: (this.symptome.find(val => val == "Geruchsempfindlichkeit") == null) ? 0 : 1
      }
    })

    entry.addComponent({
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "1985008",
          display: "Vomitus"
        }]
      },
      valueQuantity: {
        value: (this.symptome.find(val => val == "Erbrechen") == null) ? 0 : 1
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
          display: "Other symptoms"
        }]
      },
      valueString: (this.symptome.find(val => val == "Andere") == null) ? "No other symptoms" : this.otherSymptom
    })
    //========================= END JSON ADD SYMPTOM COMPONENTS===========================================


    //========================= START JSON ADD PAIN AREAL COMPONENTS===========================================
    if (this.selectedHeadache == true) {
      entry.addComponent({
        code: {
          coding: [{
            system: "http://snomed.info/sct",
            code: "29624005",
            display: "Right side of head"
          }]
        },
        valueQuantity: {
          value: (this.painAreal.match("Kopf rechtsseitig")) ? 1 : 0
        }
      })

      entry.addComponent({
        code: {
          coding: [{
            system: "http://snomed.info/sct",
            code: "64237003",
            display: "Left side of head"
          }]
        },
        valueQuantity: {
          value: (this.painAreal.match("Kopf linksseitig")) ? 1 : 0
        }
      })

      entry.addComponent({
        code: {
          coding: [{
            system: "http://snomed.info/sct",
            code: "162301005",
            display: "Bilateral headache"
          }]
        },
        valueQuantity: {
          value: (this.painAreal.match("Kopf beidseitig")) ? 1 : 0
        }
      })
    }
    //========================= END JSON ADD PAIN AREAL COMPONENTS===========================================


    //========================= START JSON ADD PAIN TYPE COMPONENTS===========================================
    if (this.selectedHeadache == true) {
      entry.addComponent({
        code: {
          coding: [{
            system: "http://snomed.info/sct",
            code: "162308004",
            display: "Throbbing headache"
          }]
        },
        valueQuantity: {
          value: (this.painType.match("Stechender Schmerz")) ? 1 : 0
        }
      })

      entry.addComponent({
        code: {
          coding: [{
            system: "http://snomed.info/sct",
            code: "83644001",
            display: "Dull pain"
          }]
        },
        valueQuantity: {
          value: (this.painType.match("Dumpfer Schmerz")) ? 1 : 0
        }
      })

      entry.addComponent({
        code: {
          coding: [{
            display: "Other pain type"
          }]
        },
        valueString: (this.painType.match("Andere")) ? this.otherPainType : "No other pain type"
      })
    }
    //========================= END JSON ADD PAIN TYPE COMPONENTS===========================================


    //========================= START JSON ADD TRIGGER COMPONENTS===========================================
    entry.addComponent({
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "276319003",
          display: "Menstruation finding"
        }]
      },
      valueQuantity: {
        value: (this.trigger.find(val => val == "Menstruation") == null) ? 0 : 1
      }
    })

    entry.addComponent({
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "73595000",
          display: "Stress"
        }]
      },
      valueQuantity: {
        value: (this.trigger.find(val => val == "Stress") == null) ? 0 : 1
      }
    })

    entry.addComponent({
      code: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "102894008",
          display: "Relaxed feeling"
        }]
      },
      valueQuantity: {
        value: (this.trigger.find(val => val == "Erholung") == null) ? 0 : 1
      }
    })

    entry.addComponent({
      code: {
        coding: [{
          display: "Other triggers"
        }]
      },
      valueString: (this.trigger.find(val => val == "Andere") == null) ? "No other triggers" : this.otherTrigger
    })
    //========================= END JSON ADD TRIGGER COMPONENTS===========================================


    //========================= START JSON ADD PAIN PERIOD COMPONENTS===========================================
    entry.addComponent({
      code: {
        coding: [{
          display: "Start time of pain"
        }]
      },
      valueDateTime: "" + this.fromDateTime
    })

    entry.addComponent({
      code: {
        coding: [{
          display: "End time of pain"
        }]
      },
      valueDateTime: "" + this.untilDateTime
    })
    //========================= END JSON ADD PAIN PERIOD COMPONENTS===========================================


    //========================= START JSON ADD PAIN INTENSITY SCALE COMPONENT===========================================
    if (this.selectedHeadache == true) {
      entry.addComponent({
        code: {
          coding: [{
            system: "http://snomed.info/sct",
            code: "425401001",
            display: "Pain intensity rating scale"
          }]
        },
        valueQuantity: {
          value: this.intensity
        }
      })
    }
    //========================= END JSON ADD PAIN INTENSITY SCALE COMPONENT===========================================


    //========================= START JSON PUT COMPONENTS IN BUNDLE AND SAVE===========================================
    let bundle = new Bundle("transaction");
    bundle.addEntry("POST", entry.resourceType, entry);
    this.midataService.save(bundle);
    //========================= END JSON PUT COMPONENTS IN BUNDLE AND SAVE===========================================

    //========================= END JSON FOR THE OBSERVATION "PATIENT CONDITION FINDING"================================


    //========================= START JSON FOR THE OBSERVATION "Acute Therapy" (Medication)================================
    let code = {
      coding: [{
        system: 'http://midata.coop	',
        code: 'MedicationStatement',
        display: 'MedicationStatement'
      }]
    }

    let cat = {
      coding: [{
        system: "http://hl7.org/fhir/ValueSet/medication-statement-category",
        code: "patientspecified",
        display: this.medicament
      }],
    }

    let medStatus: medicationStatus = "active";

    let subject = {
      reference: '',
      code: '',
      display: ''
    }

    let medTaken: medicationTaken = "y";

    let medEntry = new MedicationStatement(new Date(), code, medStatus, cat, {}, medTaken);

    //========================= START JSON ADD MEDICAMENT COMPONENTS===========================================
    //  medEntry.addComponent({
    //   code: {
    //     coding: [{
    //       display: "Medicament name"
    //     }]
    //   }, 
    //   valueString: this.medicament
    //   //valueString: (this.medicament == null) ? "No medicament intake" : this.medicament
    // })

    medEntry.addProperty("dosage", this.menge);
    // medEntry.addComponent({
    //   code: {
    //     coding: [{
    //       system: "http://snomed.info/sct",
    //       code: "408102007",
    //       display: "Dose"
    //     }]
    //   }, //muss als String gegeben werden gemäss ERM Modell
    //   valueQuantity: {
    //     value: this.menge
    //   }
    // })

    medEntry.addProperty("note", (this.medEffect.match("Nein")) ? "None" : (this.medEffect.match("Ja")) ?
      "Good" : (this.medEffect.match("Hat sich verschlimmert")) ?
      "Bad" : " ");
    // medEntry.addComponent({
    //   code: {
    //     coding: [{
    //       display: "Effect of medicine"
    //     }]
    //   }, //muss als String gegeben werden gemäss ERM Modell ??
    //   valueString:  (this.medEffect.match("Nein")) ? "None" : (this.medEffect.match("Ja")) 
    //                 ? "Good" : (this.medEffect.match("Hat sich verschlimmert"))
    //                 ? "Bad" : " " 
    // })
    //========================= END JSON ADD MEDICAMENT COMPONENT===========================================

    //========================= END JSON FOR THE OBSERVATION "ACUTE THERAPY" (MEDICATION)===========================================


    //========================= START JSON PUT MEDICATION COMPONENTS IN BUNDLE2 AND SAVE===========================================
    let bundle2 = new Bundle("transaction");
    bundle2.addEntry("POST", medEntry.resourceType, medEntry);
    this.midataService.save(bundle2);
    //========================= END JSON PUT MEDICATION COMPONENTS IN BUNDLE2 AND SAVE===========================================
  }
  //-------------------------------- END PERSISTENCE IN MIDATA OF ALL THE INPUT FIELDS---------------------------------------------------------

}
