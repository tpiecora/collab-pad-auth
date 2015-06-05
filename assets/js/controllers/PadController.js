/**
 * Created by michaelpiecora on 6/5/15.
 */
angular.module('app')
    .controller('PadController', function (Pads, CurrentUser) {
        $scope.pad = {
            body: '',
            title: '',
            owner: '',
            collaborators: [],
            viewMode: '',
            lastEditor: ''
        };

        function getPad () {
            if (Pads.currentPad) {
                $scope.pad = Pads.currentPad;
            }
        }
        getPad();


    });