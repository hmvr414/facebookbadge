"use strict";

require.config({
  urlArgs: "bust=" + (new Date()).getTime(),
  baseUrl: "js",
  shim: {
    'facebook' : {
      exports: 'FB'
    }
  },
  paths: {
    facebook: '//connect.facebook.net/en_US/sdk',
    underscore: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min',
    backbone: 'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min',
    text: 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min',
    tpl: '../tpl'
  }
});


define('jquery', [], function()
{
    return jQuery;
});

require([
  'app/app',
  'libs/fb'
], function(App)
{
  console.log("inicializando App");
  App.initialize();
  console.log("iniciada " +App);
});