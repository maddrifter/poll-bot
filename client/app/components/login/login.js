import angular from 'angular';
import loginComponent from './login.component';

let loginModule = angular.module('login', [])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('login', {
      url: '/login',
      component: 'login',
      data: {
        requireAuthentication: false
      }
    });
})

.component('login', loginComponent)

.name;

export default loginModule;