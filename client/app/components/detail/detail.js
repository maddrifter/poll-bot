import angular from 'angular';
import uiRouter from 'angular-ui-router';
import detailComponent from './detail.component';

import * as _ from 'lodash';

let detailModule = angular.module('detail', [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";

  $stateProvider
    .state('detail', {
      url: '/detail/:id',
      component: 'detail',
      data: {
        requireAuthentication: true
      },
      resolve: {
        pollInfo: ['firebaseApi', 'ipCookie', '$stateParams', '$state', (firebaseApi, ipCookie, $stateParams, $state) => {
          return firebaseApi.getPollInfo(ipCookie('user').id, $stateParams.id).then((pollInfo) => {
            if (pollInfo.status == 'draft' || pollInfo.status == 'scheduled') {
              this.$state.go('edit', { id: $stateParams.id });
              return;
            }

            pollInfo.sendTo = _.map(pollInfo.sendTo, (contact) => {
              contact.name = `${contact.displayName} (${contact.type})`;
              return contact;
            });
            pollInfo.sendOnString = `Sent on ${moment(pollInfo.sendOn).format('MMM Do YYYY, hh:mm')}`;

            return pollInfo;
          });
        }]
      }
    });
})

.component('detail', detailComponent)

.name;

export default detailModule;
