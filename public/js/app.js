window.T = {
  profileimage: Handlebars.compile($("#profileimage-template").html()),
  flag: Handlebars.compile($("#flag-template").html())
}

// blend images
// http://stackoverflow.com/questions/3648312/blend-two-images-on-a-javascript-canvas
// http://stackoverflow.com/questions/6765370/merge-image-using-javascript
function blend(){
  console.log('blending');
  var img1 = document.getElementById('profile');
  img1.crossOrigin = "Anonymous";
  var img2 = document.getElementById('flag');
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var width = img1.width;
  var height = img1.height;
  canvas.width = width;
  canvas.height = height;

  if(width===0) return;

  var pixels = 4 * width * height;
  context.drawImage(img1, 0, 0);
  var image1 = context.getImageData(0, 0, width, height);
  var imageData1 = image1.data;
  context.drawImage(img2, 0, 0);
  var image2 = context.getImageData(0, 0, width, height);
  var imageData2 = image2.data;
  while (pixels--) {
    imageData1[pixels] = imageData1[pixels] * 0.5 + imageData2[pixels] * 0.5;
  }
  image1.data = imageData1;
  context.putImageData(image1, 0, 0);
}

function setProfile(src){
  $("#profile").one('load', blend).attr('src', src);
}

function setFlag(src){
  $("#flag").one('load', blend).attr('src', src);
}

$("#flags").on("click", ".flag", function(e){
  // e.currentTarget.attributes['data-full'].nodeValue;
  e.preventDefault();
  var $f = $(e.currentTarget);
  $(".flag").removeClass("active");
  $f.addClass("active");
  setFlag("/flags/" + $f.data('code') + ".png")
});

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

  _.each(flags, function(flag){
    $("#flags .list-group").append(T.flag(flag));
  });
});

$(window).on("facebookConnected", function(){
  $("#fblogin").hide();
})

function displayImage(image){
  // console.info("displaying ", image.id);
  image.full = image.images[0].source;
  // console.dir(image);
  $("#profileImageContainer").append(T['profileimage'](image));
}

$("#profileImages").on("click", "a.profile", function(e){
  e.preventDefault();

  $i = $(e.currentTarget);
  $("a.profile").removeClass("active");
  $i.addClass("active");
  // e.currentTarget.attributes['data-full'].nodeValue
  setProfile($i.data('full'));
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

$("#save").click(function(e){
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
