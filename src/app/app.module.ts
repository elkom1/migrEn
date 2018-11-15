import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { MyDayPage } from '../pages/myDayPage/myDayPage';
import { NewAttackPage } from '../pages/newAttackPage/newAttackPage';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { Impressum } from '../pages/menu_impressum/menu_impressum';
import { Startseite } from '../pages/menu_startseite/menu_startseite';
import { Reminder } from '../pages/menu_reminder/menu_reminder';
import { EntspannungsUebungen } from '../pages/menu_entspannungsUebungen/menu_entspannungsUebungen';
import { Diagnosen } from '../pages/menu_Diagnosen/menu_Diagnosen';
import { Datenschutz } from '../pages/menu_Datenschutz/menu_Datenschutz';
import { MenuPage } from '../pages/menu/menu';

import { SelectSearchableModule } from 'ionic-select-searchable';

@NgModule({
  declarations: [
    MyApp,
    MyDayPage,
    NewAttackPage,
    Impressum,
    HomePage,
    TabsPage,
    MenuPage,
    Startseite,
    EntspannungsUebungen, 
    Diagnosen, 
    Datenschutz,
    Reminder, 
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SelectSearchableModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MyDayPage,
    NewAttackPage,
    HomePage,
    TabsPage,
    Impressum,
    MenuPage, 
    Startseite,
    EntspannungsUebungen,
    Diagnosen, 
    Datenschutz,
    Reminder, 
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativePageTransitions,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
