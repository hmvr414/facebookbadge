"use strict";

define([
	'backbone'
],function (Backbone)
{
	var AppModel = Backbone.Model.extend(
	{
		defaults: {
			x: 0,
			y: 0,
			w: 100,
			h: 100,
			fill: '#AAAAAA',
			profile: 'img/placeholder.png',
			dragging: false,
			dragoffx: 0,
			dragoffy: 0,
			rotatedX: 0,
			rotatedY: 0,
			valid: false,
			selectionColor : '#CC0000',
			rotation: 0,
			rotating: false,
  			selectionWidth : 2,
  			showHandlers: false,
  			resizing: false
		},

		rawHitTest: function (x, y, p1, p2, w, h)
		{
			return  (p1 <= x) && (p1 + w >= x) &&
          		(p2 <= y) && (p2 + h >= y);
		},

		contains: function (x, y)
		{
			var dx, dy;
			dx = this.deRotateX(x,y);
			dy = this.deRotateY(x,y);

			x = dx;
			y = dy;
			return this.rawHitTest(x,y,this.get('x'), this.get('y'), this.get('w'), this.get('h'));
		},

		deRotateX: function (x, y)
		{
			x = x -(this.get('x')+ this.get('w')/2);
			y = y -(this.get('y')+ this.get('h')/2);
			return this.get('x')+ this.get('w')/2 +(x * Math.cos(-this.get('rotation')) - y * Math.sin(-this.get('rotation')));
			
		},

		deRotateY: function (x, y)
		{
			x = x -(this.get('x')+ this.get('w')/2);
			y = y -(this.get('y')+ this.get('h')/2);
			return this.get('y')+ this.get('h')/2 +(y * Math.cos(-this.get('rotation')) + x * Math.sin(-this.get('rotation')));
		},

		containsResizeHandler: function (x, y)
		{
			//console.log("checking resize");
			var dx, dy;
			dx = this.deRotateX(x,y);
			dy = this.deRotateY(x,y);

			x = dx;
			y = dy;

			var x1 = this.get('x');
			var y1 = this.get('y');
			var w = this.get('w');
			var h = this.get('h');
			return this.rawHitTest(x,y, x1 +w - 10, y1 +h -10, 20, 20);
		},

		containsRotatingHandler: function (x,y)
		{
			var dx, dy;
			dx = this.deRotateX(x,y);
			dy = this.deRotateY(x,y);

			x = dx;
			y = dy;

			var x1 = this.get('x');
			var y1 = this.get('y');
			var w = this.get('w');
			var h = this.get('h');
			return this.rawHitTest(x,y, x1 - 10, y1 +h -10, 20, 20);
		}
	});

	return new AppModel(
      {
        code: ""
      });
});