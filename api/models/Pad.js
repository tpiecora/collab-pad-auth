/**
* Pad.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,

  attributes: {
    body: {
      type: 'string',
      required: 'true'
    },
    title: {
      type: 'string',
      required: 'true'
    },
    owner: {
      type: 'string',
      required: 'true'
    },
    collaborators: {
      type: 'array'
    },
    viewMode: {
      type: 'string',
      required: 'true'
    },
    lastEditor: {
      type: 'string'
    }
  }

};

