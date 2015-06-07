angular.module('app')
  .controller('NavController', ["$scope", "Auth", "CurrentUser", function($scope, Auth, CurrentUser) {
    $scope.isCollapsed = true;
    $scope.auth = Auth;
    $scope.user = CurrentUser.user;

    $scope.logout = function() {
      Auth.logout();
    }
  }]);