import angular from 'angular';
var moment = require('moment');

class HomeController {
  static $inject = ['$state', 'ipCookie', '$scope', '$timeout'];
  constructor($state, ipCookie, $scope, $timeout) {
    this.$state = $state;
    this.ipCookie = ipCookie;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.data = [];
    this.init();
  }

  init() {
    firebase.database().ref().child(`/polls/${this.ipCookie('user').id}`).on('value', (snapshot) => {
      var response = snapshot.val();
      var pollInfo = [];
      for (var key in response) {
        var element = response[key];
        element.id = key;
        pollInfo.push(element);
      }
      this.$timeout(() => {
        this.data = pollInfo;
      });
    });
  }

  momentDate(poll) {
    if (poll.status == 'draft') {
      return `Last edit ${moment(poll.updated).fromNow()}`;
    } else if (poll.status == 'send' || poll.status == 'in-progress') {
      return `Sent ${moment(poll.updated).fromNow()}`;
    } else if (poll.status == 'scheduled') {
      return `Scheduled ${moment(poll.updated).fromNow()}`;
    } else if (poll.status == 'cancelled') {
      return `Ended ${moment(poll.updated).fromNow()}`;
    } else {
      return `Completed ${moment(poll.updated).fromNow()}`;
    }
  }

  completed(poll) {
    return poll.status == 'completed' || poll.status == 'cancelled';
  }

  active(poll) {
    return poll.status == 'send' || poll.status == 'in-progress';
  }

  editable(poll) {
    return poll.status == 'draft' || poll.status == 'scheduled';
  }
}

export default HomeController;
