import { observable } from "mota";

@observable
export class LayoutViewModel {
  navDrawerOpen = false;

  get navDrawerWidth() {
    return this.navDrawerOpen ? 240 : 60;
  }

  openNavDrawer = () => {
    this.navDrawerOpen = true;
  };

  closeNavDrawer = () => {
    this.navDrawerOpen = false;
  };

  toggleNavDrawer = () => {
    this.navDrawerOpen = !this.navDrawerOpen;
  };
}

export const layoutViewModel = new LayoutViewModel();
