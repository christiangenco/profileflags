window.T = {
  profileimage: Handlebars.compile($("#profileimage-template").html())
}

$("#fblogin").click(function(e){
  e.preventDefault();
  console.info("logging in through facebook");

  Parse.FacebookUtils.logIn("email,publish_actions,user_photos", {
    success: function(user) {
      if (!user.existed()) {
        console.info("User signed up and logged in through Facebook!");
      } else {
        console.info("User logged in through Facebook!");
      }
    },
    error: function(user, error) {
      console.info("User cancelled the Facebook login or did not fully authorize.");
    }
  });
})

$(window).on("facebookLoaded", function(){
  FB.getLoginStatus(function(res){
    if(res && res.status === "connected")
      $(window).trigger("facebookConnected");
  });
});

function displayImage(image){
  console.info("displaying ", image.id);
  image.full = image.images[0].source;
  console.dir(image);
  $("#profileImages").append(T['profileimage'](image));
}

$("#profileImages").on("click", "a.profile", function(e){
  e.preventDefault();
  console.dir(e);
  console.log(e.currentTarget.attributes['data-full'].nodeValue);
});

$(window).on("facebookConnected", function(){
  FB.api(
    "/me/albums",
    function (res) {
      // console.dir(res);
      if (res && !res.error) {
        var profileAlbum = _.findWhere(res.data, {name: "Profile Pictures"});
        if(profileAlbum && profileAlbum.id){
          console.info("Getting profile album: ", profileAlbum.id);
          FB.api(
            // fields: https://developers.facebook.com/docs/graph-api/reference/photo
            "/" + profileAlbum.id + "/photos?fields=images,picture,width,height",
            function (res) {
              // console.dir(res);
              if (res && !res.error) {
                // async.eachSeries(res.data, displayImage);
                _.each(res.data, displayImage)
              }
            }
          );
        }
      }
    }
  );

  // FB.api(
  //   "/me/picture",
  //   {
  //     type: 'large'
  //   },
  //   function (res) {
  //     if (res && !res.error) {
  //       console.log(res.data.url);
  //       $("#fbprofile").attr('src', res.data.url);
  //     }
  //   }
  // );
});

// blend images
// http://stackoverflow.com/questions/3648312/blend-two-images-on-a-javascript-canvas
// http://stackoverflow.com/questions/6765370/merge-image-using-javascript

$("#uploadphoto").click(function(e){
  e.preventDefault();
  console.info("uploading photo");

  // post the photo data: 
  // https://gist.github.com/andyburke/1498758
  // if that doesn't work: http://stackoverflow.com/questions/21111893/upload-base64-image-facebook-graph-api-how-to-use-this-script/21145106#21145106
  FB.api(
    "/me/photos",
    "POST",
    {
      url: "http://i.imgur.com/nIwusw9.png",
      no_story: true
    },
    function(res) {
      console.dir(res);
      if(res && !res.error) {
        /* handle the result */
        "http://www.facebook.com/photo.php?fbid=" + res.id + "&makeprofile=1";
      }
    }
  );
});