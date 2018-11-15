import { Impressum } from './../menu_impressum/menu_impressum';
import { Startseite } from './../menu_startseite/menu_startseite';
import { EntspannungsUebungen } from './../menu_entspannungsUebungen/menu_entspannungsUebungen';
import { Diagnosen } from './../menu_Diagnosen/menu_Diagnosen';
import { Datenschutz } from './../menu_Datenschutz/menu_Datenschutz';
import { Reminder } from './../menu_reminder/menu_reminder'
import { TabsPage } from './../tabs/tabs';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav } from 'ionic-angular';
 
export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}
 
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  // Basic root for our content view
  rootPage = TabsPage;
 
  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;
 
  pages: PageInterface[] = [
    { title: 'Startseite', pageName: 'Startseite', tabComponent: TabsPage, icon: 'home' },
    { title: 'Entspannungsübungen', pageName: 'EntspannungsUebungen', tabComponent: EntspannungsUebungen, icon: 'rose' },
    { title: 'Meine Diagnosen', pageName: 'Diagnosen', tabComponent: Diagnosen, icon: 'medkit' },
    { title: 'Reminder', pageName: 'Reminder', tabComponent: Reminder, icon: 'alarm' },
    { title: 'Datenschutzerklärung', pageName: 'Datenschutz', tabComponent: Datenschutz, icon: 'lock' },
    { title: 'Impressum', pageName: 'Impressum', tabComponent: Impressum, icon: 'contacts' },
  ];
 
  constructor(public navCtrl: NavController) { }
 
  openPage(page: PageInterface) {
    let params = {};
 
    // The index is equal to the order of our tabs inside tabs.ts
    if (page.index) {
      params = { tabIndex: page.index };      
    }
 
    // The active child nav is our Tabs Navigation
    if (this.nav.getActiveChildNav() && page.index != undefined) {
      this.nav.getActiveChildNav().select(page.index);
    } else {
      // Tabs are not active, so reset the root page 
      // In this case: moving to or from SpecialPage
     this.nav.setRoot(page.tabComponent, params);
    }
  }
 
  isActive(page: PageInterface) {
    // Again the Tabs Navigation
    let childNav = this.nav.getActiveChildNav();
 
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }
 
    // Fallback needed when there is no active childnav (tabs not active)
    if (this.nav.getActive() && this.nav.getActive().name === page.pageName) {
      return 'primary';
    }
    return;
  }
 
}