import {
  Component
} from '@angular/core';
import {
  NavController,
  DateTime,
  Checkbox,
  Tab,
  TabButton,
  TabHighlight
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
  NewAttackPage
} from '../newAttackPage/newAttackPage';
import {
  HomePage
} from '../home/home';
import {
  TabsPage
} from '../tabs/tabs';
import {
  MenuPage
} from '../menu/menu';


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

  tabsPage: TabsPage; 

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
    alert.setTitle('Hattest du sonstige Beschwerden?');

    alert.addInput({
      type: 'radio',
      label: 'Nein',
      value: 'value1',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Ja, möchte ich noch eintragen',
      value: 'value2'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data:', data);
        if (data == "value2") {
          this.navCtrl.push(NewAttackPage)
          //this.tabsPage.getAnimationDirection(2)
        
        }
        else this.navCtrl.push(HomePage)
      }
    });
    alert.present();
  }

}
