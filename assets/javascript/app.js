var Photo;
var result = [];
var Lat, Lon;
var UID;
var UserEmail;
var SavedHomesArr = [];
var SavedHomes;
$(document).ready(function() {
  $(".SavedHomes").hide();
  $("#signout").hide();
  $("#saved").hide();
  // API call when search button clicked
  $("#search").on("click", function() {
    $(".SavedHomes").hide();
    $(".result").show();
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
          "&offset=0&limit=5",
        method: "GET",
        headers: {
          "x-rapidapi-host": "realtor.p.rapidapi.com",
          "x-rapidapi-key": "7f6807f23bmsh0797a1d4ca8a067p10f0bajsnc10b5c239d52"
        }
      }).done(function(data) {
        result = data.listings;
        console.log(result);
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
              '<div class="col-md-3"><div class="card PropertyCard"><i class="far fa-heart SearchHeart" data-status="off" id="' +
                i +
                '"data-toggle="tooltip" data-placement="top" title="save this home"></i><img src="' +
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
                '</strong></div><div class="w-100"><div class="col"><button type="button" class="btn btn-secondary openmap" data-id="' +
                i +
                '">Open Map</button></div></div></div></div></div>'
            );
          } else {
            $(".properties").append(
              '<div class="col-md-3"><div class="card PropertyCard"><i class="far fa-heart SearchHeart" data-status="off" id="' +
                i +
                '"data-toggle="tooltip" data-placement="top" title="save this home"></i><img src="' +
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
                '</strong></div><div class="w-100"><div class="col"><button type="button" class="btn btn-secondary openmap" data-id="' +
                i +
                '">Open Map</button></div></div></div></div></div>'
            );
          }
        }
      });
    }
  });

  $(document).on("click", ".SavedHeart", function() {
    // unsave homes from user's favorite page
    var Clicked = $(this);
    var Id = Clicked.attr("id");
    var status = Clicked.attr("data-status");
    var favpropid = SavedHomesArr[Id];
    if (status === "on") {
      database.ref("/favorites/" + UID + "/" + favpropid).remove();
      Clicked.css("color", "white");
      Clicked.attr("data-status", "off");
      Clicked.attr("title", "save this home");
    } else {
      database.ref("/favorites/" + UID + "/" + favpropid).update({
        favphoto: SavedHomes[SavedHomesArr[Id]].favphoto,
        favprice: SavedHomes[SavedHomesArr[Id]].favprice,
        favbeds: SavedHomes[SavedHomesArr[Id]].favbeds,
        favbaths: SavedHomes[SavedHomesArr[Id]].favbaths,
        favsqft: SavedHomes[SavedHomesArr[Id]].favsqft,
        favaddress: SavedHomes[SavedHomesArr[Id]].favaddress,
        favlat: SavedHomes[SavedHomesArr[Id]].favlat,
        favlon: SavedHomes[SavedHomesArr[Id]].favlon
      });
      Clicked.css("color", "red");
      Clicked.attr("data-status", "on");
      Clicked.attr("title", "unsave this home");
    }
  });

  $(document).on("click", ".SearchHeart", function() {
    // check if the user signed by User ID
    if (UID) {
      var Clicked = $(this);
      status = Clicked.attr("data-status");
      var Id = Clicked.attr("id");
      var favpropid = result[Id].property_id;

      if (status === "off") {
        database
          .ref("/favorites/" + UID)
          .once("value")
          .then(function(snapshot) {
            var AlreadySaved = snapshot.child(favpropid).exists();

            if (!AlreadySaved) {
              var favphoto = result[Id].photo;
              var favprice = result[Id].price;
              var favbeds = result[Id].beds;
              var favbaths = result[Id].baths;
              var favsqft = result[Id].sqft.split(" ")[0];
              var favaddress = result[Id].address;
              var favlat = result[Id].lat;
              var favlon = result[Id].lon;
              database.ref("/favorites/" + UID + "/" + favpropid).update({
                favphoto: favphoto,
                favprice: favprice,
                favbeds: favbeds,
                favbaths: favbaths,
                favsqft: favsqft,
                favaddress: favaddress,
                favlat: favlat,
                favlon: favlon
              });
              Clicked.css("color", "red");
              Clicked.attr("data-status", "on");
              Clicked.attr("title", "unsave this home");
            } else {
              alert("Already saved");
            }
          });
      } else {
        database
          .ref("/favorites/" + UID)
          .once("value")
          .then(function(snapshot) {
            var AlreadySaved = snapshot.child(favpropid).exists();

            if (AlreadySaved) {
              database.ref("/favorites/" + UID + "/" + favpropid).remove();
            }
          });
        Clicked.css("color", "white");
        Clicked.attr("data-status", "off");
        Clicked.attr("title", "save this home");
      }
    } else {
      alert("please login or create account");
    }
  });

  $(document).on("click", ".openmap", function() {
    var Id = $(this).attr("data-id");
    Lat = result[Id].lat;
    Lon = result[Id].lon;
    initMap(Lat, Lon);
    $(".ModalMap").show();
  });

  $(document).on("click", ".savedopenmap", function() {
    var Id = $(this).attr("data-id");
    Lat = SavedHomes[SavedHomesArr[Id]].favlat;
    Lon = SavedHomes[SavedHomesArr[Id]].favlon;
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
          UserEmail = User.user.email;
          $("#signupmessage").text("Singed Up successfully");
          $("#signup").hide();
          $("#signin").hide();
          $("#signout").show();
          $("#saved").show();
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
          UserEmail = User.user.email;
          $("#signinmessage").text("Logged In successfully");
          UID = User.user.uid;
          $("#signup").hide();
          $("#signin").hide();
          $("#signout").show();
          $("#saved").show();
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
        $(".SavedHomes").hide();
        $(".properties").text("");
        $(".result").show();
        SignedUpOrIn = false;
        database.ref("/users/" + UID).remove();
        $("#signin").show();
        $("#signup").show();
        $("#saved").hide();
        $("#signout").hide();
        $("#currentuser").text("Signed Out Successfully");
        UID = undefined;
        $(".fa-heart").attr("data-status", "off");
        $(".fa-heart").css("color", "white");
      })
      .catch(function(error) {
        // An error happened.
      });
  });
  // log out the user when closed the browser
  $(window).on("unload", function() {
    if (UID) {
      database.ref("/users/" + UID).remove();
    }
  });

  $("#saved").on("click", function() {
    $(".result").hide();
    $(".SavedHomes").show();
    $(".SavedProperties").text("");
    // check if there are saved homes
    database
      .ref("/favorites/" + UID)
      .once("value")
      .then(function(snapshot) {
        console.log("exitst :" + snapshot.exists());
        database.ref("/favorites/" + UID).once("value", function(data) {
          SavedHomes = data.val();
          SavedHomesArr = [];
          for (PropId in SavedHomes) {
            SavedHomesArr.push(PropId);
          }

          for (i = 0; i < SavedHomesArr.length; i++) {
            if (i % 4 == 0 && i !== 0) {
              $(".SavedProperties").append('<div class="w-100"></div>');
              $(".SavedProperties").append(
                '<div class="col-md-3"><div class="card SavedPropertyCard"><i class="far fa-heart SavedHeart" data-status="on" id="' +
                  i +
                  '"data-toggle="tooltip" data-placement="top" title="unsave this home"></i><img src="' +
                  SavedHomes[SavedHomesArr[i]].favphoto +
                  '" class="card-img-top" height="200"><p class="overlay">' +
                  SavedHomes[SavedHomesArr[i]].favprice +
                  '</p><div class="card-body"><div class="row"><div class="col">' +
                  SavedHomes[SavedHomesArr[i]].favbeds +
                  " beds | " +
                  SavedHomes[SavedHomesArr[i]].favbaths +
                  " baths | " +
                  SavedHomes[SavedHomesArr[i]].favsqft +
                  ' sqft</div><div class="w-100"></div><div class="col"><strong>' +
                  SavedHomes[SavedHomesArr[i]].favaddress +
                  '</strong></div><div class="w-100"><div class="col"><button type="button" class="btn btn-secondary savedopenmap" data-id="' +
                  i +
                  '">Open Map</button></div></div></div></div></div>'
              );
            } else {
              $(".SavedProperties").append(
                '<div class="col-md-3"><div class="card SavedPropertyCard"><i class="far fa-heart SavedHeart" data-status="on" id="' +
                  i +
                  '"data-toggle="tooltip" data-placement="top" title="unsave this home"></i><img src="' +
                  SavedHomes[SavedHomesArr[i]].favphoto +
                  '" class="card-img-top" height="200"><p class="overlay">' +
                  SavedHomes[SavedHomesArr[i]].favprice +
                  '</p><div class="card-body"><div class="row"><div class="col">' +
                  SavedHomes[SavedHomesArr[i]].favbeds +
                  " beds | " +
                  SavedHomes[SavedHomesArr[i]].favbaths +
                  " baths | " +
                  SavedHomes[SavedHomesArr[i]].favsqft +
                  ' sqft</div><div class="w-100"></div><div class="col"><strong>' +
                  SavedHomes[SavedHomesArr[i]].favaddress +
                  '</strong></div><div class="w-100"><div class="col"><button type="button" class="btn btn-secondary savedopenmap" data-id="' +
                  i +
                  '">Open Map</button></div></div></div></div></div>'
              );
            }
          }
          //////////////////////////////////////
        });
      });
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
