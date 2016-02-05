.controller('MapCtrl', function($scope, $ionicLoading) {
  var myLatlng   = new google.maps.LatLng(37.3000, -120.4833);
  var mapOptions = {
    center    : myLatlng,
    zoom      : 16,
    MapTypeId : google.maps.MapTypeId.ROADMAP
  };

  var map     =  new google.maps.Map(document.getElementById("map"), mapOptions);
  var marker  =  new google.maps.Marker({
    position  :  myLatlng,
    map       :  map,
    draggable :  true,
    animation :  google.maps.Animation.FADE
  });

  var posArray = [];


  navigator.geolocation.watchPosition(function(pos) {

    var lat = Math.floor(pos.coords.latitude * 1000 + 0.5) / 1000;
    var long = Math.floor(pos.coords.longitude * 1000 + 0.5) / 1000;
    
    map.setCenter(new google.maps.LatLng(lat, long));
    var myLocation = new google.maps.Marker({
        icon : {
          path               : google.maps.SymbolPath.CIRCLE,
          scale              : 4,
          color              : 'blue',
          enableHighAccuracy : false,
        },
        position  : new google.maps.LatLng(lat, long),
        map       : map,
        title     : "My Location",
        animation : google.maps.Animation.FADE
    });

    posArray.push(lat, long);
    console.log(posArray);

  });
});