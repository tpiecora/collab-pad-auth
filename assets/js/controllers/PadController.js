/**
 * Created by michaelpiecora on 6/5/15.
 */
angular.module('app')
    .controller('PadController', function ($scope, $log, Pads, CurrentUser) {
        $scope.pad = {
            id: '',
            body: '',
            title: '',
            owner: '',
            collaborators: [],
            viewMode: '',
            lastEditor: ''
        };
        //console.log(Pads.currentPad);
        function getPad () {
                $scope.pad = Pads.getCurrentPad();
                console.log($scope.pad);

        }
        getPad();

        io.socket.on('pad', function (obj) {
            console.log(obj.data.lastEditor);
            if(obj.data.lastEditor === CurrentUser.user().email) {
                $log.info('received changes made by this user')
            } else if(obj.verb === 'updated' && obj.id === $scope.pad.id) {
                $scope.pad = obj.data;
                $log.info('content updated');
                $scope.$digest();
            }
            //$log.info('got an update', obj);
        });

        $scope.sendPad = function () {
            $scope.pad.lastEditor = CurrentUser.user().email;
            //$log.info($scope.data.content);
            Pads.update($scope.pad);
            //io.socket.post('/pad/modify', $scope.data);
        };
    });