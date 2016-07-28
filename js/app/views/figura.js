"use strict";

define([
  'jquery',
  'underscore',
  'backbone',
  'app/conf/settings',
  'text!tpl/home.html',
  "app/instances/globals",
  "app/collections/overlays",
  "facebook"
], function(
  $, 
  _, 
  Backbone, 
  settings, 
  homeViewTemplate, 
  App,
  OverlayCollection)
{

  var FiguraView = Backbone.View.extend(
  {
    render: function (ctx)
    {
      ctx.fillStyle = this.fill;
      ctx.fillRect(this.get('x'), this.get('y'), this.get('w'), this.get('h'));
    }
  });

  return FiguraView;
});