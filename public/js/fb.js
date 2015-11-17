window.fbAsyncInit = function() {
  Parse.FacebookUtils.init({
    appId      : '189377341402438',
    // status     : true,
    cookie     : true,
    xfbml      : true,
    version    : 'v2.5'
  });

  // Run code after the Facebook SDK is loaded.
  console.info("facebook sdk loaded");
  $(window).trigger("facebookLoaded");
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));