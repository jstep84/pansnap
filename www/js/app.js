var pansnap = angular.module('starter', ['ionic', 'ngCordova', 'firebase'])
var fb      = new Firebase("https://fiery-heat-2673.firebaseio.com/");

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

pansnap.controller('FirebaseCtrl', function($scope, $state, $firebaseAuth, $window) {
  var fbAuth = $firebaseAuth(fb);
  
  $scope.login = function(username, password) {
    fbAuth.$authWithPassword({
      email    : username,
      password : password
    })
    .then(function(authData) {
        $state.go("map");
    })
    .catch(function(error) {
      console.error("ERROR: " + error);
    });
  }
  
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
      console.error("ERROR: " + error);
    });
  }

});

pansnap.controller('SecureCtrl', function($scope, $state, $ionicHistory, $firebaseArray, $cordovaCamera) {
  var options  = { enableHighAccuracy: true};
  var posArray = [];

  $ionicHistory.clearHistory();
  $scope.images = [];

  var fbAuth = fb.getAuth();
  if(fbAuth) {
    var userReference = fb.child("users/" + fbAuth.uid);
    var syncArray     = $firebaseArray(userReference.child("images"));
    $scope.images     = syncArray;
  } else {
    $state.go("firebase");
  }

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
      saveToPhotoAlbum : false
    };

    $state.go("map");

    $cordovaCamera.getPicture(options).then(function(imageData) {
        syncArray.$add({image: imageData}).then(function(){
          alert("Image saved");
        });
      }, function(error) {
          console.error("ERROR: " + error);
    });
  }; 

  $scope.mapBack = function() {
    $state.go("map");
  };
  $scope.toProfile = function() {
    $state.go("profile");
  };
  $scope.toSecure = function() {
    $state.go("secure");
  };


  /*$cordovaGeolocation.getCurrentPosition(options).then(function(position) {
  
    var lat      = position.coords.latitude;
    var long     = position.coords.longitude;
    var latLng   = new google.maps.LatLng(lat, long);
    
    var mapOptions = {
      center    : latLng,
      zoom      : 18,
      mapTypeId : google.maps.MapTypeId.ROADMAP
    };
    
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
      var marker = new google.maps.Marker({
        icon : {
          path               : google.maps.SymbolPath.CIRCLE,
          scale              : 4,
          color              : 'blue',
          enableHighAccuracy : true,
          },
        position  : new google.maps.LatLng(lat, long),
        map       : $scope.map,
        animation : google.maps.Animation.DROP,
        position  : latLng
        });
      
      posArray.push(lat, long);
      console.log(posArray);
    
     });
    }, 
    function (error) {
      console.log("Could not get a location");
  });*/
});





















