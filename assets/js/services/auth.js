angular.module('app')
  .factory('Auth', ["$http", "localStorageService", "AccessLevels", function($http, localStorageService, AccessLevels) {
    return {
      authorize: function(access) {
        if (access === AccessLevels.user) {
          return this.isAuthenticated();
        } else {
          return true;
        }
      },
      isAuthenticated: function() {
        return localStorageService.get('auth_token');
      },
      login: function(credentials) {
        var login = $http.post('/auth/authenticate', credentials);
        login.success(function(result) {
          localStorageService.set('auth_token', JSON.stringify(result));
        });
        return login;
      },
      logout: function() {
        // The backend doesn't care about logouts, delete the token and you're good to go.
        localStorageService.remove('auth_token');
      },
      register: function(formData) {
        localStorageService.remove('auth_token');
        var register = $http.post('/auth/register', formData);
        register.success(function(result) {
          localStorageService.set('auth_token', JSON.stringify(result));
        });
        return register;
      }
    }
  }])
  .factory('AuthInterceptor', ["$q", "$injector", function($q, $injector) {
    var localStorageService = $injector.get('localStorageService');

    return {
      request: function(config) {
        var token;
        if (localStorageService.get('auth_token')) {
          token = angular.fromJson(localStorageService.get('auth_token')).token;
        }
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(response) {
        if (response.status === 401 || response.status === 403) {
          localStorageService.remove('auth_token');
          $injector.get('$state').go('anon.login');
        }
        return $q.reject(response);
      }
    }
  }])
  .config(["$httpProvider", function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  }]);