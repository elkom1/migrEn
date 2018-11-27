import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MenuPage } from '../../pages/menu/menu';
import { MidataService } from '../../services/midataService';
import {NativeStorage} from '@ionic-native/native-storage';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  constructor(
      public navCtrl: NavController,
      private loadingCtrl: LoadingController,
      private inAppBrowser: InAppBrowser,
      private midataService: MidataService,
      private platform: Platform) {
  }

  register(){
    this.inAppBrowser.create('https://test.midata.coop/#/portal/registration');
  }

  visitMidata(){
    this.inAppBrowser.create('https://midata.coop');
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      console.log("LOGIN PAGE", "view init, try to open session now...")
      this.midataService.openSession().then(success => {
      console.log("LOGIN PAGE", "was open session successfull?", success)
      if (success) {
        this.navCtrl.setRoot(MenuPage)
      }
      else {
        console.warn('bii baa buu wubba lubba dubb dubb');
      }
    });
    });
  }

  login() {

    let loading = this.loadingCtrl.create({
      content: 'Please wait...' // TODO: Translate
    });

    loading.present().catch();

    this.midataService.authenticate()
      .then((success: boolean) => {        
      return this.navCtrl.setRoot(MenuPage)
    })
      .then(() => {
      loading.dismiss().catch();
    })
      .catch((error) => {
      console.log(error);
      console.log(this.midataService.getNetworkState());
      loading.dismiss().catch();
    })

    //   return this.midataService.syncMidataRecordsToLocalStorage(1000); // TODO: Delegate to MidataService
  }
}
