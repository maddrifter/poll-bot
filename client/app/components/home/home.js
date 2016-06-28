import angular from 'angular';
import homeComponent from './home.component';

let homeModule = angular.module('home', [])

.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      component: 'home',
      data: {
        requireAuthentication: true
      }
    });
})

.component('home', homeComponent)
  
.name;

export default homeModule;
