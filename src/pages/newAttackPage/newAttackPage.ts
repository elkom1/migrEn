import {
  Component
} from '@angular/core';
import {
  NavController,
  DateTime,
  Form
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
  getLocaleCurrencySymbol,
  getLocaleDateFormat
} from '@angular/common';
import {
  medicationStatus,
  medicationTaken
} from 'Midata/dist/src/resources/MedicationStatement';
import {
  renderDateTime
} from 'ionic-angular/umd/util/datetime-util';
import {
  text
} from '@angular/core/src/render3/instructions';

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
  //-------------------------------------END CONSTRUCTOR ----------------------------------------------------

  ngAfterViewInit() {
    this.menge = 1;
    this.intensity = 2;
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

  chooseMedicament(item) {
    this.medicament = item;
    //hide 
    this.items.splice(item)
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
      message: (this.medicament != null && this.menge >= 1) ? this.medicament + "<br/>" + "wurde gespeichert" + "<br/>" + "<br/>" + "Du kannst noch weitere Medikamente hinzufügen" : "Du hast noch kein Medikament erfasst",
      buttons: ['OK']
    });
    addMedAlert.present();

    //========================= START JSON FOR THE MEDICATION STATEMENT================================
    if (this.medicament != null) {
      let code = {
        coding: [{
          system: 'http://midata.coop	',
          code: 'Medication Name',
          display: this.medicament
        }]
      }

      let cat = {
        coding: [{
          system: "http://hl7.org/fhir/ValueSet/medication-statement-category",
          code: "patientspecified",
          display: "preferred"
        }],
      }

      let medStatus: medicationStatus = "active";

      let medTaken: medicationTaken = "y";

      let medEntry = new MedicationStatement(new Date(), code, medStatus, cat, {}, medTaken);

      if (this.medEffect != null) {
        let dosage = [{
          resourceType: "Dosage",
          doseQuantity: {
            value: this.menge
          },
          text: (this.medEffect.match("Nein")) ? "None" : (this.medEffect.match("Ja")) ?
            "Good" : (this.medEffect.match("Hat sich verschlimmert")) ?
            "Bad" : ""
        }]
        medEntry.addProperty("dosage", dosage);
      }

      if (this.medEffect == null) {
        let dosage = [{
          resourceType: "Dosage",
          doseQuantity: {
            value: this.menge
          }
        }]
        medEntry.addProperty("dosage", dosage);
      }

      let bundle2 = new Bundle("transaction");
      bundle2.addEntry("POST", medEntry.resourceType, medEntry);
      this.midataService.save(bundle2);

      //update the medication fields 
      this.medicament = null;
      this.menge = 1;
      this.medEffect = null;
    }
  }
  //-------------------------------------END METHODS FOR MEDICATION SEARCH-------------------------------


  //-------------------------------- START PERSISTENCE IN MIDATA OF ALL THE INPUT FIELDS---------------------------------------------------------
  presentAlert() {

    let alert = this.alertCtrl.create({
      message: 'Deine Daten wurden erfasst',
      buttons: ['OK']
    });
    alert.present();

    // //========================= START JSON ADD SITUATION COMPONENTS===========================================
    if (this.situation != null) {
      let coding1 = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '418138009',
          display: 'General finding of observation of patient' //General finding of observation of patient .. muss registriert werden
        }]
      }

      let category1 = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      }

      let entry1 = new Observation({
        _dateTime: new Date().toISOString()
      }, coding1, category1);

      entry1.addComponent({
        code: {
          coding: [{
            system: "http://snomed.info/sct",
            code: "216299002",
            display: "Attack"
          }]
        },
        valueString: (this.situation.match("unwohlsein")) ? "No" : "yes"
      })

      let bundle1 = new Bundle("transaction");
      bundle1.addEntry("POST", entry1.resourceType, entry1);
      this.midataService.save(bundle1);
    }
    //========================= END JSON ADD SITUATION COMPONENTS=============================================


    //========================= START JSON FOR THE OBSERVATION "Headache Charachter"================================
    if (this.symptome.find(val => val == "Kopfschmerzen") != null) {

      let codingStuff = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '418138009',
          display: 'Headache Character' //Headache Character registrieren auf MIDATA 
        }]
      }

      let category = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      }

      let entry = new Observation({
        _dateTime: new Date().toISOString()
      }, codingStuff, category);

      if (this.painAreal != null) {
        if (this.painAreal.match("Kopf rechtsseitig")) {
          entry.addComponent({
            code: {
              coding: [{
                system: "http://snomed.info/sct",
                code: "29624005",
                display: "Right side of head"
              }]
            },
          })
        }

        if (this.painAreal.match("Kopf linksseitig")) {
          entry.addComponent({
            code: {
              coding: [{
                system: "http://snomed.info/sct",
                code: "64237003",
                display: "Left side of head"
              }]
            },
          })
        }

        if (this.painAreal.match("Kopf beidseitig")) {
          entry.addComponent({
            code: {
              coding: [{
                system: "http://snomed.info/sct",
                code: "162301005",
                display: "Bilateral headache"
              }]
            },
          })
        }
      }

      if (this.painType != null) {
        if (this.painType.match("Starker Schmerz")) {
          entry.addComponent({
            code: {
              coding: [{
                system: "http://snomed.info/sct",
                code: "162307009",
                display: "Aching headache"
              }]
            },
          })
        }

        if (this.painType.match("Stechender Schmerz")) {
          entry.addComponent({
            code: {
              coding: [{
                system: "http://snomed.info/sct",
                code: "162308004",
                display: "Throbbing headache"
              }]
            },
          })
        }

        if (this.painType.match("Dumpfer Schmerz")) {
          entry.addComponent({
            code: {
              coding: [{
                system: "http://snomed.info/sct",
                code: "162309007",
                display: "Shooting headache"
              }]
            },
          })
        }

        if (this.painType.match("Andere")) {
          entry.addComponent({
            code: {
              coding: [{
                display: "Other pain type"
              }]
            },
            valueString: this.otherPainType
          })
        }
      }

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

      let bundle = new Bundle("transaction");
      bundle.addEntry("POST", entry.resourceType, entry);
      this.midataService.save(bundle);
    }
    //========================= END JSON FOR THE OBSERVATION "Headache Character"================================


    //========================= START JSON FOR THE OBSERVATION ""Clinical finding present""================================
    if (this.symptome.find(val => val == "Tränende Augen") != null || this.symptome.find(val => val == "Rötliche Augen") != null || this.symptome.find(val => val == "Nasenlaufen") != null || this.symptome.find(val => val == "Nasenverstopfung") != null || this.symptome.find(val => val == "Übelkeit") != null) {

      let codingStuff4 = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '418138009',
          display: 'Clinical finding present' //"Clinical finding present" .. registrieren noch 
        }]
      }

      let category4 = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      }

      let entry4 = new Observation({
        _dateTime: new Date().toISOString()
      }, codingStuff4, category4);

      if (this.symptome.find(val => val == "Tränende Augen") != null) {
        entry4.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "420103007",
              display: "Watery eye"
            }]
          },
        })
      }

      if (this.symptome.find(val => val == "Rötliche Augen") != null) {
        entry4.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "703630003",
              display: "Red eye"
            }]
          },
        })
      }

      if (this.symptome.find(val => val == "Nasenlaufen") != null) {
        entry4.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "703630003",
              display: "Nasal discharge"
            }]
          },
        })
      }

      if (this.symptome.find(val => val == "Nasenverstopfung") != null) {
        entry4.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "119711004",
              display: "Nose closure"
            }]
          },
        })
      }

      if (this.symptome.find(val => val == "Übelkeit") != null) {
        entry4.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "162057007",
              display: "Nausea"
            }]
          },
        })
      }

      if (this.symptome.find(val => val == "Erbrechen") != null) {
        entry4.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "422400008",
              display: "Vomiting"
            }]
          },
        })
      }

      let bundle4 = new Bundle("transaction");
      bundle4.addEntry("POST", entry4.resourceType, entry4);
      this.midataService.save(bundle4);
    }
    //========================= END JSON FOR THE OBSERVATION "Clinical finding present"================================


    //========================= START JSON FOR THE OBSERVATION ""Visual function""================================
    if (this.symptome.find(val => val == "Flimmersehen") != null) {

      let codingStuff5 = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '418138009',
          display: 'Visual function' //"Visual function .. registrieren noch 
        }]
      }

      let category5 = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      }

      let entry5 = new Observation({
        _dateTime: new Date().toISOString()
      }, codingStuff5, category5);

      entry5.addComponent({
        code: {
          coding: [{
            system: "http://snomed.info/sct",
            code: "73905001",
            display: "Sees flickering lights"
          }]
        },
      })

      let bundle5 = new Bundle("transaction");
      bundle5.addEntry("POST", entry5.resourceType, entry5);
      this.midataService.save(bundle5);
    }
    //========================= END JSON FOR THE OBSERVATION ""Visual function""================================


    //========================= START JSON FOR THE OBSERVATION ""General reaction to light""================================
    if (this.symptome.find(val => val == "Lichtempfindlichkeit") != null) {

      let codingStuff6 = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '418138009',
          display: 'General reaction to light' //"General reaction to light .. registrieren noch 
        }]
      }

      let category6 = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      }

      let entry6 = new Observation({
        _dateTime: new Date().toISOString()
      }, codingStuff6, category6);

      entry6.addComponent({
        code: {
          coding: [{
            system: "http://snomed.info/sct",
            code: "409668002",
            display: "Photophobia"
          }]
        },
      })

      let bundle6 = new Bundle("transaction");
      bundle6.addEntry("POST", entry6.resourceType, entry6);
      this.midataService.save(bundle6);
    }
    //========================= END JSON FOR THE OBSERVATION ""General reaction to light""================================


    //========================= START JSON FOR THE OBSERVATION ""Emotion""================================
    if (this.symptome.find(val => val == "Lärmempfindlichkeit") != null || this.symptome.find(val => val == "Erholung") != null) {

      let codingStuff7 = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '418138009',
          display: 'Emotion' //"Emotion .. registrieren noch 
        }]
      }

      let category7 = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      }

      let entry7 = new Observation({
        _dateTime: new Date().toISOString()
      }, codingStuff7, category7);

      if (this.symptome.find(val => val == "Lärmempfindlichkeit") != null) {
        entry7.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "313387002",
              display: "Phonophobia"
            }]
          },
        })
      }

      if (this.symptome.find(val => val == "Erholung") != null) {
        entry7.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "102894008",
              display: "Feeling calm"
            }]
          },
        })
      }

      let bundle7 = new Bundle("transaction");
      bundle7.addEntry("POST", entry7.resourceType, entry7);
      this.midataService.save(bundle7);
    }
    //========================= END JSON FOR THE OBSERVATION ""Emotion""================================


    //========================= START JSON FOR THE OBSERVATION ""Touch sensation""================================
    if (this.symptome.find(val => val == "Gefühlsstörung") != null) {

      let codingStuff8 = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '418138009',
          display: 'Touch sensation' //"Touch sensation .. registrieren noch 
        }]
      }

      let category8 = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      }

      let entry8 = new Observation({
        _dateTime: new Date().toISOString()
      }, codingStuff8, category8);

      entry8.addComponent({
        code: {
          coding: [{
            system: "http://snomed.info/sct",
            code: "130984007",
            display: "Tactile alteration"
          }]
        },
      })

      let bundle8 = new Bundle("transaction");
      bundle8.addEntry("POST", entry8.resourceType, entry8);
      this.midataService.save(bundle8);
    }
    //========================= END JSON FOR THE OBSERVATION ""Touch sensation""================================


    //========================= START JSON FOR THE OBSERVATION ""Speech observable""================================
    if (this.symptome.find(val => val == "Sprachstörung") != null) {

      let codingStuff9 = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '418138009',
          display: 'Speech observable' //"Speech observable .. registrieren noch 
        }]
      }

      let category9 = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      }

      let entry9 = new Observation({
        _dateTime: new Date().toISOString()
      }, codingStuff9, category9);

      entry9.addComponent({
        code: {
          coding: [{
            system: "http://snomed.info/sct",
            code: "29164008",
            display: "Speech impairment"
          }]
        },
      })

      let bundle9 = new Bundle("transaction");
      bundle9.addEntry("POST", entry9.resourceType, entry9);
      this.midataService.save(bundle9);
    }
    //========================= END JSON FOR THE OBSERVATION ""Speech observable""================================


    //========================= START JSON FOR THE OBSERVATION ""Sense of smell""================================
    if (this.symptome.find(val => val == "Geruchsempfindlichkeit") != null) {

      let codingStuff10 = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '418138009',
          display: 'Sense of smell' //"Sense of smell .. registrieren noch 
        }]
      }

      let category10 = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      }

      let entry10 = new Observation({
        _dateTime: new Date().toISOString()
      }, codingStuff10, category10);

      entry10.addComponent({
        code: {
          coding: [{
            system: "http://snomed.info/sct",
            code: "45846002",
            display: "Sensitive to smells"
          }]
        },
      })

      let bundle10 = new Bundle("transaction");
      bundle10.addEntry("POST", entry10.resourceType, entry10);
      this.midataService.save(bundle10);
    }
    //========================= END JSON FOR THE OBSERVATION ""Sense of smell""================================

    //========================= START JSON FOR THE OBSERVATION ""Mental state, behavior""================================
    if (this.symptome.find(val => val == "Stress") != null || this.symptome.find(val => val == "Leseschwäche") != null) {

      let codingStuff11 = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '418138009',
          display: 'Mental state, behavior' //"Mental state, behavior .. registrieren noch 
        }]
      }

      let category11 = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      }

      let entry11 = new Observation({
        _dateTime: new Date().toISOString()
      }, codingStuff11, category11);

      if (this.symptome.find(val => val == "Stress") != null) {
        entry11.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "73595000",
              display: "Stress"
            }]
          },
        })
      }

      if (this.symptome.find(val => val == "Leseschwäche") != null) {
        entry11.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "309253009",
              display: "Difficulty reading"
            }]
          },
        })
      }

      let bundle11 = new Bundle("transaction");
      bundle11.addEntry("POST", entry11.resourceType, entry11);
      this.midataService.save(bundle11);
    }
    //========================= END JSON FOR THE OBSERVATION ""Mental state, behavior""================================

    //========================= START JSON FOR THE OBSERVATION ""Female reproductive function""================================
    if (this.symptome.find(val => val == "Menstruation") != null) {

      let codingStuff12 = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '418138009',
          display: 'Female reproductive function' //"Female reproductive function .. registrieren noch 
        }]
      }

      let category12 = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      }

      let entry12 = new Observation({
        _dateTime: new Date().toISOString()
      }, codingStuff12, category12);

      entry12.addComponent({
        code: {
          coding: [{
            system: "http://snomed.info/sct",
            code: "276319003",
            display: "Menstruation finding"
          }]
        },
      })


      let bundle12 = new Bundle("transaction");
      bundle12.addEntry("POST", entry12.resourceType, entry12);
      this.midataService.save(bundle12);
    }
    //========================= END JSON FOR THE OBSERVATION ""Female reproductive function""================================

    //========================= START JSON FOR THE OBSERVATION ""Other Symptoms""================================
    if (this.symptome.find(val => val == "Andere") != null) {

      let codingStuff13 = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '418138009',
          display: 'Other Symptoms'
        }]
      }

      let category13 = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      }

      let entry13 = new Observation({
        _dateTime: new Date().toISOString()
      }, codingStuff13, category13);

      entry13.addComponent({
        code: {
          coding: [{
            display: "Other symptoms"
          }]
        },
        valueString: (this.otherSymptom == null) ? "No other symptoms" : this.otherSymptom
      })

      let bundle13 = new Bundle("transaction");
      bundle13.addEntry("POST", entry13.resourceType, entry13);
      this.midataService.save(bundle13);
    }
    //========================= END JSON FOR THE OBSERVATION ""Other Symptoms""================================

    //========================= START JSON ADD PAIN PERIOD COMPONENTS===========================================
    let coding3 = {
      coding: [{
        system: 'http://midata.coop',
        code: 'user-observation',
        display: 'User Observation'
      }]
    }

    let category3 = {
      coding: [{
        system: 'http://hl7.org/fhir/observation-category',
        code: 'survey',
        display: 'Survey'
      }],
    }

    let entry3 = new Observation({
      _dateTime: new Date().toISOString()
    }, coding3, category3);

    entry3.addComponent({
      code: {
        coding: [{
          display: "Start time of pain"
        }]
      },
      valueDateTime: "" + this.fromDateTime
    })

    entry3.addComponent({
      code: {
        coding: [{
          display: "End time of pain"
        }]
      },
      valueDateTime: "" + this.untilDateTime
    })

    let bundle3 = new Bundle("transaction");
    bundle3.addEntry("POST", entry3.resourceType, entry3);
    this.midataService.save(bundle3);
    //========================= END JSON ADD PAIN PERIOD COMPONENTS===========================================


    //========================= START JSON FOR THE MEDICATION STATEMENT================================
    if (this.medicament != null) {
      let code = {
        coding: [{
          system: 'http://midata.coop	',
          code: 'Medication Name',
          display: this.medicament
        }]
      }

      let cat = {
        coding: [{
          system: "http://hl7.org/fhir/ValueSet/medication-statement-category",
          code: "patientspecified",
          display: "preferred"
        }],
      }

      let medStatus: medicationStatus = "active";

      let medTaken: medicationTaken = "y";

      let medEntry = new MedicationStatement(new Date(), code, medStatus, cat, {}, medTaken);

      if (this.medEffect != null) {
        let dosage = [{
          resourceType: "Dosage",
          doseQuantity: {
            value: this.menge
          },
          text: (this.medEffect.match("Nein")) ? "None" : (this.medEffect.match("Ja")) ?
            "Good" : (this.medEffect.match("Hat sich verschlimmert")) ?
            "Bad" : ""
        }]
        medEntry.addProperty("dosage", dosage);
      }

      if (this.medEffect == null) {
        let dosage = [{
          resourceType: "Dosage",
          doseQuantity: {
            value: this.menge
          }
        }]
        medEntry.addProperty("dosage", dosage);
      }

      let bundle2 = new Bundle("transaction");
      bundle2.addEntry("POST", medEntry.resourceType, medEntry);
      this.midataService.save(bundle2);
      //========================= END JSON PUT MEDICATION COMPONENTS IN BUNDLE2 AND SAVE===========================================

      //update the input fields 
      this.situation = null;
      this.symptome = null;
      this.fromDateTime = null;
      this.untilDateTime = null;
      this.medicament = null;
      this.menge = 1;
      this.medEffect = null;
    }
  }
  //-------------------------------- END PERSISTENCE IN MIDATA OF ALL THE INPUT FIELDS---------------------------------------------------------

}
