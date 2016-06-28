import template from './navbar.html';
import controller from './navbar.controller';
import './navbar.styl';

let navbarComponent = {
  restrict: 'E',
  bindings: {
  	'pollName': '='
  },
  template,
  controller: ['$state', 'ipCookie', controller]
};

export default navbarComponent;
