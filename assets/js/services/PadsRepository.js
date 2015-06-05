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

        return {
            getAll: function() {
                var id = currentUser().id;
                io.socket.get('/pad/getallpads', {id: id});
            },
            create: function(pad) {
                io.socket.post('/pad/create', pad, function(result) {
                    if(result) {
                        self.currentPad = result;
                    }
                });
            },
            remove: function(id) {
                return $http.delete('/pad/', {id: id});
            },
            update: function (pad) {
                io.socket.post('/pad/modify', pad, function(result) {
                    if(result) {
                        self.currentPad = result;
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
            }
        }
    });