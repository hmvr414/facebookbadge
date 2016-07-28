"use strict";

define([
	'backbone'
],function (Backbone)
{
	var FiguraModel = Backbone.Model.extend(
	{
		defaults: {
			x: 0,
			y: 0,
			w: 1,
			h: 1,
			fill: '#AAAAAA'
		}
	});

	return new FiguraModel();
});