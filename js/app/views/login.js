"use strict";

define([
  'jquery',
  'underscore',
  'backbone',
  'app/conf/settings',
  'text!tpl/login.html',
  "app/instances/globals",
  "facebook"
], function(
  $, 
  _, 
  Backbone, 
  settings, 
  loginViewTemplate, 
  App)
{
  var LoginView = Backbone.View.extend(
  {
    el: '#primary',

    events: {
     
    },

    initialize: function()
    {
      var that = this;

      this.listenTo(this.model, "change", function (e)
      {
        //console.log("ATRIBUTO CAMBIADO A " +e);
        that.updateView();
      });

      window.checkLoginState = function() {
        FB.getLoginStatus(function(response) {
          that.statusChangeCallback(response);
        });
      };

      App.dispatcher.on( 'CloseView', this.close, this );
    },
    close: function() {
      // Unregister for event to stop memory leak
      console.log("descargando login");
      App.dispatcher.off( 'CloseView', this.close, this );
      this.remove();
      this.unbind();
      this.views = [];   // Clear the view array
    },

    render: function()
    {
      var self = this;
      // Using Underscore we can compile our template with data
      var data = {
        isMobile: settings.isMobile(),
      };
      var compiledTemplate;

      compiledTemplate = _.template( loginViewTemplate );
      this.$el.html( compiledTemplate(data) );

      FB.getLoginStatus(function(response) {
        console.log("Recibido getLoginStatus");
        self.statusChangeCallback(response);
      });
      return this;
    },

    statusChangeCallback: function(response)
    {
      var self = this;
      console.log('statusChangeCallback');
      console.log(response);
      // The response object is returned with a status field that lets the
      // app know the current login status of the person.
      // Full docs on the response object can be found in the documentation
      // for FB.getLoginStatus().
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
        self.testAPI();
        App.fbLoggedIn = true;
        //App.router.navigate('/', {trigger: true});
        Backbone.history.navigate('/',{trigger: true});
      } else if (response.status === 'not_authorized') {
        console.log("Not authorized");
        // The person is logged into Facebook, but not your app.
        //document.getElementById('status').innerHTML = 'Please log ' +
        //  'into this app.';
      } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        //document.getElementById('status').innerHTML = 'Please log ' +
         // 'into Facebook.';
      }
    },

    checkLoginState: function() {
      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
    },

    testAPI: function ()
    {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        //document.getElementById('status').innerHTML =
        //  'Thanks for logging in, ' + response.name + '!';
      });
    }
  });
  return LoginView;
  
});