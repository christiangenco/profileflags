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
