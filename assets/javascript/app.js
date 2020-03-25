var Photo;
var result = [];
var Lat, Lon;

$(document).ready(function() {
  // API call when search button clicked
  $("#search").on("click", function(event) {
     //Prevents the page from refreshing when the button is clicked
    event.preventDefault();
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
      // Request property data via ajax from realtor api through rapidapi
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
          "x-rapidapi-key": "7f6807f23bmsh0797a1d4ca8a067p10f0bajsnc10b5c239d52"
        }
      // Put the property results into the properties div in 'cards'
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
            $(".properties").append(
              '<div class="col"><div class="card " data-id="' +
                i +
                '"><img src="' +
                Photo +
                '" class="card-img-top"><p class="price">' +
                result[i].price +
                '</p><div class="card-body">' +
                result[i].beds +
                " beds | " +
                result[i].baths +
                " baths | " +
                result[i].sqft.split(" ")[0] +
                ' sqft</div><div class="col">' +
                result[i].address +
                "</div></div></div>"
            );
        }
      });
    }
  });

  // Open the Google Map on click of the property card 
  $(document).on("click", ".card", function() {
    console.log("called");
    var Id = $(this).attr("data-id");
    Lat = result[Id].lat;
    Lon = result[Id].lon;
    initMap(Lat, Lon);
    $(".modal").show();
  });

  // Close 'X' on map modal
  $(".close").on("click", function() {
    $(".modal").hide();
  });
});

// Google Map - needs to remain outside of the document ready function
function initMap(Lat, Lon) {
  var location = { lat: Lat, lng: Lon };
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: location
  });
  var marker = new google.maps.Marker({ position: location, map: map });
}
