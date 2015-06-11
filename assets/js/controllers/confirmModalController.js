/**
 * Created by michaelpiecora on 4/21/15.
 */
angular.module('app').controller('ConfirmModalController', function($scope, $element, close, title, message, $timeout) {

    $scope.$on('$stateChangeStart', function() {
        $scope.stateChange();
    });

    $scope.stateChange = function() {
        //  Manually hide the modal using bootstrap.
        $element.modal('hide');
        //  Now close as normal, but give 500ms for bootstrap to animate
        close('', 500);
    };


    $scope.closeModal = function() {
        //  Manually hide the modal using bootstrap.
        $element.modal('hide');
        //  Now close as normal, but give 500ms for bootstrap to animate
        close('Yes', 500);
    };

    $scope.message = message;
    $scope.title = title;
    $scope.myVar = function () {
        $scope.close('Yes');
    };
    $scope.close = function(result) {
        close(result, 500); // close, but give 500ms for bootstrap to animate
    };
    $timeout(function() {
        $scope.isFocused = true;
    },500)
});