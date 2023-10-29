import { observable } from "mota";

@observable
export class LayoutViewModel {
  navDrawerOpen = true;

  get navDrawerWidth() {
    return this.navDrawerOpen ? 240 : 0;
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
