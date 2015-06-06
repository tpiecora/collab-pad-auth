/**
 * PadController
 *
 * @description :: Server-side logic for managing pads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    subscribe: function (req, res) {
        var resData = [];
        var reqData = req.params.all();

        // Get all the user's documents and subscribe to them
        Pad.find({owner: reqData.id}).exec(function (e, pads) {
            if (e) return res.negotiate(e);

            // subscribe to the model and all records owned by this user
            Pad.subscribe(req.socket);
            Pad.subscribe(req.socket, pads);
            //console.log(Pad.subscribers(pads[0]));
            pads ? resData.push(pads) : resData.push([]);

            // Find pads the user is collaborating on and subscribe to them too
            Pad.find({collaborators: [reqData.id]}).exec(function (e, pads) {
                if (e) return res.negotiate(e);

                // subscribe to all records this user is collaborating on
                Pad.subscribe(req.socket, pads);
                pads ? resData.push(pads) : resData.push([]);
                // Send back an array containing all instances subscribed to
                return res.ok(resData);
            });
        });

        // Store the current socket in the User's instance for future reference
        User.update({email: reqData.id}, {userSocket: req.socket.id}).exec(function (e, result) {
            if (e) return res.negotiate(e);

            console.log(result);
            console.log('socket stored')

        });

    },
    create: function(req, res) {

        console.log('rooms', sails.sockets.rooms());
        if (req.isSocket && req.method === 'POST') {
            reqData = req.params.all();
            sails.log.info('creating new pad', reqData);
            Pad.create(reqData).exec(function(e, result) {
                if (e) return res.negotiate(e);
                sails.log.info('pad created', result);
                Pad.subscribe(req.socket, result);
                Pad.publishUpdate(result.id, result);
                return res.ok(result);
            })
        }
    },
    updateTitle: function (req, res) {
        var reqData = req.params.all();

        if(req.isSocket && req.method === 'POST') {
            //Receiving new content from the client
            //Update pad contents
            //sails.log.info('modify triggered', reqData);
            Pad.update({id: reqData.id},
                {
                    lastEditor: reqData.lastEditor,
                    title: reqData.title
                }
            )
                .exec(function (e, result) {
                    if (e) return sails.error(e);

                    //sails.log.info('pad updated', result);
                    if (result[0]) {
                        Pad.publishUpdate(result[0].id, result[0]);
                        sails.log.info('pad update published', result[0].id);
                    }
                })
        }
    },
    updateBody: function (req, res) {
        var reqData = req.params.all();

        if(req.isSocket && req.method === 'POST') {
            //Receiving new content from the client
            //Update pad contents
            //sails.log.info('modify triggered', reqData);
            Pad.update({id: reqData.id},
                {
                    lastEditor: reqData.lastEditor,
                    body: reqData.body
                }
            )
                .exec(function (e, result) {
                    if (e) return sails.error(e);

                    //sails.log.info('pad updated', result);
                    if (result[0]) {
                        Pad.publishUpdate(result[0].id, result[0]);
                        sails.log.info('pad update published', result[0].id);
                    }
                })
        }
    },
    addCollaborator: function(req, res) {
        var reqData = req.params.all();
        var pad;

        if(req.isSocket && req.method === 'POST') {
            //find the pad we want to add a collaborator to
            Pad.findOne({id: reqData.id}).exec(function(e, result) {
                if (e) return res.negotiate(e);

                pad = result;
                console.log(pad);
                pad.collaborators.push(reqData.addCollaborator);
                pad.save(function(e) {
                    if (e) return res.negotiate(e);

                    // We need to let the user who was added know that they were added
                    User.findOne({email: reqData.addCollaborator}).exec(function (e, result) {
                        if (e) return res.negotiate(e);

                        //console.log(result);
                        var rooms = sails.sockets.rooms();
                        //console.log(result, rooms, rooms.indexOf(result.userSocket));
                        //if the added user is subscribed emit an update message to them
                        if (result && result.userSocket && rooms.indexOf(result.userSocket) !== -1) {
                            console.log('socket found, emitting');
                            sails.sockets.emit(result.userSocket, 'addCollaborator', pad);
                            //Pad.subscribe(result.socket, pad);
                            //Pad.publishUpdate(pad.id, pad);
                        }
                    });
                    res.ok(pad);
                })
            })
        }
    },
    remCollaborator: function(req, res) {
        var reqData = req.params.all();
        var pad;

        if(req.isSocket && req.method === 'POST') {
            //find the pad we want to add a collaborator to
            Pad.findOne({id: reqData.id}).exec(function(e, result) {
                if (e) return res.negotiate(e);

                pad = result;
                console.log(pad);
                if (pad.collaborators.indexOf(reqData.remCollaborator) !== -1)
                pad.collaborators.splice(reqData.remCollaborator, 1);
                pad.save(function(e) {
                    if (e) return res.negotiate(e);

                    // We need to let the user who was removed know that they were removed
                    User.findOne({email: reqData.remCollaborator}).exec(function (e, result) {
                        if (e) return res.negotiate(e);

                        //console.log(result);
                        var rooms = sails.sockets.rooms();
                        //console.log(result, rooms, rooms.indexOf(result.userSocket));
                        //if the added user is subscribed emit an update message to them
                        if (result && result.userSocket && rooms.indexOf(result.userSocket) !== -1) {
                            console.log('socket found, emitting');
                            sails.sockets.emit(result.userSocket, 'remCollaborator', pad.id);
                            //Pad.subscribe(result.socket, pad);
                            //Pad.publishUpdate(pad.id, pad);
                        }
                    });
                    res.ok(pad);
                })
            })
        }
    }


};

