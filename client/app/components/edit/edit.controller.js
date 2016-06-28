import angular from 'angular';
import * as _ from 'lodash';

class EditController {
  constructor(contactApi, ipCookie, $timeout, firebaseApi, $state, $stateParams) {
    this.contactApi = contactApi;
    this.ipCookie = ipCookie;
    this.$timeout = $timeout;
    this.firebaseApi = firebaseApi;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.name = 'edit';
    this.isHeaderActive = true;
    this.pendingSearch = null;
    this.cancelSearch = angular.noop;
    this.cachedQuery = '';
    this.lastSearch = '';
    this.sortableOptions = {
      update: (e, ui) => {
        //
      },
      stop: (e, ui) => {
        console.log(this.poll.questions);
      }
    };
    this.allContacts = [];
    this.loadContactList();
    this.filterSelected = true;
  }

  loadContactList() {
    this.contactApi.getList().then((response) => {
      this.allContacts = response.data.map((c, index) => {
        c.name = `${c.displayName} (${c.type})`;
        return c;
      });
    }, (error) => {
      console.log(error);
    });
  }

  querySearch(criteria) {
    this.cachedQuery = criteria;

    if (this.cachedQuery) {
      var results = _.filter(this.allContacts, (contact) => {
        var lowercaseQuery = angular.lowercase(this.cachedQuery);
        var indexPoll = this.poll.sendTo.map((val) => {
          return val.id;
        }).indexOf(contact.id);
        return (angular.lowercase(contact.displayName).indexOf(lowercaseQuery) != -1 && indexPoll == -1);
      });
      if (results.length > 0) {
        return results;
      } else {
        if (!this.pendingSearch || !this.debounceSearch() ) {
          this.cancelSearch();
          this.pendingSearch = new Promise((resolve, reject) => {
            this.cancelSearch = reject;
            this.$timeout(() => {
              this.contactApi.getSearchList(this.cachedQuery).then((response) => {
                results = response.data.map((c, index) => {
                  c.name = `${c.displayName} (${c.type})`;
                  return c;
                }).filter((contact) => {
                  return this.poll.sendTo.map((val) => {
                    return val.id;
                  }).indexOf(contact.id) == -1;
                });
                resolve(results);
              });
              this.refreshDebounce();
            }, Math.random() * 500, true)
          });
        }
        return this.pendingSearch;
      }
    } else {
      return [];
    }
  }

  debounceSearch() {
    var now = new Date().getMilliseconds();
    this.lastSearch = this.lastSearch || now;
    return ((now - this.lastSearch) < 300);
  }

  refreshDebounce() {
    this.lastSearch = 0;
    this.pendingSearch = null;
    this.cancelSearch = angular.noop;
  }

  activateHeader() {
    this.poll.questions.forEach((ele) => {
      ele.active = false;
    })
    this.isHeaderActive = true;
  }

  activateItem(index) {
    this.poll.questions.forEach((ele) => {
      ele.active = false;
    })
    this.isHeaderActive = false;
    this.poll.questions[index].active = true;
  }

  addOption(index) {
    var length = this.poll.questions[index].options.length;
    this.poll.questions[index].options.push({ value: '' });
  }

  removeOption(rootIndex, index) {
    if (this.poll.questions[rootIndex].options.length > 1) {
      this.poll.questions[rootIndex].options.splice(index, 1);
    }
  }

  changeType(index) {
    if (this.poll.questions[index].type == 'multiple_choice' && !this.poll.questions[index].options) {
      this.poll.questions[index].options = [{ value: ''}];
    } else if (this.poll.questions[index].type == 'short_answer') {
      // do nothing
    } else if (this.poll.questions[index].type == 'attachment') {
      // do nothing
    }
  }

  removeQuery(index) {
    this.poll.questions.splice(index, 1);
  }

  addQuery() {
    this.poll.questions.push({
      type: 'multiple_choice',
      active: false,
      question: '',
      options: [{ value: ''}]
    });
    this.activateItem(this.poll.questions.length - 1);
  }

  getPoll() {
    var poll = {
      name: this.poll.name,
      description: this.poll.description,
      updated: new Date().getTime(),
      totalUsers: this.poll.totalUsers,
      completedUsers: this.poll.completedUsers
    };
    poll.questions = this.poll.questions.map((question) => {
      var output = {
        type: question.type,
        question: question.question
      };
      if (question.type == "multiple_choice") {
        output.options = question.options.map((option) => {
          return option.value;
        });
      }
      return output;
    });
    poll.sendTo = this.poll.sendTo.map((contact) => {
      var newContact = {
        id: contact.id,
        type: contact.type,
        displayName: contact.displayName
      };
      if (contact.avatar) {
        newContact.avatar = contact.avatar;
      }
      return newContact;
    });
    return poll;
  }

  updatePoll() {
    var poll = this.getPoll();
    if (this.poll.immediate == 1) {
      poll.sendOn = 0;
    } else {
      poll.sendOn = this.poll.sendOn.getTime();
    }
    poll.status = this.poll.status;
    console.log(poll);
    this.firebaseApi.updatePoll(poll, this.ipCookie('user').id, this.$stateParams.id).then((response) => {
      this.$state.go('home');
    });
  }

  sendPoll() {
    var poll = this.getPoll();
    if (this.poll.immediate == 1) {
      poll.sendOn = 0;
      poll.status = 'send';
    } else {
      poll.sendOn = this.poll.sendOn.getTime();
      poll.status = 'scheduled';
    }
    return Promise.all([
      this.firebaseApi.updatePoll(poll, this.ipCookie('user').id, this.$stateParams.id),
      this.contactApi.sendPoll(this.$stateParams.id)
    ])
    .then((response) => {
      return this.$state.go('detail/'+response.key);
    });
  }
}

EditController.$inject = ['contactApi', 'ipCookie', '$timeout', 'firebaseApi', '$state', '$stateParams'];

export default EditController;
