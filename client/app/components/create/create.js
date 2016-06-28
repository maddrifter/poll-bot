import angular from 'angular';
import uiRouter from 'angular-ui-router';
import createComponent from './create.component';

let createModule = angular.module('create', [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('create', {
      url: '/create',
      component: 'create',
      data: {
        requireAuthentication: true
      }
    });
})

.component('create', createComponent)
  
.name;

export default createModule;
