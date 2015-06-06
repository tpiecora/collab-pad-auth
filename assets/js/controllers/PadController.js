/**
 * Created by michaelpiecora on 6/5/15.
 */
angular.module('app')
    .controller('PadController', function ($scope, $timeout, $log, Pads, CurrentUser, localStorageService) {
        /*
         $scope.pad = {
         id: '',
         body: '',
         title: '',
         owner: '',
         collaborators: [],
         viewMode: '',
         lastEditor: ''
         };
         */
        //console.log(Pads.currentPad);

        $timeout(function() {
            $scope.pad = localStorageService.get('currentPad');
            console.log($scope.pad);
        },500);

        function getPad () {
            if (Pads.getCurrentPad()) {
                console.log('got current pad', Pads.getCurrentPad());

            }
            //$scope.pad = pad;

        }
//getPad();

        $scope.isOwner = function(owner) {
            return CurrentUser.user().email === owner
        };

// Pad Updates Handler
        io.socket.on('pad', function (obj) {
            //console.log(obj.data.lastEditor);
            // Check if the updates received are from the current user and ignore them if they are
            if(obj.verb === 'updated' && obj.data.lastEditor === CurrentUser.user().email) {
                $log.info('received changes made by this user');
                // update the pad with any changes made by other collaborators
            } else if(obj.verb === 'updated' && obj.id === $scope.pad.id) {
                $scope.pad = obj.data;
                $log.info('content updated');
                $scope.$digest();
            }
            //$log.info('got an update', obj);
        });

// If Deleted While Collaborating Handler
        io.socket.on('pad', function(obj) {
            if(obj.verb === 'destroyed' && $scope.pad.id === obj.id) {
                // TODO: Add modal that allows user to discard the deleted pad or create a copy of their own
                console.log('The pad you are working on was deleted by the owner')
            }
        });

        io.socket.on('remCollaborator', function(obj) {
            if(obj === $scope.pad.id) {
                // TODO: Add modal that allows user to discard the pad or create a copy of their own
                console.log('You are no longer a collaborator on this pad')
            }
        })

        $scope.sendBody = function () {
            $scope.pad.lastEditor = CurrentUser.user().email;
            //$log.info($scope.data.content);
            Pads.updateBody({id: $scope.pad.id, body: $scope.pad.body, lastEditor: $scope.pad.lastEditor});
            //io.socket.post('/pad/modify', $scope.data);
        };

        $scope.sendTitle = function () {
            $scope.pad.lastEditor = CurrentUser.user().email;
            //$log.info($scope.data.content);
            Pads.updateTitle({id: $scope.pad.id, title: $scope.pad.title, lastEditor: $scope.pad.lastEditor});
            //io.socket.post('/pad/modify', $scope.data);
        };

        $scope.addCollaborator = function(collaborator) {
            $log.info('adding collaborator', collaborator);
            $scope.pad.collaborators.push(collaborator);
            Pads.addCollaborator($scope.pad.id, collaborator);
        };
        $scope.remCollaborator = function(collaborator) {
            $log.info('removing collaborator', collaborator);
            $scope.pad.collaborators.splice($scope.pad.collaborators.indexOf(collaborator), 1);
            Pads.remCollaborator($scope.pad.id, collaborator);
        };
    });