define(['facebook'], function(){
  FB.init({
    appId      : '1166077236770285',
  	xfbml      : true,
    version    : 'v2.6'
  });
  FB.getLoginStatus(function(response) {
    console.log(response);
  });
});