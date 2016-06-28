class LoginController {
  static $inject = ['redirectUri'];
  constructor(redirectUri) {
    this.name = 'login';
    this.redirectUri = redirectUri;
  }
  authenticate() {
    window.location.href = `https://api.leopoll.io/spark/connect?redirect=${this.redirectUri}`;
  }
}

export default LoginController;
