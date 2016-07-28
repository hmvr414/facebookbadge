"use strict";

define([
  'jquery',
  'underscore',
  'backbone',
  'app/router', // Request router.js
  'app/instances/globals' // Request router.js
  //'common/player/video-player'
  //'common/sync/sync-manager'
], function($, _, Backbone, Router, AppGlobals ){

  function App () {
    this.router = null;
  }

  App.prototype.initialize = function ()
  {
      AppGlobals.dispatcher = _.clone(Backbone.Events);
      AppGlobals.router = Router.initialize();
      console.log(AppGlobals.router);
  };

  return new App;
});