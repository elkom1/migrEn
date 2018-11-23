import {
  Observation,
  DateTime,
  Bundle,
  Midata,
  VitalSigns
} from "Midata";
//import { effectiveType } from "Midata/dist/src/resources/Observation";
import {
  MidataService
} from "../../services/midataService";


export class AttackJSON {

  private fhir: any;
  private bundle: Bundle;
  private midataService: MidataService

  constructor(public midata: MidataService) {
    let bundle = new Bundle('transaction');
    this.midataService = midata;
  }



  addEntry(system: String, code: String, display: String) {
    let codingStuff = {
      coding: [{
        system: 'http://loingc.org',
        code: '8867-4',
        display: 'Heart Rate'
      }]
    }

    // let obs = new Observation({effectiveDateTime: new Date().toISOString()}, OBSERVATIONSTATUS.preliminary, CATVITALSIGNs, COD_HEARTRATE)

    let entry = new Observation(null, codingStuff, VitalSigns);

    this.midataService.save(entry);

    // this.bundle.addEntry("POST", "Observation", entry);
    this.midataService.save(entry);
  }

  getEntry(): any {
    this.bundle;
  }

};
