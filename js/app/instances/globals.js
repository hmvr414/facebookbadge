"use strict";

define([
], function($, _, Backbone, Router ){

  function HGlobals () {
    this.router = null;
    this.fbLoggedIn = false;
  }

  return new HGlobals;
});