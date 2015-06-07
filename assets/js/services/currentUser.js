angular.module('app')
  .factory('CurrentUser', ["localStorageService", function(localStorageService) {
    return {
      user: function() {
        if (localStorageService.get('auth_token')) {
          return angular.fromJson(localStorageService.get('auth_token')).user;
        } else {
          return {};
        }
      }
    };
  }]);