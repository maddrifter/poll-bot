import angular from 'angular';
import callbackComponent from './callback.component';

let callbackModule = angular.module('callback', [])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('callback', {
      url: '/callback?token',
      component: 'callback',
      data: {
        requireAuthentication: false
      }
    });
})

.component('callback', callbackComponent)

.name;

export default callbackModule;
