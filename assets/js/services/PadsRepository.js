angular.module('app')
    .factory('Pads', function($http, CurrentUser) {
        var self = this;
        var currentUser = CurrentUser.user;
        var currentPad = {
            id: '',
            body: '',
            title: '',
            owner: '',
            collaborators: [],
            viewMode: '',
            lastEditor: ''
        };
        var userPads = [];
        var otherPads = [];

        return {
            getAll: function() {
                var id = currentUser().id;
                io.socket.get('/pad/getallpads', {id: id});
            },
            create: function(pad) {
                io.socket.post('/pad/create', pad, function(result) {
                    if(result) {
                        console.log('created', result);
                        currentPad = result;
                    }
                });
            },
            remove: function(pad) {
                io.socket.delete('/pad', pad)
            },
            updateTitle: function (pad) {
                io.socket.post('/pad/updateTitle', pad, function(result) {
                    if(result) {
                        currentPad = result;
                    }
                })
            },
            updateBody: function (pad) {
                io.socket.post('/pad/updateBody', pad, function(result) {
                    if(result) {
                        currentPad = result;
                    }
                })
            },
            addCollaborator: function(id, collaborator) {
                io.socket.post('/pad/addcollaborator', {id: id, addCollaborator: collaborator}, function(result) {
                    if (result) {
                        currentPad = result;
                    }
                })
            },
            remCollaborator: function(id, collaborator) {
                io.socket.post('/pad/remcollaborator', {id: id, remCollaborator: collaborator}, function(result) {
                    if (result) {
                        currentPad = result;
                    }
                })
            },
            getCurrentPad: function() {
                //console.log(currentPad);
                return currentPad;
            },
            setCurrentPad: function(pad) {
                currentPad = pad;
                //console.log(currentPad);
            },
            getUserPads: function() {
                //console.log(currentPad);
                return userPads;
            },
            setUserPads: function(pads) {
                userPads = pads;
                //console.log(currentPad);
            },
            getOtherPads: function() {
                //console.log(currentPad);
                return otherPads;
            },
            setOtherPads: function(pads) {
                otherPads = pads;
                //console.log(currentPad);
            }
        }
    });