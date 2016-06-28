import template from './edit.html';
import controller from './edit.controller';
import './edit.styl';

let editComponent = {
  restrict: 'E',
  bindings: {
    poll: '<'
  },
  template,
  controller
};

export default editComponent;
