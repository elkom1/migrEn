import { Component } from '@angular/core';
import { NavController, DateTime } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { NewAttackPage } from '../newAttackPage/newAttackPage';


@Component({
  selector: 'page-myDay',
  templateUrl: 'myDayPage.html'
})
export class MyDayPage {
  testCheckboxOpen = false; 

  group: FormGroup;

  sleepTime: DateTime; 
  awakeTime: DateTime; 
  sleepQuality: number; 
  eatingHabit: any; 
  exercises: any; 
  date: Date; 

  constructor(public navCtrl: NavController, private alertCtrl: AlertController) {
    //Here we can intialize all of the attributes which are selected and altered
    this.group = new FormGroup({
      sleepTime: new FormControl(''),
      awakeTime: new FormControl(''),
      sleepQuality: new FormControl(''),
      eatingHabit: new FormControl(''),
      exercises: new FormControl(''),
      date: new FormControl(''),

    })
  }

  openHomePage() {
    this.navCtrl.setRoot(MyDayPage); 
  }


showCheckbox() {
    console.log("Schlafzeit:");
    console.log(this.sleepTime);
    console.log("aufwachzeit:");
    console.log(this.awakeTime);
    console.log("Schlafqualität:");
    console.log(this.sleepQuality);
    console.log("Essverhalten:");
    console.log(this.eatingHabit);
    console.log("Gemachte Übungen:");
    console.log(this.exercises);
    console.log("Datum");
    console.log(this.date);
    
    
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
        //this.navCtrl.push(NewAttackPage);
        this.testCheckboxOpen = false;
       // this.testCheckboxResult = data;
      }
    });
    alert.present();
  }

}
