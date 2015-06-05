/**
 * Created by michaelpiecora on 6/5/15.
 */
angular.module('app')
    .controller('PadsController', function ($scope, $log, Pads, CurrentUser, $state) {

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


        $scope.deletePad = function (pad) {
            Pads.remove(pad);
            subscribe();
        };

        $scope.newPad = function() {
            console.log(CurrentUser.user());
            Pads.create(
                {
                    body: 'Any changes made to this pad are seen instantly by all collaborators',
                    title: 'Enter a title',
                    owner: CurrentUser.user().email,
                    collaborators: [],
                    viewMode: 'public',
                    lastEditor: CurrentUser.user().email
                }
            )
            $state.go('user.pad');
        };

        io.socket.on('pad', function(obj) {
            if(obj.verb === "destroyed") {
                console.log('someone deleted a pad');
                subscribe();
            }
            console.log('received', obj)
        })

        $scope.openUsersPad = function(pad) {
            console.log(pad);
            Pads.setCurrentPad(pad);
            //$state.go('user.pad');
        }

        $scope.openOthersPad = function(pad) {
            console.log(pad);
            Pads.setCurrentPad(pad);
            //$state.go('user.pad');
        };

        $scope.deletePad = function(pad) {
            Pads.remove(pad);
        };
    });