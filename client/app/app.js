import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import 'angular-material-data-table';
import 'angular-ui-sortable';
import 'angular-material-datetimepicker';
import ipCookie from 'angular-cookie';
import 'angular-ui-router/release/stateEvents';

import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';
import FirebaseApi from './fireApiService';
import ContactService from './contactService';

import 'angular-material/angular-material.css';
import 'angular-material-data-table/dist/md-data-table.css';
import 'normalize.css';
import 'angular-material-datetimepicker/css/material-datetimepicker.min.css';


firebase.initializeApp(ENV.firebaseConfig);

angular.module('app', [
    uiRouter,
    Common,
    Components,
    ngMaterial,
    ipCookie,
    'md.data.table',
    'ui.sortable',
    'ngMaterialDatePicker',
    'ui.router.state.events'
  ])
  .config(($locationProvider, $urlRouterProvider) => {
    "ngInject";
    // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
    // #how-to-configure-your-server-to-work-with-html5mode
    $locationProvider.html5Mode(true).hashPrefix('!');

    $urlRouterProvider.otherwise(($injector) => {
      var $state = $injector.get('$state');
      $state.go('home');
    });
  })
  .config(($mdThemingProvider) => {
    "ngInject";

    $mdThemingProvider.definePalette('accentColor', {
      '50': '009688',
      '100': '009688',
      '200': '009688',
      '300': '009688',
      '400': '009688',
      '500': '009688',
      '600': '009688',
      '700': '009688',
      '800': '009688',
      '900': '009688',
      'A100': '009688',
      'A200': '009688',
      'A400': '009688',
      'A700': '009688',
      'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                          // on this palette should be dark or light

      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
       '200', '300', '400', 'A100'],
      'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });

    $mdThemingProvider.theme('default')
    .accentPalette('accentColor');
  })

  .run(['ipCookie', '$rootScope', '$state', (ipCookie, $rootScope, $state) => {
    $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
      if (!toState.data.requireAuthentication) {
        $state.go(toState.name, toParams, { notify: false });
      } else if (ipCookie('user') && toState.data.requireAuthentication) {
        $state.go(toState.name, toParams, { notify: false });
      } else {
        $state.go('login', {}, { notify: false });
      }
    });
  }])

  .factory('firebaseApi', FirebaseApi.fireApiFactory)
  .factory('contactApi', ContactService.contactFactory)

  .component('app', AppComponent)

  .constant('redirectUri', ENV.appURL);
