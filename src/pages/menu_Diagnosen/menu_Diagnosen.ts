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

  date = Date; 
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

    //========================= START JSON FOR THE OBSERVATION "Diagnosis"================================
    let codingStuff2 = {
      coding: [{
        system: 'http://snomed.info/sct',
        code: '418138009',
        display: 'Diagnosis' //muss noch registriert werden
      }]
    }

    let category2 = {
      coding: [{
        system: 'http://hl7.org/fhir/observation-category',
        code: 'survey',
        display: 'Survey'
      }],
    }

    let entry2 = new Observation({
      _dateTime: new Date().toISOString()
    }, codingStuff2, category2);

    if (this.diagnosen != null) {

      if (this.diagnosen.match("Migräne mit Aura")) {
        entry2.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "4473006",
              display: "Migraine with aura"
            }]
          },
        })
      }

      if (this.diagnosen.match("Migräne ohne Aura")) {
        entry2.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "56097005",
              display: "Migraine without aura"
            }]
          },
        })
      }

      if(this.diagnosen.match("Andere")) {
        entry2.addComponent({
          code: {
            coding: [{
              display: "Other diagnosis"
            }]
          },
          valueString: this.otherDiagnose
        })
      }

      if (this.date != null) {
        entry2.addComponent({
          code: {
            coding: [{
              display: "Date of diagnosis"
            }]
          },
          valueDateTime: "" + this.date
        })
      }

      let bundle2 = new Bundle("transaction");
      bundle2.addEntry("POST", entry2.resourceType, entry2);
      this.midataService.save(bundle2);
    }
    //========================= END JSON FOR THE OBSERVATION "Diagnosis"================================

  }
}
