//  initiate module, call dependecies and tag database
var pansnap = angular.module('starter', ['ionic', 'ngCordova', 'firebase'])
var fb      = new Firebase("https://fiery-heat-2673.firebaseio.com/");

//  ********
pansnap.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins && window.cordove.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

//  create states
pansnap.config(function($stateProvider, $urlRouterProvider) { 
  $stateProvider
  
  .state('firebase', {
    url         : '/firebase',
    templateUrl : 'templates/firebase.html',
    controller  : 'FirebaseCtrl',
    cache       : false
  })
  
  .state('secure', {
    url         : '/secure',
    templateUrl : 'templates/secure.html',
    controller  :  'SecureCtrl'
  })
  
  .state('map', {
    url         : '/map',
    templateUrl : 'templates/map.html',
    controller  :  'SecureCtrl'
  })

  .state('profile', {
    url         : '/profile',
    templateUrl : 'templates/profile.html',
    controller  :  'SecureCtrl'
  })
  
  $urlRouterProvider.otherwise("/firebase");
})

// authorization controller
pansnap.controller('FirebaseCtrl', function($scope, $state, $firebaseAuth, $window) {
  var fbAuth = $firebaseAuth(fb);
  
  //  login 
  $scope.login = function(username, password) {
    fbAuth.$authWithPassword({
      email    : username,
      password : password
    })
    .then(function(authData) {
        $state.go("map");
    })
    .catch(function(error) {
      alert("ERROR: " + error);
    });
  }
  
  //  sign up 
  $scope.register = function(username, password) {
    fbAuth.$createUser({email: username, password: password}).then(function(userData) {
      return fbAuth.$authWithPassword({
        email    : username,
        password : password
      });
    })
    .then(function(authData) {
      $state.go("map");
    })
    .catch(function(error) {
      alert("ERROR: " + error);
    });
  }

});

//  Camera and Map controller
pansnap.controller('SecureCtrl', function($scope, $state, /*$ionicHistory,*/ $firebaseArray, $cordovaCamera, $cordovaGeolocation) {

  //  $ionicHistory.currentView();
  
  //  empty array to store pics
  $scope.images = [];

  //  test if user is authorized
  var fbAuth = fb.getAuth();
  if(fbAuth) {
    var userReference = fb.child("users/" + fbAuth.uid);
    var syncArray     = $firebaseArray(userReference.child("images"));
    $scope.images     = syncArray;
  } else {
    $state.go("firebase");
  }

  //  picture upload settings
  $scope.upload = function() {
    var options = {
      quality          : 75,
      destinationType  : Camera.DestinationType.DATA_URL,
      sourceType       : Camera.PictureSourceType.CAMERA,
      allowEdit        : true,
      encodingType     : Camera.EncodingType.JPEG,
      popoverOptions   : CameraPopoverOptions,
      targetWidth      : 500,
      targetHeight     : 500,
      saveToPhotoAlbum : true
    };

    //  send user to gallery page
    $state.go("secure");

    //  open device camera, send picture to image array
    $cordovaCamera.getPicture(options).then(function(imageData) {
        syncArray.$add({image: imageData}).then(function(){
          alert("Image saved");
        });
      }, function(error) {
          console.error("ERROR: " + error);
    });
  }; 

  //  define click functions for view buttons
  $scope.mapBack = function() {
    $state.go("map");
  };
  $scope.toProfile = function() {
    $state.go("profile");
  };
  $scope.toSecure = function() {
    $state.go("secure");
  };

  //  array to collect location data
  var posArray = [];
  //  tracking settings
  var watchOptions = {timeout : 15000, enableHighAccuracy: true};
  //  location watch, map load and position save
  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  console.log('listening');

  watch.then(
   null,
   
   function(err) {
      console.log(err)
   },
   
   // collect user position
   function(position) {
    var lat  = position.coords.latitude
    var long = position.coords.longitude
    var latLng   = new google.maps.LatLng(lat, long)
    var mapOptions = {
      timeout   : 5000,
      center    : latLng,
      zoom      : 18,
      mapTypeId : google.maps.MapTypeId.ROADMAP
      };
    
    //  create map
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
    //  function for marker
    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
      var marker = new google.maps.Marker({
        icon : {
          path               : google.maps.SymbolPath.CIRCLE,
          scale              : 6,
          color              : 'blue',
          enableHighAccuracy : true,
          },
        position  : new google.maps.LatLng(lat, long),
        map       : $scope.map,
        animation : google.maps.Animation.DROP,
        position  : latLng
        });
      
      //  push lat/long to array
      posArray.push(lat, long);
      console.log(posArray);

    });
    }, 
    function (error) {
      console.log("Could not get a location");
    }, 
    function(err) {
      console.log(err)
    })
    //  link lat/long points on array with polylines
    var polyLine = new google.maps.Polyline({
      path: posArray,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
});


































