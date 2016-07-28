"use strict";

define([
  'jquery',
  'underscore',
  'backbone',
  'app/conf/settings',
  'text!tpl/home.html',
  "app/instances/globals",
  "app/collections/overlays",
  "app/models/figura",
  "facebook"
], function(
  $, 
  _, 
  Backbone, 
  settings, 
  homeViewTemplate, 
  App,
  OverlayCollection,
  FiguraModel)
{
  //console.log(App);
  var TO_RADIANS = Math.PI/180; 
  var HomeView = Backbone.View.extend(
  {
    el: '#primary',

    events: {
     'click .slick-slide': 'selectImage', //Agregamos un evento 'Click' para la clase '.slick-slide'
     'click .take-photo': 'takePhoto',
    },

    imagen: new Image(),
    imgmarca: new Image(),
    widthMarca: 0,
    heightMarca: 0,
    aspectMarca: 0,
    currentOverlay: 0,
    imagenesBarba: [],
    
    initialize: function()
    {
      var that = this;
      //this.model.on('change', this.render, this);

      this.listenTo(this.model, "change", function (e)
      {
        console.log("ATRIBUTO CAMBIADO A " +e);
        that.updateView();
      });
      /** Default image **/
      var imgBarba = new Image();
      imgBarba.src = "img/barba1.png";
      this.imagenesBarba=imgBarba;
      /**/

      this.imgmarca.src = "img/marca.png";
      this.imgmarca.onload = function ()
      {
        that.widthMarca = that.imgmarca.width;
        that.heightMarca = that.imgmarca.height;
        that.aspectMarca = that.heightMarca/ that.widthMarca;
      }

      FB.api("/me", "get", {fields:"picture.width(800).height(800)" }, function (response) 
      { 
        //that.updateView(response);
        if (response && response.picture) {
          that.imagen.onload = function() {
            that.updateView();
          }
          that.imagen.src = response.picture.data.url ;
          that.model.set({ "profile": response.picture.data.url });

        }
      });
      
      App.dispatcher.on( 'CloseView', this.close, this );
    },

    close: function() {
      // Unregister for event to stop memory leak
      console.log("descargando home");
      App.dispatcher.off( 'CloseView', this.close, this );
      this.remove();
      this.unbind();
      this.views = [];   // Clear the view array
    },

    drawMainRectangle: function (ctx)
    {
      /*ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 0.3;
      ctx.rect(this.model.get('x'), this.model.get('y'), this.model.get('w'), this.model.get('h'));
      ctx.fillStyle = this.model.get("fill");
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
      ctx.stroke();
      ctx.restore();*/

      ctx.save();
      ctx.translate(this.model.get('x') +(this.model.get('w')/2), this.model.get('y') +(this.model.get('h')/2));
      ctx.rotate(this.model.get('rotation'));
      ctx.beginPath();
      /*ctx.rect(-this.model.get('w')/2, -this.model.get('h')/2, this.model.get('w'), this.model.get('h'));
      ctx.fillStyle = this.model.get("fill");
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
      ctx.stroke();*/
      ctx.drawImage(this.imagenesBarba, -this.model.get('w')/2, -this.model.get('h')/2, this.model.get('w'), this.model.get('h'));
      ctx.restore();
    },
    selectImage:function (e) {
      //*cambiar imagen con click*//
      console.log(e.target) // Objeto clickeado
      this.imagenesBarba = e.target; // remplazamos la imagen
      this.updateView(); // Actualizamos la vista

    },
    takePhoto:function(data) {
      console.log(data)
      console.log(data.target)
      var canvas = $("#dibujo")[0];
      var data = canvas.toDataURL("image/png");
      console.log(data)
      
      var img = new Image;
      img.src = strDataURI;

      var myCanvas = canvas;
      var ctx = myCanvas.getContext('2d');
      var img = new Image;
      img.onload = function(){
        ctx.drawImage(img,0,0); // Or at whatever offset you like
      };
      img.src = strDataURI;
    },
    drawHandlers: function(ctx)
    {
      ctx.save();

      ctx.translate(this.model.get('x') +(this.model.get('w')/2), this.model.get('y') +(this.model.get('h')/2));
      ctx.rotate(this.model.get('rotation'));


      // surrounding rect
      ctx.beginPath();
      ctx.rect(-this.model.get('w')/2, -this.model.get('h')/2, this.model.get('w'), this.model.get('h'));
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
      ctx.stroke();

      // resize handler
      ctx.beginPath();
      ctx.rect(this.model.get('w')/2- 10, this.model.get('h')/2 -10, 20, 20);
      ctx.fillStyle = "#f00";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
      ctx.stroke();

      //rotation handler
      ctx.beginPath();
      ctx.rect(-this.model.get('w')/2 - 10, this.model.get('h')/2 -10, 20, 20);
      ctx.fillStyle = "#00f";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
      ctx.stroke();
      ctx.restore();   
    },

    drawPointer: function (ctx)
    {

      // resize handler
      /*ctx.beginPath();
      ctx.rect(this.model.get('rotatedX')- 5, this.model.get('rotatedY') -5, 10, 10);
      ctx.fillStyle = "#0f0";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
      ctx.stroke();*/
    },

    updateView: function (response)
    {
      $(".respuesta").text(this.model.get("profile"));
      $("#imagen-perfil").attr("src",this.model.get("profile"));

      //var myImage = new Image();
      var thecanvas = $("#dibujo")[0];

  
      var ctx = thecanvas.getContext("2d");
      var that = this;

      ctx.drawImage(that.imagen, 0, 0, thecanvas.width, thecanvas.height);
      ctx.drawImage(that.imgmarca, thecanvas.width -200, 0, 200, 200 * that.aspectMarca);
      that.drawMainRectangle(ctx);
      that.drawPointer(ctx);
      if (that.model.get("showHandlers"))
      {
        that.drawHandlers(ctx);
      }
      //that.drawMainRectangle(ctx);
      //if (that.model.get("showHandlers"))
      //{
      //  that.drawHandlers(ctx);
      //}
      /*myImage.onload = function() {
        ctx.drawImage(myImage, 0, 0, thecanvas.width, thecanvas.height);

        that.drawMainRectangle(ctx);
        if (that.model.get("showHandlers"))
        {
          that.drawHandlers(ctx);
        }
      };*/
      
      //myImage.src = this.model.get("profile");
      //$(".codigo").text(this.model.get("code"));
      //$(".last-message").text(this.model.get("lastMessage"));
      //$(".respuesta").text(JSON.stringify(response));
      /*if (response && response.picture)
      {
        this.dibujarCanvas(response.picture.data.url);
      }*/
    },

    getMouse: function (e)
    {
      var element = $("#dibujo")[0], offsetX = 0, offsetY = 0, mx, my;
        
      var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
      if (document.defaultView && document.defaultView.getComputedStyle) {
        stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(element, null)['paddingLeft'], 10)      || 0;
        stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(element, null)['paddingTop'], 10)       || 0;
        styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(element, null)['borderLeftWidth'], 10)  || 0;
        styleBorderTop   = parseInt(document.defaultView.getComputedStyle(element, null)['borderTopWidth'], 10)   || 0;
      }

      var html = document.body.parentNode;
      var htmlTop = html.offsetTop;
      var htmlLeft = html.offsetLeft;

      // Compute the total offset
      if (element.offsetParent !== undefined) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
      }

      // Add padding and border style widths to offset
      // Also add the offsets in case there's a position:fixed bar
      offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
      offsetY += stylePaddingTop + styleBorderTop + htmlTop;

      mx = e.pageX - offsetX;
      my = e.pageY - offsetY;
      
      // We return a simple javascript object (a hash) with x and y defined
      return {x: mx, y: my};
    },

    render: function()
    {
      // Using Underscore we can compile our template with data
      console.log("mostrando home" + OverlayCollection);
      console.log(OverlayCollection)
      var data = {
        isMobile: settings.isMobile(),
        overlays: OverlayCollection.models
      };
      var compiledTemplate;
      var that = this;
      if (App.fbLoggedIn === false)
      {
        Backbone.history.navigate('login',{trigger: true});
        //App.router.navigate('login', {trigger: true});
      }
      
      compiledTemplate = _.template( homeViewTemplate );
      this.$el.html( compiledTemplate(data) );
      $("#dibujo")[0].addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

      $("#dibujo")[0].addEventListener('mousedown', function(e) {
        var mouse = that.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        console.log("en mousedown");
        
        if (that.model.containsResizeHandler(mx, my))
        {
          console.log("resizing");

          that.model.set( { 'dragoffx': that.model.deRotateX(mx, my) - that.model.get('x')});
          that.model.set( { 'dragoffy': that.model.deRotateY(mx, my) - that.model.get('y')});
          that.model.set({ 'resizing': true });
        }
        else if (that.model.containsRotatingHandler(mx, my))
        {
          console.log("rotating");
          that.model.set( { 'dragoffx': mx});
          that.model.set( { 'dragoffy': my});
          that.model.set({ 'rotating': true });
        }
        else if (that.model.contains(mx, my)) {
          // Keep track of where in the object we clicked
          // so we can move it smoothly (see mousemove)
          that.model.set( { 'dragoffx': mx - that.model.get('x')});
          that.model.set( { 'dragoffy': my - that.model.get('y')});
          that.model.set( { 'dragging': true });
          //that.model.set( { 'selection': { x: that.model.get('x'), y:that.model.get('y') }});
          that.model.set( { 'valid': false });
          return;
        }
      }, true);  

      $("#dibujo")[0].addEventListener('mousemove', function(e) {
        //console.log("en mousemove");
        var mouse = that.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        that.model.set( { 'rotatedX': that.model.deRotateX(mx,my)});
        that.model.set( { 'rotatedY': that.model.deRotateY(mx,my)});
        if ((that.model.contains(mx, my) ||
            that.model.containsResizeHandler(mx, my) ||
            that.model.containsRotatingHandler(mx, my)) && 
            !that.model.get('dragging') && 
            !that.model.get('resizing')) {
          that.model.set({"showHandlers": true});
        } else {
          that.model.set({"showHandlers": false});
        }

        if (that.model.get('resizing'))
        {
          var deltax = that.model.get('x');
          var deltay = that.model.get('y');

          that.model.set({w :that.model.deRotateX(mx, my) -deltax, h: that.model.deRotateY(mx,my) -deltay});
        }
        if (that.model.get('rotating'))
        {
          var deltax = that.model.get('x') + that.model.get('w')/2;
          var deltay = that.model.get('y') + that.model.get('h')/2;

          var px = that.model.get('x');
          var py = that.model.get('y') +that.model.get('h');

          var anguloplus = Math.atan2(deltay -py, deltax -px);

          var angle = Math.atan2(deltay -my, deltax -mx);
          that.model.set({rotation: angle -anguloplus});
        }
        else if ( that.model.get('dragging')){
 
          that.model.set({x :mx - that.model.get('dragoffx'), y: my - that.model.get('dragoffy')});
          
          that.model.set( { 'valid': false }); // Something's dragging so we must redraw
        }
      }, true);

      $("#dibujo")[0].addEventListener('mouseup', function(e) {
        console.log("en mouseup");
        that.model.set({'dragging': false});
        that.model.set({'resizing': false});
        that.model.set({'rotating': false});
      }, true);

      $(document).ready(function () {
        $('.slider-de-overlays').slick({
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          adaptiveHeight: true,
          arrows: true
        });
      });
      
      return this;
    }
  });
  
  // Our module now returns our view
  return HomeView;
});