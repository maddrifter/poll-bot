class NavbarController {
  constructor($state, ipCookie) {
    this.name = 'navbar';
    this.$state = $state;
    this.ipCookie = ipCookie;
    this.user = ipCookie('user');
  }

  openMenu($mdOpenMenu, ev) {
    $mdOpenMenu(ev);
  }

  signOut() {
    this.ipCookie.remove('user');
    this.$state.go('login');
  }
}

export default NavbarController;
