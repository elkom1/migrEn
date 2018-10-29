import {
  Component
} from '@angular/core';

import {
  MyDayPage
} from '../myDayPage/myDayPage';
import {
  NewAttackPage
} from '../newAttackPage/newAttackPage';
import {
  HomePage
} from '../home/home';

import {
  NativePageTransitions,
  NativeTransitionOptions
} from '@ionic-native/native-page-transitions';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MyDayPage;
  tab3Root = NewAttackPage;

  loaded: boolean = false;
  tabIndex: number = 0;

  constructor(private nativePageTransitions: NativePageTransitions) {}
  // Create the function for getting animation direction by tab index
  private getAnimationDirection(index): string {
    var currentIndex = this.tabIndex;

    this.tabIndex = index;

    switch (true) {
      case (currentIndex < index):
        return ('left');
      case (currentIndex > index):
        return ('right');
    }
  }
  // Create the function for the animated transition
  public transition(e): void {
    let options: NativeTransitionOptions = {
      direction: this.getAnimationDirection(e.index),
      duration: 250,
      slowdownfactor: -1,
      slidePixels: 0,
      iosdelay: 20,
      androiddelay: 0,
      fixedPixelsTop: 0,
      fixedPixelsBottom: 48
    };

    if (!this.loaded) {
      this.loaded = true;
      return;
    }

    this.nativePageTransitions.slide(options);
  }

}
