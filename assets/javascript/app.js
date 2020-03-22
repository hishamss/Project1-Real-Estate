var Photo;
var result = [];
var Lat, Lon;
$(document).ready(function() {
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

  // $(function() {
  //   // IMPORTANT: Fill in your client key
  //   var clientKey =
  //     "js-0CPYQ0Fzjgzo483l0DqjZocTE7K18SexqKR4W118LrbeK8SC97yALL8ATccwidKz";

  //   var cache = {};
  //   var container = $("#example1");
  //   var errorDiv = container.find("div.text-error");

  //   /** Handle successful response */
  //   function handleResp(data) {
  //     // Check for error
  //     if (data.error_msg) errorDiv.text(data.error_msg);
  //     else if ("city" in data) {
  //       // Set city and state
  //       container.find("input[name='city']").val(data.city);
  //       container.find("input[name='state']").val(data.state);
  //     }
  //   }

  //   // Set up event handlers
  //   container
  //     .find("input[name='zipcode']")
  //     .on("keyup change", function() {
  //       // Get zip code
  //       var zipcode = $(this)
  //         .val()
  //         .substring(0, 5);
  //       if (zipcode.length == 5 && /^[0-9]+$/.test(zipcode)) {
  //         // Clear error
  //         errorDiv.empty();

  //         // Check cache
  //         if (zipcode in cache) {
  //           handleResp(cache[zipcode]);
  //         } else {
  //           // Build url
  //           var url =
  //             "https://www.zipcodeapi.com/rest/" +
  //             clientKey +
  //             "/info.json/" +
  //             zipcode +
  //             "/radians";

  //           // Make AJAX request
  //           $.ajax({
  //             url: url,
  //             dataType: "json"
  //           })
  //             .done(function(data) {
  //               handleResp(data);

  //               // Store in cache
  //               cache[zipcode] = data;
  //             })
  //             .fail(function(data) {
  //               if (
  //                 data.responseText &&
  //                 (json = $.parseJSON(data.responseText))
  //               ) {
  //                 // Store in cache
  //                 cache[zipcode] = json;

  //                 // Check for error
  //                 if (json.error_msg) errorDiv.text(json.error_msg);
  //               } else errorDiv.text("Request failed.");
  //             });
  //         }
  //       }
  //     })
  //     .trigger("change");
  // });

  $(document).on("click", ".PropertyCard", function() {
    console.log("called");
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
  // var database = firebase.database();

  $("#signup").on("click", function() {
    $(".SignUpMap").show();
  });

  $("#singupclose").on("click", function() {
    $(".SignUpMap").hide();
  });
  $("#signupsubmit").on("click", function() {
    event.preventDefault();
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
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage);
          // ...
        });
      console.log(Auth);
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
