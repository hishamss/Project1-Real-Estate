//variables
var Photo;
var result = [];
var Lat, Lon;
var UID;
var UserEmail;
var SavedHomesArr = [];
var SavedHomes;
var ZipLat, ZipLng;

// jQuery document ready makes sure all html is loaded before running script
$(document).ready(function () {
  $("#schoolsspinner").hide();
  $("#yelpSpinner").hide();
  $("#homesspinner").hide();
  $("#schoolsheader").hide();
  $("#homesheader").hide();
  $("#yelpheader").hide();
  $(".SavedHomes").hide();
  $(".signoutbtn").hide();
  $(".savedbtn").hide();
  // $(".extra").hide();
  // API call when search button clicked
  $("#searchBtn").on("click", function () {
    // $(".extra").show();
    $("#schoolsspinner").show();
    $("#schoolsheader").show();
    $("#yelpSpinner").show();
    $("#yelpheader").show();
    $("#homesspinner").show();
    $("#homesheader").show();
    // $(".schools").hide();
    $(".SavedHomes").hide();
    $(".result").show();
    $(".properties").hide();
    zipcode = $(".userInput").val().trim();
    if (
      $(".radius").val().trim() &&
      /^[0-9]+$/.test($(".radius").val().trim())
    ) {
      radius = "radius=" + $(".radius").val().trim() + "&";
    } else {
      radius = "";
    }

    // check if input is empty and the input is numbers only
    if (zipcode !== "" && /^[0-9]+$/.test(zipcode)) {
      // zip to lat, lon API call
      $.ajax({
        async: "true",
        crossDomain: "true",
        url:
          "https://redline-redline-zipcode.p.rapidapi.com/rest/multi-info.json/" +
          zipcode +
          "/degrees",
        method: "GET",
        headers: {
          "x-rapidapi-host": "redline-redline-zipcode.p.rapidapi.com",
          "x-rapidapi-key":
            "05068e4ea0msh2bd159bb20ee682p1b3511jsn33e4d4be9936",
        },
      }).done(function (data) {
        // Yelp API
        $.ajax({
          url:
            "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?limit=10&latitude=" +
            data[zipcode].lat +
            "&longitude=" +
            data[zipcode].lng,
          // + "&zip_code=" +
          // zipcode,
          headers: {
            Authorization:
              "Bearer pf8EZ3kG6Cn-r8KdLxDg5Q3swc74ClJMQSFaZls_O-mUNmhcCouXdL0p-t-a1rg8NkklmMLNxIOJ9oEFQPpiNfQuRGDTvavc3Kvbkmxa76g6_oIJrJ_A3etu5dJ6XnYx",
          },
          method: "GET",
          dataType: "json",
          success: function (data) {
            console.log(data);
            $(".yelp").text("");
            for (places of data.businesses) {
              title = "";
              for (cat of places.categories) {
                title += cat.title + ", ";
              }
              $(".yelp").append(
                '<div class="col"><div class="row"><div class="col-md-2"><span class="fa-stack fa-2x"><i class="fas fa-circle fa-stack-2x"></i><span class="fa-stack-1x" style="color:white; font-size:20px">' +
                  places.rating +
                  "/5" +
                  '</span></span></div><div class="col-md-10"><h5><a style="color:#2e5677" href="' +
                  places.url +
                  '" target="_blank">' +
                  places.name +
                  "</a></h5><p>" +
                  title +
                  "</p></div></div></div><div class='w-100'></div>"
              );
              $("#yelpSpinner").hide();
              $(".yelp").show();
            }
          },
        });
        /////////////////
        $.ajax({
          async: "true",
          crossDomain: "true",
          url:
            "https://realtor.p.rapidapi.com/schools/list-nearby?lon=" +
            data[zipcode].lng +
            "&lat=" +
            data[zipcode].lat,
          method: "GET",
          headers: {
            "x-rapidapi-host": "realtor.p.rapidapi.com",
            "x-rapidapi-key":
              "05068e4ea0msh2bd159bb20ee682p1b3511jsn33e4d4be9936",
          },
        }).done(function (data) {
          console.log(data);
          $(".schools").text("");
          for (school of data.schools) {
            var rating = school.ratings.parent_rating;
            GreatSchoolId = school.greatschools_id;
            GreatSchoolId = GreatSchoolId.substr(GreatSchoolId.length - 5);
            State = school.location.state;
            if (rating) {
              rating = rating + "/5";
            } else {
              rating = "N/A";
            }
            $(".schools").append(
              '<div class="col"><div class="row"><div class="col-md-2"><span class="fa-stack fa-2x"><i class="fas fa-circle fa-stack-2x"></i><span class="fa-stack-1x" style="color:white; font-size:20px">' +
                rating +
                '</span></span></div><div class="col-md-10"><h5 ><a style="color:#2e5677" href="https://www.greatschools.org/school?id=' +
                GreatSchoolId +
                "&state=" +
                State +
                '" target="_blank">' +
                school.name +
                "</a></h5><p>Grades: " +
                school.grades.range.low +
                "-" +
                school.grades.range.high +
                "</p></div></div></div><div class='w-100'></div>"
            );
            $("#schoolsspinner").hide();
            $(".schools").show();
          }
        });
      });

      // real estate API call
      $.ajax({
        async: "true",
        crossDomain: "true",
        url:
          "https://realtor.p.rapidapi.com/properties/list-for-sale?sort=relevance&" +
          radius +
          "postal_code=" +
          zipcode +
          "&offset=0&limit=12",
        method: "GET",
        headers: {
          "x-rapidapi-host": "realtor.p.rapidapi.com",
          "x-rapidapi-key":
            "05068e4ea0msh2bd159bb20ee682p1b3511jsn33e4d4be9936",
        },
        // Put the property results into the properties div in 'cards'
      }).done(function (data) {
        result = data.listings;
        console.log(result);
        $(".properties").text("");
        for (i = 0; i < result.length; i++) {
          Photo = result[i].photo;
          if (!Photo) {
            Photo = "assets/images/noImage.jpg";
          }
          if (i % 4 == 0 && i !== 0) {
            $(".properties").append('<div class="w-100"></div>');
            $(".properties").append(
              '<div class="col"><div class="card PropertyCard"><i class="far fa-heart SearchHeart" data-status="off" id="' +
                i +
                '"data-toggle="tooltip" data-placement="top" title="save this home"></i><img src="' +
                Photo +
                '" class="card-img-top" height="200"><p class="overlay"><strong>' +
                result[i].price +
                '</strong></p><div class="card-body"><div class="row"><div class="col">' +
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
              '<div class="col"><div class="card PropertyCard"><i class="far fa-heart SearchHeart" data-status="off" id="' +
                i +
                '"data-toggle="tooltip" data-placement="top" title="save this home"></i><img src="' +
                Photo +
                '" class="card-img-top" height="200"><p class="overlay"><strong>' +
                result[i].price +
                '</strong></p><div class="card-body"><div class="row"><div class="col">' +
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
        $("#homesspinner").hide();
        $(".properties").show();
      });
    }
  });

  $(document).on("click", ".SavedHeart", function () {
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
        favlon: SavedHomes[SavedHomesArr[Id]].favlon,
      });
      Clicked.css("color", "red");
      Clicked.attr("data-status", "on");
      Clicked.attr("title", "unsave this home");
    }
  });

  $(document).on("click", ".SearchHeart", function () {
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
          .then(function (snapshot) {
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
                favlon: favlon,
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
          .then(function (snapshot) {
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
      alert("Please log in or create an account");
    }
  });

  $(document).on("click", ".openmap", function () {
    var Id = $(this).attr("data-id");
    Lat = result[Id].lat;
    Lon = result[Id].lon;
    initMap(Lat, Lon);
    // BodyHeight = $("body").height();
    // console.log("body:" + BodyHeight);
    // ModPos = BodyHeight * 0.5 - $(".modalMap").height() / 2;
    // ModPos = -1 * ModPos;
    // console.log("modal: " + $(".modalMap").height());
    // $(".modalMap").css("margin-bottom", ModPos);
    $(".modalMap").show();
  });

  $(document).on("click", ".savedopenmap", function () {
    var Id = $(this).attr("data-id");
    Lat = SavedHomes[SavedHomesArr[Id]].favlat;
    Lon = SavedHomes[SavedHomesArr[Id]].favlon;
    initMap(Lat, Lon);
    $(".modalMap").show();
  });

  $("#close").on("click", function () {
    $(".modalMap").hide();
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
    appId: "1:1086203608176:web:a1ae5db94335a8626148b5",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

  $("#signup").on("click", function () {
    $("#signupemail").val("");
    $("#signuppassword").val("");
    $("#signupmessage").text("");
    $(".signUpMod").show();
  });

  $(".signupclose").on("click", function () {
    $(".signUpMod").hide();
  });

  $("#signin").on("click", function () {
    $("#signinemail").val("");
    $("#signinpassword").val("");
    $("#signinmessage").text("");
    $(".signInMod").show();
  });

  $(".signinclose").on("click", function () {
    $(".signInMod").hide();
  });
  $("#signupsubmit").on("click", function (event) {
    event.preventDefault();
    $("#signupmessage").text("");
    Email = $("#signupemail").val().trim();
    Password = $("#signuppassword").val().trim();
    if (Email && Password) {
      var Auth = firebase
        .auth()
        .createUserWithEmailAndPassword(Email, Password)
        .then(function (User) {
          UserEmail = User.user.email;
          $("#signupmessage").text("Signed Up successfully");
          $(".signupbtn").hide();
          $(".signinbtn").hide();
          $(".signoutbtn").show();
          $(".savedbtn").show();
          $("#currentuser").text(User.user.email);

          UID = User.user.uid;
          database.ref("/users/" + UID).update({
            email: User.user.email,
          });
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;

          $("#signupmessage").text(errorMessage);
        });
    }
  });

  $("#signinsubmit").on("click", function (event) {
    event.preventDefault();
    UserEmail = $("#signinemail").val().trim();
    UserPassword = $("#signinpassword").val().trim();
    if (UserEmail && UserPassword) {
      firebase
        .auth()
        .signInWithEmailAndPassword(UserEmail, UserPassword)
        .then(function (User) {
          UserEmail = User.user.email;
          $("#signinmessage").text("Logged In successfully");
          UID = User.user.uid;
          $(".signupbtn").hide();
          $(".signinbtn").hide();
          $(".signoutbtn").show();
          $(".savedbtn").show();
          $("#currentuser").text(User.user.email);
          database.ref("/users/" + UID).update({
            email: User.user.email,
          });
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          $("#signinmessage").text(errorMessage);
          // ...
        });
    }
  });

  $("#signout").on("click", function () {
    firebase
      .auth()
      .signOut()
      .then(function () {
        // Sign-out successful.
        $(".SavedHomes").hide();
        $(".properties").text("");
        $(".result").show();
        SignedUpOrIn = false;
        database.ref("/users/" + UID).remove();
        $(".signinbtn").show();
        $(".signupbtn").show();
        $(".savedbtn").hide();
        $(".signoutbtn").hide();
        $("#currentuser").text("");
        UID = undefined;
        $(".fa-heart").attr("data-status", "off");
        $(".fa-heart").css("color", "white");
      })
      .catch(function (error) {
        // An error happened.
      });
  });
  // log out the user when closed the browser
  $(window).on("unload", function () {
    if (UID) {
      database.ref("/users/" + UID).remove();
    }
  });

  $("#saved").on("click", function () {
    $(".result").hide();
    $("#homesheader").hide();
    $("#schoolsheader").hide();
    $("#yelpheader").hide();
    $(".SavedHomes").show();
    $(".SavedProperties").text("");
    // check if there are saved homes
    database
      .ref("/favorites/" + UID)
      .once("value")
      .then(function (snapshot) {
        console.log("exitst :" + snapshot.exists());
        database.ref("/favorites/" + UID).once("value", function (data) {
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
        });
      });
  });
}); //end document ready

function initMap(Lat, Lon) {
  var location = { lat: Lat, lng: Lon };
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: location,
  });
  var marker = new google.maps.Marker({ position: location, map: map });
}

// WEATHER API --------------------------------------------------------------------------------------------------------------------------

// This is our API key
var appID = "27f932af50bf7081ba92dbe383500085";
var units = "imperial";
var searchMethod = "zip";

function searchWeather(searchTerm) {
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&appid=${appID}&units=${units}`
  )
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      init(result);
    });
}

function init(resultFromServer) {
  console.log(resultFromServer);

  var weatherDescriptionHeader = document.getElementById(
    "weatherDescriptionHeader"
  );
  var temperatureElement = document.getElementById("temperature");
  var humidityElement = document.getElementById("humidity");
  var windSpeedElement = document.getElementById("windSpeed");
  var cityHeader = document.getElementById("cityHeader");
  var weatherIcon = document.getElementById("weatherIcon");

  weatherIcon.src =
    "http://openweathermap.org/img/w/" +
    resultFromServer.weather[0].icon +
    ".png";

  var resultDescription = resultFromServer.weather[0].description;
  weatherDescriptionHeader.innerText = resultDescription + ",";

  temperatureElement.innerHTML =
    Math.floor(resultFromServer.main.temp) + "&#176 with a";
  windSpeedElement.innerHTML =
    "the winds are at " + Math.floor(resultFromServer.wind.speed) + " m/s";
  cityHeader.innerHTML = "In " + resultFromServer.name + ", it's";
  humidityElement.innerHTML =
    "and humidity levels are at " + resultFromServer.main.humidity + "%";
}

document.getElementById("searchBtn").addEventListener("click", () => {
  var searchTerm = document.getElementById("searchInput").value;
  if (searchTerm) searchWeather(searchTerm);
});
