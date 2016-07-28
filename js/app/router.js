"use strict";

// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'app/models/app-model',
  'app/views/home',
  'app/views/login',
  "app/instances/globals"
], function(
  $, 
  _, 
  Backbone, 
  AppModel, 
  HomeView, 
  LoginView, 
  App)
{

  var AppRouter = Backbone.Router.extend(
  {
    routes: {
      // Define some URL routes
      '': "home",
      'login': "goLogin",
    },
    initialize: function() {
        this.bind( "all", this.change )
    },
    before: function () {
        console.log("saliendo");
        $("footer").removeClass("hidden");
        $("html").removeClass("home");
        $("body").removeClass("home");
        App.dispatcher.trigger( 'CloseView' );
        $("<div id=\"primary\" class=\"content-area\">").appendTo("#content");
    },

    change: function (r) {
        //console.log(r);
    }
  });
var initialize = function()
  {
    var app_router = new AppRouter;

    app_router.on('route:home', function()
    {
      console.log("cargando home");
 		app_router.before();
      var homeView = new HomeView({model: AppModel});
      homeView.render();
    });

    app_router.on('route:goLogin', function()
    {
      console.log("cargando login");
 		app_router.before();
      var loginView = new LoginView({model: AppModel});
      loginView.render();
    });

    //Backbone.history.start({pushState: true});
    Backbone.history.start();

    return app_router;
  };
  return {
    initialize: initialize
  };
});