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
        Pad.find({owner: reqData.id}).exec(function (e, pads) {
            if (e) return res.negotiate(e);

            console.log(req.params.id, pads);
            Pad.subscribe(req.socket);
            Pad.subscribe(req.socket, pads);
            sails.log.info(req.socket.id + ' subscribed');
            pads ? resData.push(pads) : resData.push([]);
        });
        // Find pads the user is collaborating on and subscribe to them too
        Pad.find({collaborators: [reqData.id]}).exec(function (e, pads) {
            console.log(req.params.id, pads);
            Pad.subscribe(req.socket, pads);
            pads ? resData.push(pads) : resData.push([]);
        });
        return res.ok(resData);
    },
    getAllPads: function (req, res) {
        if (req.isSocket && req.method === 'GET') {
            var allPads = [];
            reqData = req.params.all();
            Pad.find({owner: reqData.id}).exec(function (e, result) {
                if (e) return res.negotiate(e);
                if (result) {
                    allPads = result;
                    return res.ok(allPads)
                }
                return res.send(204, 'No pads found');

            })
        }
    },
    create: function(req, res) {
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
    modify: function (req, res) {
        var reqData = req.params.all();

        if(req.isSocket && req.method === 'POST') {
            //Receiving new content from the client
            //Update pad contents
            sails.log.info('modify triggered', reqData);
            Pad.update({id: reqData.id}, {
                lastEditor: reqData.lastEditor,
                body: reqData.body,
                title: reqData.title,
                collaborators: reqData.collaborators,
                viewMode: reqData.viewMode
            })
                .exec(function (e, result) {
                    if (e) return sails.error(e);
                    sails.log.info('pad updated', result);
                    if (result[0]) {
                        Pad.publishUpdate(result[0].id, result[0]);
                        sails.log.info('pad update published', result[0].id);
                    }
                })
        }
    }


};

