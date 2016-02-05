var pansnap = angular.module('starter', ['ionic', 'ngCordova', 'firebase'])
var fb       = new Firebase("https://fiery-heat-2673.firebaseio.com/");

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
  
  .state('login', {
    url         : '/',
    templateUrl : 'templates/login.html',
    controller  :  'LoginCtrl'
  })
  
  .state('signup', {
    url         : '/signup',
    templateUrl : 'templates/signup.html',
    controller  :  'LoginCtrl'
  })
  
  .state('signin', {
    url         : '/signin',
    templateUrl : 'templates/signin.html',
    controller  :  'LoginCtrl'
  })
  
    .state('map', {
    url         : '/map',
    templateUrl : 'templates/map.html',
    controller  :  'MapCtrl'
  })
 
  $urlRouterProvider.otherwise("/");
})

pansnap.controller('LoginCtrl', function($scope, $state, $cordovaFacebook, $window) {
  $scope.data = {};
  
  $scope.signupEmail = function() {
    var ref = new Firebase("https://fiery-heat-2673.firebaseio.com");
    ref.createUser({
      username : $scope.data.username,
      email    : $scope.data.email,
      password : $scope.data.password
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
          alert("Error creating user:" + error);
      } else {
          console.log("Successfully created user account with uid:", userData.uid);
          // redirect to map.html
          $window.location.href='#/map';
      }
    });
  };
  
  $scope.loginEmail = function() {
    var ref = new Firebase("https://fiery-heat-2673.firebaseio.com");
    var credentials = {
      email    : $scope.data.email,
      password : $scope.data.password
    }
    ref.authWithPassword(credentials, 
      function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          alert("Login Failed!" + error);
      } else {
          console.log("Authenticated successfully with payload:", authData);
          // redirect to map.html
          $window.location.href='#/map';      
      }
    });
  };

})


pansnap.controller('MapCtrl', function($scope, $state, $ionicHistory, $firebaseArray, $cordovaCamera, $cordovaGeolocation) {
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

    $cordovaCamera.getPicture(options).then(function(imageData) {
        syncArray.$add({image: imageData}).then(function(){
          alert("Image saved");
        });
      }, function(error) {
          console.error("ERROR: " + error);
    });
  } 

  $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
  
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
        animation : google.maps.Animation.DROP
        });
      
      posArray.push(lat, long);
      console.log(posArray);
    
     });
    }, 
    function (error) {
      console.log("Could not get a location");
  });
});





















