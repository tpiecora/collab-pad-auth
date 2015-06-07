angular.module('app')
  .controller('RegisterController', ["$scope", "$state", "Auth", function($scope, $state, Auth) {
    $scope.register = function() {
      Auth.register($scope.user).then(function() {
        $state.go('anon.home');
      });
    }
  }]);