/**
 * Created by michaelpiecora on 6/5/15.
 */
angular.module('app')
    .controller('PadsController', function ($scope, $log, Pads, CurrentUser, $timeout, $location) {

        function subscribe() {
            io.socket.get('/pad/subscribe', {id: CurrentUser.user().email}, function(result) {
                $scope.pads = result;
                $scope.$apply();
                console.log(result);
            });
        }
        subscribe();

        Pads.getAll(function (result) {
            $scope.pads = result.data;
            console.log($scope.pads)
        });

        $scope.deletePad = function (pad, i) {
            console.log('delete');
            $scope.pads[0].splice(i, 1);
            Pads.remove(pad);
            //$scope.$apply();
        };

        $scope.newPad = function() {
            Pads.create(
                {
                    body: 'Any changes made to this pad are seen instantly by all collaborators',
                    title: 'Enter a title',
                    owner: CurrentUser.user().email,
                    collaborators: [],
                    viewMode: 'public',
                    lastEditor: CurrentUser.user().email
                }
            );
            $timeout(function() {
                $location.path('/pad');
            },500)
        };

        io.socket.on('pad', function(obj) {
            if(obj.verb === "destroyed") {
                console.log('someone deleted a pad');
                subscribe();
            }
            /*
             if(obj.verb === "updated") {
             console.log('someone this user as a collaborator');
             subscribe();
             }
             */
            console.log('received', obj)
        });

        io.socket.on('addCollaborator', function (obj) {
            console.log(obj);
            var checkIfHasPad = $scope.pads[1].indexOf(obj.id);
            checkIfHasPad === -1 ? $scope.pads[1].push(obj) : console.log('This user already has this pad');
            console.log('server invoked subscribe');
            //subscribe();
        });

        io.socket.on('remCollaborator', function (obj) {
            console.log(obj);
            var checkIfHasPad = $scope.pads[1].indexOf(obj.id);
            checkIfHasPad !== -1 ? $scope.pads[1].splice(checkIfHasPad, 1) : console.log('This user does not have this pad');
            console.log('server invoked subscribe');
            //subscribe();
        });

        $scope.openUsersPad = function(pad) {
            console.log(pad);
            Pads.setCurrentPad(pad);
            //$state.go('user.pad');
        };

        $scope.openOthersPad = function(pad) {
            console.log(pad);
            Pads.setCurrentPad(pad);
            //$state.go('user.pad');
        };

    });