angular.module('app')
    .config(function($stateProvider, $urlRouterProvider, AccessLevels) {

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
          .state('user.messages', {
            url: '/messages',
            templateUrl: 'user/messages.html',
            controller: 'MessagesController'
          })
          .state('user.pads', {
              url: '/pads',
              templateUrl: 'user/pads.html',
              controller: 'PadsController'
          })
          .state('user.pad', {
              url: '/pad',
              templateUrl: 'user/pad.html',
              controller: 'PadController',
              resolve: {
                  pad: function(Pads) {
                      return Pads.getCurrentPad();
                  }
              }
          })
      ;

      $urlRouterProvider.otherwise('/');
    });