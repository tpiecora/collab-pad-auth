angular.module('app')
    .factory('Pads', ["$http", "CurrentUser", "localStorageService", function($http, CurrentUser, localStorageService) {
        var self = this;
        var currentUser = CurrentUser.user;

        return {
            create: function (pad) {
                io.socket.post('/pad/create', pad, function (result) {
                    if (result) {
                        console.log('created', result);
                        localStorageService.set('currentPad', result);
                    }
                });
            },
            remove: function (pad) {
                io.socket.delete('/pad', pad)
            },
            updateTitle: function (pad) {
                io.socket.post('/pad/updateTitle', pad, function (result) {
                    if (result) {
                        localStorageService.set('currentPad', result);
                    }
                })
            },
            updateBody: function (pad) {
                io.socket.post('/pad/updateBody', pad, function (result) {
                    if (result) {
                        localStorageService.set('currentPad', result);
                    }
                })
            },
            addCollaborator: function (id, collaborator) {
                io.socket.post('/pad/addcollaborator', {id: id, addCollaborator: collaborator}, function (result) {
                    if (result) {
                        localStorageService.set('currentPad', result);
                    }
                })
            },
            remCollaborator: function (id, collaborator) {
                io.socket.post('/pad/remcollaborator', {id: id, remCollaborator: collaborator}, function (result) {
                    if (result) {
                        localStorageService.set('currentPad', result);
                    }
                })
            },
            checkCurrentPad: function(pad) {
                io.socket.post('/pad/checkCurrentPad')
            }

        };
    }]);