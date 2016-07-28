"use strict";

define([
	'backbone',
	'app/models/overlay'
],function (Backbone, OverlayModel)
{
	var OverlayCollection = Backbone.Collection.extend(
	{
		model: OverlayModel 
	});

	var overlays = new OverlayCollection([
		new OverlayModel({ imagen: "img/cura.png", title: "Curita" }),
		new OverlayModel({ imagen: "img/gel1.png", title: "Gel" }),
		new OverlayModel({ imagen: "img/nariz.png", title: "Nariz" }),
		new OverlayModel({ imagen: "img/pill.png", title: "Pildora" }),
		new OverlayModel({ imagen: "img/termometro.png", title: "Termometro" })
	]); 

	return overlays;
});