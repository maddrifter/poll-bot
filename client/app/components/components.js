import angular from 'angular';
import Home from './home/home';
import Create from './create/create';
import Login from './login/login';
import Detail from './detail/detail';
import Edit from './edit/edit';
import Callback from './callback/callback';

let componentModule = angular.module('app.components', [
  Home,
  Create,
  Login,
  Detail,
  Edit,
  Callback
])
  
.name;

export default componentModule;
