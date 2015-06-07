angular.module('app')
    .config(["$stateProvider", "$urlRouterProvider", "AccessLevels", function($stateProvider, $urlRouterProvider, AccessLevels) {

      $stateProvider
          .state('anon', {
            abstract: true,
            template: '<ui-view/>',
            data: {
              access: AccessLevels.anon
            }
          })
          .state('anon.home', {
            url: '/',
            templateUrl: 'home.html'
          })
          .state('anon.login', {
            url: '/login',
            templateUrl: 'auth/login.html',
            controller: 'LoginController'
          })
          .state('anon.register', {
            url: '/register',
            templateUrl: 'auth/register.html',
            controller: 'RegisterController'
          });

      $stateProvider
          .state('user', {
            abstract: true,
            template: '<ui-view/>',
            data: {
              access: AccessLevels.user
            }
          })
          .state('user.pads', {
              url: '/pads',
              templateUrl: 'user/pads.html',
              controller: 'PadsController'
          })
          .state('user.pad', {
              url: '/pad?id',
              templateUrl: 'user/pad.html',
              controller: 'PadController',
          })
      ;

      $urlRouterProvider.otherwise('/');
    }]);