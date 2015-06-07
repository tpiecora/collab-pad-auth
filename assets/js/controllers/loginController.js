angular.module('app')
  .controller('LoginController', ["$scope", "$state", "Auth", function($scope, $state, Auth) {
    $scope.errors = [];

    $scope.login = function() {
      $scope.errors = [];
      Auth.login($scope.user).success(function(result) {
        $state.go('user.pads');
      }).error(function(err) {
        $scope.errors.push(err);
      });
    }
  }]);