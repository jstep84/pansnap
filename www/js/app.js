// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins && window.cordove.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    Parse.initialize("YOUR APP ID", "JAVASCRIPT KEY")
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url: '/',
    templateUrl: 'templates/login.html',
    controller:  'LoginCtrl'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller:  'LoginCtrl'
  })
  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller:  'LoginCtrl'
  })
  .state('map', {
    url: '/map',
    templateUrl: 'templates/map.html',
    controller:  'MapCtrl'
  })
 
  $urlRouterProvider.otherwise("/");
})

.controller('LoginCtrl', function($scope, $state, $cordovaFacebook, $window) {
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
      email : $scope.data.email,
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

  $scope.loginFacebook = function(){
    var ref = new Firebase("https://fiery-heat-2673.firebaseio.com");
    
    if(ionic.Platform.isWebView()){
      $cordovaFacebook.login(["public_profile", "email"]).then(function(success){
      console.log(success);
      ref.authWithOAuthToken("facebook", success.authResponse.accessToken, function(error, authData) {
        if (error) {
          console.log('Firebase login failed!', error);
        } else {
          console.log('Authenticated successfully with payload:', authData);
          // redirect to map.html
          $window.location.href='#/map';
        }
      });
 
    }, function(error){
      console.log(error);
    });        
 
    }
    else {
      ref.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
        }
      });
    }
  };
})

/*.controller('MapCtrl', function($scope, $ionicLoading) {
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
    animation :  google.maps.Animation.DROP
  });

  navigator.geolocation.watchPosition(function(pos) {
    
    map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
    
    var myLocation = new google.maps.Marker({
        icon       : {
        path       : google.maps.SymbolPath.CIRCLE,
        scale      : 8,
        color  : 'blue',
        enableHighAccuracy : true, 
      },
      position  : new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
      map       : map,
      title     : "My Location",
      animation : google.maps.Animation.DROP
    });

  });
  
  $scope.map = map;

});*/


.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
  var options = {timeout: 5000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = {
      center: latLng,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
      
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation : google.maps.Animation.DROP,
        position  : latLng,
        draggable : true,
        icon      : {
          path    : google.maps.SymbolPath.CIRCLE,
          scale   : 8,
          color   : 'blue'
        }
    });
    
    var infoWindow = new google.maps.InfoWindow({
      content: "Here I am!"
    });

    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open($scope.map, marker);
    });
  });

  }, function (error) {
      console.log("Could not get a location");
  });
});    

    /*navigator.geolocation.watchPosition(function(pos) {
    map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
    var myLocation = new google.maps.Marker({
      position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
      map: map,
      title: "My Location"
    });*/








