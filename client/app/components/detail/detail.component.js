import template from './detail.html';
import controller from './detail.controller';
import './detail.styl';

let detailComponent = {
  restrict: 'E',
  bindings: {
    pollInfo: '<'
  },
  template,
  controller
};

export default detailComponent;