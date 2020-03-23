var Photo;
var result = [];
var Lat, Lon;
var UID;
var SignedUpOrIn = false;
$(document).ready(function() {
  $("#signout").hide();
  // API call when search button clicked
  $("#search").on("click", function() {
    zipcode = $(".userInput")
      .val()
      .trim();
    if (
      $(".radius")
        .val()
        .trim() &&
      /^[0-9]+$/.test(
        $(".radius")
          .val()
          .trim()
      )
    ) {
      radius =
        "radius=" +
        $(".radius")
          .val()
          .trim() +
        "&";
    } else {
      radius = "";
    }

    // check if input is empty and the input is numbers only
    if (zipcode !== "" && /^[0-9]+$/.test(zipcode)) {
      $.ajax({
        async: "true",
        crossDomain: "true",
        url:
          "https://realtor.p.rapidapi.com/properties/list-for-sale?sort=relevance&" +
          radius +
          "postal_code=" +
          zipcode +
          "&offset=0&limit=100",
        method: "GET",
        headers: {
          "x-rapidapi-host": "realtor.p.rapidapi.com",
          "x-rapidapi-key": "7f6807f23bmsh0797a1d4ca8a067p10f0bajsnc10b5c239d52"
        }
      }).done(function(data) {
        result = data.listings;

        $(".properties").text("");
        for (i = 0; i < result.length; i++) {
          Photo = result[i].photo;
          if (Photo) {
            Photo = result[i].photo;
          } else {
            Photo = "assets/images/logo.jpg";
          }
          if (i % 4 == 0 && i !== 0) {
            $(".properties").append('<div class="w-100"></div>');
            $(".properties").append(
              '<div class="col"><div class="card PropertyCard" data-id="' +
                i +
                '"><img src="' +
                Photo +
                '" class="card-img-top" height="200"><p class="overlay">' +
                result[i].price +
                '</p><div class="card-body"><div class="row"><div class="col">' +
                result[i].beds +
                " beds | " +
                result[i].baths +
                " baths | " +
                result[i].sqft.split(" ")[0] +
                ' sqft</div><div class="w-100"></div><div class="col"><strong>' +
                result[i].address +
                "</strong></div>" +
                "</div></div></div></div>"
            );
          } else {
            $(".properties").append(
              '<div class="col"><div class="card PropertyCard" data-id="' +
                i +
                '"><img src="' +
                Photo +
                '" class="card-img-top" height="200"><p class="overlay">' +
                result[i].price +
                '</p><div class="card-body"><div class="row"><div class="col">' +
                result[i].beds +
                " beds | " +
                result[i].baths +
                " baths | " +
                result[i].sqft.split(" ")[0] +
                ' sqft</div><div class="w-100"></div><div class="col"><strong>' +
                result[i].address +
                "</strong></div></div></div>"
            );
          }
        }
      });
    }
  });

  $(document).on("click", ".PropertyCard", function() {
    var Id = $(this).attr("data-id");
    Lat = result[Id].lat;
    Lon = result[Id].lon;
    initMap(Lat, Lon);
    $(".ModalMap").show();
  });

  $("#close").on("click", function() {
    $(".ModalMap").hide();
  });

  // Firebase Script
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDiOhlw4pg0zLapTaT7S1oF5sam6mMq5KU",
    authDomain: "real-estate-project-2e3a3.firebaseapp.com",
    databaseURL: "https://real-estate-project-2e3a3.firebaseio.com",
    projectId: "real-estate-project-2e3a3",
    storageBucket: "real-estate-project-2e3a3.appspot.com",
    messagingSenderId: "1086203608176",
    appId: "1:1086203608176:web:a1ae5db94335a8626148b5"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

  $("#signup").on("click", function() {
    $(".SignUpMod").show();
  });

  $("#singupclose").on("click", function() {
    $(".SignUpMod").hide();
  });

  $("#signin").on("click", function() {
    $(".SignInMod").show();
  });

  $("#singinclose").on("click", function() {
    $(".SignInMod").hide();
  });
  $("#signupsubmit").on("click", function(event) {
    event.preventDefault();
    $("#signupmessage").text("");
    Email = $("#singupemail")
      .val()
      .trim();
    Password = $("#signuppassword")
      .val()
      .trim();
    if (Email && Password) {
      var Auth = firebase
        .auth()
        .createUserWithEmailAndPassword(Email, Password)
        .then(function(User) {
          SignedUpOrIn = true;
          $("#signupmessage").text("Singed Up successfully");

          $("#signin").hide();
          $("#signout").show();
          $("#currentuser").text(User.user.email);

          UID = User.user.uid;
          database.ref("/users/" + UID).update({
            email: User.user.email
          });
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;

          $("#signupmessage").text(errorMessage);
        });
    }
  });

  $("#signinsubmit").on("click", function(event) {
    event.preventDefault();
    UserEmail = $("#singinemail")
      .val()
      .trim();
    UserPassword = $("#signinpassword")
      .val()
      .trim();
    if (UserEmail && UserPassword) {
      firebase
        .auth()
        .signInWithEmailAndPassword(UserEmail, UserPassword)
        .then(function(User) {
          SignedUpOrIn = true;
          $("#signinmessage").text("Logged In successfully");
          UID = User.user.uid;
          $("#signin").hide();
          $("#signout").show();
          $("#currentuser").text(User.user.email);
          database.ref("/users/" + UID).update({
            email: User.user.email
          });
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          $("#signinmessage").text(errorMessage);
          // ...
        });
    }
  });

  $("#signout").on("click", function() {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
        SignedUpOrIn = false;
        database.ref("/users/" + UID).remove();
        $("#signin").show();
        $("#signout").hide();
        $("#currentuser").text("Signed Out Successfully");
      })
      .catch(function(error) {
        // An error happened.
      });
  });

  $(window).on("unload", function() {
    if (SignedUpOrIn) {
      database.ref("/users/" + UID).remove();
    }
  });
});

function initMap(Lat, Lon) {
  var location = { lat: Lat, lng: Lon };
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: location
  });
  var marker = new google.maps.Marker({ position: location, map: map });
}
