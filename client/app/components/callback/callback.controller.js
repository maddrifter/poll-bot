class CallbackController {
  constructor($stateParams, $http, ipCookie, $state, firebaseApi) {
    this.name = 'callback';

    firebaseApi.login($stateParams.token).then((response) => {
      ipCookie('user', {
        id: response.uid,
        email: response.email,
        name: response.displayName,
        avatar: response.photoURL
      });
      window.location = '/';
    }, (error) => {
      console.log(error);
      $state.go('login');
    });
  }
}

export default CallbackController;
