"use strict";

define([
	'backbone'
],function (Backbone)
{
	var AppModel = Backbone.Model.extend(
	{
		defaults: {
			
		}
	});

	return new AppModel(
      {
        code: ""
      });
});