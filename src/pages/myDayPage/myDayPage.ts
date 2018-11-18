import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-myDay',
  templateUrl: 'myDayPage.html'
})
export class MyDayPage {
  testCheckboxOpen = false; 

  constructor(public navCtrl: NavController, private alertCtrl: AlertController) {
  }

  openHomePage() {
    this.navCtrl.setRoot(MyDayPage); 
  }


showCheckbox() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Hattest du heute irgendwelche Beschwerden? Falls ja, trage Sie bitte noch ein');

    alert.addInput({
      type: 'radio',
      label: 'Keine Beschwerden',
      value: 'value1',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Möchte ich noch eintragen',
      value: 'value2'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data:', data);
        this.testCheckboxOpen = false;
       // this.testCheckboxResult = data;
      }
    });
    alert.present();
  }

}
