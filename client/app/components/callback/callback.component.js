import template from './callback.html';
import controller from './callback.controller';

let CallbackComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller: ['$stateParams', '$http', 'ipCookie', '$state', 'firebaseApi', controller]
};

export default CallbackComponent;
