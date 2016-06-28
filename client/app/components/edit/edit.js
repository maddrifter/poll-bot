import angular from 'angular';
import uiRouter from 'angular-ui-router';
import editComponent from './edit.component';
import * as _ from 'lodash';

let editModule = angular.module('edit', [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('edit', {
      url: '/edit/:id',
      component: 'edit',
      data: {
        requireAuthentication: true
      },
      resolve: {
        poll: ['firebaseApi', 'ipCookie', '$stateParams', '$state', (firebaseApi, ipCookie, $stateParams, $state) => {
          return firebaseApi.getPollInfo(ipCookie('user').id, $stateParams.id).then((response) => {
            if (response.status == 'send' || response.status == 'in-progress') {
              $state.go('detail', { id: $stateParams.id });
            } else if (response.status == 'completed' || response.status == 'cancelled') {
              $state.go('home');
            }
            response.immediate = response.sendOn? 0 : 1;
            response.sendOn = response.sendOn? new Date(response.sendOn) : new Date();
            response.questions = _.map(response.questions, (question) => {
              question.active = false;
              if (question.options) {
                question.options = _.map(question.options, (option) => {
                  return { value: option };
                });
              }
              return question;
            });
            response.sendTo = _.map(response.sendTo, (contact) => {
              contact.name = `${contact.displayName} (${contact.type})`;
              return contact;
            });
            console.log(response);
            return response;
          });
        }]
      }
    });
})

.component('edit', editComponent)
  
.name;

export default editModule;
